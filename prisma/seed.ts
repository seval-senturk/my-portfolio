import { hash } from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required for seeding.",
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email,
      name: "Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.info(`Seeded admin user: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
