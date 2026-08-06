import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding...")

  // Clear existing data
  await prisma.claim.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      role: "USER",
    },
  })

  // Create claims
  await prisma.claim.create({
    data: {
      vendor: "Amazon",
      amount: 120.5,
      date: new Date(),
      status: "pending",
      userId: user.id,
    },
  })

  console.log("✅ Seed completed")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })