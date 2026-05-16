import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createTask } from '../../api/tasks'
import { taskSchema } from '../../validators'
import type { TaskFormData } from '../../validators'
import { Navbar } from '../../components/Navbar'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

export function TaskNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<TaskFormData>({ title: '', description: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = taskSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TaskFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TaskFormData
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      await createTask({
        title: result.data.title,
        description: result.data.description || null,
      })
      navigate('/tasks')
    } catch {
      setApiError('Erro ao criar tarefa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-6 py-10">
        <Link
          to="/tasks"
          className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
        >
          ← Lista de tarefas
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black">
          Nova tarefa
        </h1>
        <p className="mt-1 mb-10 text-sm text-gray-500">
          Preencha os dados abaixo para criar uma nova tarefa.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <Input
            id="title"
            name="title"
            type="text"
            label="Título"
            placeholder="Ex: Implementar autenticação"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider text-black"
            >
              Descrição{' '}
              <span className="font-normal text-gray-400 normal-case tracking-normal">
                (opcional)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Descreva a tarefa com mais detalhes..."
              value={form.description ?? ''}
              onChange={handleChange}
              className="resize-none border-b-2 bg-transparent px-0 py-2 text-sm text-black outline-none transition placeholder:text-gray-300 border-gray-200 focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Toda tarefa começa como pendente
          </div>

          {apiError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">
              {apiError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/tasks')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Criar →
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}