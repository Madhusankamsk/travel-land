-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firstName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mobile" TEXT;

-- CreateIndex (mobile is unique in schema)
CREATE UNIQUE INDEX IF NOT EXISTS "users_mobile_key" ON "users"("mobile");
