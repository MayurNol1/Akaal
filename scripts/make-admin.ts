import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email: npx tsx scripts/make-admin.ts user@example.com");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
  } catch (error) {
    console.error("Error promoting user. Make sure the email exists in the database.");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

makeAdmin();
