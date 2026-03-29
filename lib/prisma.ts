import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function isRecoverableConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("server has closed the connection") ||
    message.includes("connection terminated unexpectedly") ||
    message.includes("connectionclosed")
  );
}

function normalizeConnectionString(rawConnectionString: string) {
  try {
    const parsed = new URL(rawConnectionString);
    const isSupabaseHost = parsed.hostname.endsWith(".pooler.supabase.com");
    if (isSupabaseHost && !parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    // Keep the original string; Prisma/pg will provide the validation error.
  }
  return rawConnectionString;
}

function createPrisma() {
  const rawDatabaseUrl = process.env.DATABASE_URL;
  const rawDirectUrl = process.env.DIRECT_URL;
  if (!rawDatabaseUrl && !rawDirectUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  // Prefer DIRECT_URL when available; pooled endpoints can intermittently close
  // long-lived app connections in local development.
  const preferredRawConnectionString = rawDirectUrl ?? rawDatabaseUrl!;
  const connectionString = normalizeConnectionString(preferredRawConnectionString);

  // Optional opt-in for local/dev environments with corporate/self-signed CAs.
  // When DB_TLS_INSECURE is set, we relax certificate validation at the driver
  // level regardless of sslmode in the URL. This should NOT be used in prod.
  const dbTlsInsecureFlag = String(process.env.DB_TLS_INSECURE ?? "").toLowerCase();
  const dbTlsInsecure =
    dbTlsInsecureFlag === "1" ||
    dbTlsInsecureFlag === "true" ||
    dbTlsInsecureFlag === "yes";

  // Dev-only: lightweight debug output to validate which connection is used and SSL behavior.
  if (process.env.NODE_ENV !== "production" && String(process.env.DEBUG_DB).toLowerCase() === "true") {
    try {
      const u = new URL(connectionString);
      if (u.password) u.password = "***";
      const usingDirect = Boolean(rawDirectUrl);
      const sslFromUrl = connectionString.includes("sslmode=require");
      // eslint-disable-next-line no-console
      console.log(
        `[db] Using ${usingDirect ? "DIRECT_URL" : "DATABASE_URL"} host=${u.hostname} sslmode=require=${sslFromUrl} DB_TLS_INSECURE=${dbTlsInsecure} conn=${u.toString()}`
      );
    } catch {
      // ignore parse errors here
    }
  }
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      keepAlive: true,
      ssl:
        dbTlsInsecure || connectionString.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          try {
            return await query(args);
          } catch (error) {
            if (!isRecoverableConnectionError(error)) throw error;
            return query(args);
          }
        },
      },
    },
  }) as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
