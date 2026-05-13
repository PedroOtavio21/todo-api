import express from 'express'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma'
import { authRouter } from './routes/auth'
import { taskRouter } from './routes/tasks'
import { errorHandler } from './middlewares/error-handler'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/v1', authRouter)
app.use('/api/v1', taskRouter)
app.use(errorHandler)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Servidor iniciado em http://localhost:${PORT}`))

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})