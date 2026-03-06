import "dotenv/config";
import { config } from "dotenv";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env.local", override: true });

const connectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";
if (!connectionString) throw new Error("DATABASE_URL or DIRECT_URL required");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "aaa@bbb.com";
  const plainPassword = "123456";
  const hashedPassword = await hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      mobile: "0000000000",
      role: "admin",
      is_active: true,
    },
    create: {
      email,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      mobile: "0000000000",
      role: "admin",
      is_active: true,
    },
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
