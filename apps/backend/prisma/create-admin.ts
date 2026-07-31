import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      firstName: process.env.ADMIN_FIRST_NAME?.trim() || "Admin",
      lastName: process.env.ADMIN_LAST_NAME?.trim() || "HomeMatch",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      firstName: process.env.ADMIN_FIRST_NAME?.trim() || "Admin",
      lastName: process.env.ADMIN_LAST_NAME?.trim() || "HomeMatch",
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(`Admin ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
