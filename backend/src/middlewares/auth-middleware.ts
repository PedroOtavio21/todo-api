import { Handler } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: number
  email: string
}

export interface AuthRequest{
  user: {
    id: number
    email: string
  }
}

export const authMiddleware: Handler = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token not provided!' })
    return
  }

  const token = authHeader.split(' ')[1]

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined!')

  try {
    const payload = jwt.verify(token, secret) as JwtPayload
    (req as unknown as AuthRequest).user = { id: payload.id, email: payload.email }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token!' })
  }
}