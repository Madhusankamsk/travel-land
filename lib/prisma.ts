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
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      keepAlive: true,
      ssl: connectionString.includes("sslmode=require")
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
