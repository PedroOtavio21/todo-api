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
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <span
          className="cursor-pointer text-lg font-bold tracking-tight text-black hover:text-accent transition-colors duration-150"
          onClick={() => navigate('/tasks')}
        >
          TODO-API.
        </span>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {user?.name ?? user?.email}
          </span>
          <Button variant="ghost" onClick={handleLogout} className="text-xs px-3 py-2">
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}