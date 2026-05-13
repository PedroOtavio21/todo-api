import { prisma } from '../lib/prisma'
import { User } from '../models/UserModel'

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: Pick<User, 'email' | 'password'> & { name?: string }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    })
  }
}