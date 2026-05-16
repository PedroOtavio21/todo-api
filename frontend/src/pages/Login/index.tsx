import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../api/auth'
import { loginSchema } from '../../validators'
import type { LoginFormData } from '../../validators'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { saveAuth } = useAuth()

  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const { token, user } = await login(result.data)
      saveAuth(user, token)
      navigate('/tasks')
    } catch {
      setApiError('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">

      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-black text-white p-12">
        <span className="text-xl font-bold tracking-tight">TODO-API.</span>
        <div>
          <p className="text-5xl font-bold leading-tight">
            Organize.<br />
            <span className="text-accent">Execute.</span><br />
            Conquiste.
          </p>
          <p className="mt-6 text-gray-400 text-base max-w-xs">
            Gerencie suas tarefas com simplicidade e foco no que realmente importa.
          </p>
        </div>
        <p className="text-xs text-gray-600">© 2026 Todo-Api App</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <span className="lg:hidden block text-xl font-bold tracking-tight mb-10">TODO-API.</span>

          <h2 className="text-2xl font-bold text-black mb-1">Entrar</h2>
          <p className="text-sm text-gray-500 mb-8">
            Não tem conta?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            {apiError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                {apiError}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1">
              Entrar →
            </Button>
          </form>
        </div>
      </div>

    </div>
  )
}