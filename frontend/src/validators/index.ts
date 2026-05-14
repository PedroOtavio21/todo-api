import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'DONE']).default('PENDING'),
})

export const taskEditSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'DONE']).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type TaskEditFormData = z.infer<typeof taskEditSchema>