export type TaskStatus = 'PENDING' | 'DONE'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  userId: number
  createdAt: Date
  updatedAt: Date
}