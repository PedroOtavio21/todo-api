import api from './axios'
import type { User }  from '../types'

interface RegisterData {
  email: string
  password: string
  name?: string
}

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
}

export async function register(data: RegisterData): Promise<User> {
  const response = await api.post<User>('/register', data)
  return response.data
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await api.post<{ token: string }>('/login', data)
  const { token } = response.data

  const payload = JSON.parse(atob(token.split('.')[1]))

  const user: User = {
    id: payload.id,
    email: payload.email,
    createdAt: '',
    updatedAt: '',
  }

  return { token, user }
}