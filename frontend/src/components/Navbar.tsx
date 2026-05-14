import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './Button'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <span
          className="cursor-pointer text-base font-semibold text-blue-600"
          onClick={() => navigate('/tasks')}
        >
          Todo App
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {user?.name ?? user?.email}
          </span>
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}