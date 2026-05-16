import api from './axios'
import type { Task, TaskStatus } from '../types'

interface CreateTaskData {
  title: string
  description?: string | null
  status?: TaskStatus
}

interface UpdateTaskData {
  title?: string
  description?: string | null
  status?: TaskStatus
}

export async function getTasks(status?: TaskStatus): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks', {
    params: status ? { status } : undefined,
  })
  return response.data
}

export async function getTaskById(id: number): Promise<Task> {
  const response = await api.get<Task>(`/tasks/${id}`)
  return response.data
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const response = await api.post<Task>('/tasks', data)
  return response.data
}

export async function updateTask(id: number, data: UpdateTaskData): Promise<Task> {
  const response = await api.put<Task>(`/tasks/${id}`, data)
  return response.data
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}