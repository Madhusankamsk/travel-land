import "dotenv/config";
import { defineConfig } from "prisma/config";

// For Supabase: use DIRECT_URL for migrations (direct connection, port 5432)
// DATABASE_URL is used at runtime with the adapter (pooled, port 6543)
// Using process.env so "prisma generate" works without .env; set both for "prisma migrate"
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
