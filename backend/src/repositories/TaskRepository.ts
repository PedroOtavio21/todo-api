import { prisma } from '../lib/prisma'
import { Task, TaskStatus } from '../models/TaskModel'

export class TaskRepository {
  async findAll(userId: number, status?: TaskStatus): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { id: 'asc' },
    })
  }

  async findById(id: number, userId: number): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id, userId },
    })
  }

  async create(data: Pick<Task, 'title' | 'description' | 'status' | 'userId'>): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'PENDING',
        userId: data.userId,
      },
    })
  }

  async update(id: number, userId: number, data: Partial<Pick<Task, 'title' | 'description' | 'status'>>): Promise<Task | null> {
    const exists = await prisma.task.findUnique({ where: { id, userId } })
    if (!exists) return null

    return prisma.task.update({
      where: { id },
      data,
    })
  }

  async delete(id: number, userId: number): Promise<Task | null> {
    const exists = await prisma.task.findUnique({ where: { id, userId } })
    if (!exists) return null

    return prisma.task.delete({
      where: { id },
    })
  }
}