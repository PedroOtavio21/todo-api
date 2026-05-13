import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { HttpError } from '../errors/HttpError'
import { User } from '../models/UserModel'
import { UserRepository } from '../repositories/UserRepository'
import dotenv from 'dotenv'

dotenv.config()

export class UserService {
    constructor(private repository: UserRepository){}
    async register(data: Pick<User, "email" | "password"> & { name?: string }): Promise<Omit<User, "password">> {
        const existing = await this.repository.findByEmail(data.email)
        if (existing) throw new HttpError(404, 'Email already in use!')

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await this.repository.create({
            email: data.email,
            password: hashedPassword,
            name: data.name,
        })

        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    }
    async login(email: string, password: string): Promise<{ token: string }> {
        const user = await this.repository.findByEmail(email)
        if (!user) throw new HttpError(404, 'User not found!')

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) throw new HttpError(401, 'Invalid credentials!')

        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error('JWT_SECRET is not defined!')

        const payload = { id: user.id, email: user.email }
        const token = jwt.sign(
            payload,
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
        )

        return { token }
    }
}