import { createContext, useState } from 'react'
import type { User } from '../types'

interface AuthContextData {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  saveAuth: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext({} as AuthContextData)

function getStoredUser(): User | null {
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  function saveAuth(user: User, token: string) {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      saveAuth,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }