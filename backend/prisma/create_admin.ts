import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@claimflow.com";
  const password = "admin123!";


  
  /**
   * Hash admin password
   */
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  /**
   * Create admin if they don't exist.
   *
   * If they already exist,
   * update their role to ADMIN.
   */
  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      role: "ADMIN",
    },

    create: {
      name: "ClaimFlow Administrator",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(
    "========================================"
  );

  console.log(
    "Admin user created/updated successfully"
  );

  console.log(
    "========================================"
  );

  console.log(
    "ID:",
    admin.id
  );

  console.log(
    "Name:",
    admin.name
  );

  console.log(
    "Email:",
    admin.email
  );

  console.log(
    "Role:",
    admin.role
  );

  console.log(
    "Password:",
    password
  );

  console.log(
    "========================================"
  );
}

main()
  .catch((error) => {
    console.error(
      "SEED ERROR:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });