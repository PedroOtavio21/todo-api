export type TaskStatus = 'PENDING' | 'DONE'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  userId: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  name?: string | null
  email: string
  createdAt: string
  updatedAt: string
}