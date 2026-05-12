export type TaskStatus = 'PENDING' | 'DONE'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}