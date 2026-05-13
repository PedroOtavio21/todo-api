import z from 'zod'
import { UserService } from '../services/UserService'
import { Handler } from 'express'

const RegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
})

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export class UserController {
  constructor(private service: UserService) {}

  register: Handler = async (req, res, next) => {
    try {
      const body = RegisterSchema.parse(req.body)
      const user = await this.service.register(body)
      res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }

  login: Handler = async (req, res, next) => {
    try {
      const body = LoginSchema.parse(req.body)
      const result = await this.service.login(body.email, body.password)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}
