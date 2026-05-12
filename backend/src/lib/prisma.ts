import { config } from "dotenv"
config()
console.log("DB_USER:", process.env["DB_USER"])
console.log("DB_PASSWORD:", process.env["DB_PASSWORD"])
console.log("DB_NAME:", process.env["DB_NAME"])

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  host: process.env["DB_HOST"] ?? "localhost",
  port: Number(process.env["DB_PORT"] ?? 5432),
  user: process.env["DB_USER"],
  password: String(process.env["DB_PASSWORD"]), // ← força string explicitamente
  database: process.env["DB_NAME"],
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}