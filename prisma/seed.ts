import "dotenv/config";
import { config } from "dotenv";
import { hash } from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env.local", override: true });

const connectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";
if (!connectionString) throw new Error("DATABASE_URL or DIRECT_URL required");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function ensureUserProfileColumns() {
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firstName" TEXT;'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastName" TEXT;'
  );
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mobile" TEXT;'
  );
  try {
    await prisma.$executeRawUnsafe(
      'CREATE UNIQUE INDEX IF NOT EXISTS "users_mobile_key" ON "users"("mobile");'
    );
  } catch {
    // Index may already exist
  }
}

async function main() {
  await ensureUserProfileColumns();

  const email = "aaa@bbb.com";
  const hashedPassword = await hash("123456", 10);

  const createData: Prisma.UserCreateInput = {
    email,
    password: hashedPassword,
    firstName: "Admin",
    lastName: "User",
    mobile: "0000000000",
    role: "admin",
    is_active: true,
  } as Prisma.UserCreateInput;

  const updateData: Prisma.UserUpdateInput = {
    password: hashedPassword,
    firstName: "Admin",
    lastName: "User",
    mobile: "0000000000",
    role: "admin",
    is_active: true,
  } as Prisma.UserUpdateInput;

  await prisma.user.upsert({
    where: { email },
    update: updateData,
    create: createData,
  });

  console.log("Seed done: admin user", email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
