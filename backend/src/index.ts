import express from 'express'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma'

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Servidor iniciado em http://localhost:${PORT}`))

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})