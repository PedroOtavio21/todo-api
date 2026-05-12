// src/repositories/TaskRepository.ts
import { prisma } from '../lib/prisma'
import { Task, TaskStatus } from '../models/TasksModel'

export class TaskRepository {
  async findAll(status?: TaskStatus): Promise<Task[]> {
    return prisma.task.findMany({
      where: status ? { status } : undefined,
      orderBy: { id: 'asc' },
    })
  }

  async findById(id: number): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
    })
  }

  async create(data: Pick<Task, 'title' | 'description' | 'status'>): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'PENDING',
      },
    })
  }

  async update(id: number, data: Partial<Pick<Task, 'title' | 'description' | 'status'>>): Promise<Task | null> {
    const exists = await prisma.task.findUnique({ where: { id } })
    if (!exists) return null

    return prisma.task.update({
      where: { id },
      data,
    })
  }

  async delete(id: number): Promise<Task | null> {
    const exists = await prisma.task.findUnique({ where: { id } })
    if (!exists) return null

    return prisma.task.delete({
      where: { id },
    })
  }
}