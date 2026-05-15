import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/auth'
import { registerSchema } from '../../validators'
import type { RegisterFormData } from '../../validators'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

export function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterFormData>({ email: '', name: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
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

    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormData
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await register({
        email: result.data.email,
        password: result.data.password,
        name: result.data.name || undefined,
      })
      navigate('/login')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 400) {
        setApiError('Este e-mail já está cadastrado.')
      } else {
        setApiError('Erro ao criar conta. Tente novamente.')
      }
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
            Crie sua<br />
            conta e<br />
            <span className="text-accent">comece agora.</span>
          </p>
          <p className="mt-6 text-gray-400 text-base max-w-xs">
            Suas tarefas, organizadas do jeito que você precisa.
          </p>
        </div>
        <p className="text-xs text-gray-600">© 2026 Todo-Api App</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <span className="lg:hidden block text-xl font-bold tracking-tight mb-10">TODO-API.</span>

          <h2 className="text-2xl font-bold text-black mb-1">Criar conta</h2>
          <p className="text-sm text-gray-500 mb-8">
            Já tem conta?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Entrar
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="name"
              name="name"
              type="text"
              label="Nome"
              placeholder="Seu nome (opcional)"
              value={form.name ?? ''}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />
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
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />

            {apiError && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
                {apiError}
              </p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1">
              Criar conta →
            </Button>
          </form>
        </div>
      </div>

    </div>
  )
}