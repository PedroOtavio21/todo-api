import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getTaskById, updateTask } from '../../api/tasks'
import { taskSchema } from '../../validators'
import type { TaskFormData } from '../../validators'
import { Navbar } from '../../components/Navbar'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<TaskFormData>({ title: '', description: '', status: 'PENDING' })
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})
  const [apiError, setApiError] = useState('')
  const [loadingTask, setLoadingTask] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (!id) return
    async function fetchTask() {
      setLoadingTask(true)
      try {
        const task = await getTaskById(Number(id))
        setForm({
          title: task.title,
          description: task.description ?? '',
          status: task.status,
        })
      } catch {
        setFetchError('Não foi possível carregar a tarefa.')
      } finally {
        setLoadingTask(false)
      }
    }
    fetchTask()
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
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

    setSaving(true)
    try {
      await updateTask(Number(id), {
        title: result.data.title,
        description: result.data.description || null,
        status: result.data.status,
      })
      navigate(`/tasks/${id}`)
    } catch {
      setApiError('Erro ao atualizar tarefa. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-xl px-6 py-10">
        <Link
          to={`/tasks/${id}`}
          className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
        >
          ← Voltar para tarefa
        </Link>

        {loadingTask && (
          <div className="mt-16 flex justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
          </div>
        )}

        {!loadingTask && fetchError && (
          <p className="mt-8 text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2">
            {fetchError}
          </p>
        )}

        {!loadingTask && !fetchError && (
          <>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-black">
              Editar tarefa
            </h1>
            <p className="mt-1 mb-10 text-sm text-gray-500">
              Atualize os campos que deseja alterar.
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

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="status"
                  className="text-xs font-semibold uppercase tracking-wider text-black"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border-b-2 border-gray-200 bg-transparent py-2 text-sm text-black outline-none transition focus:border-black appearance-none cursor-pointer"
                >
                  <option value="PENDING">Pendente</option>
                  <option value="DONE">Concluída</option>
                </select>
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
                  onClick={() => navigate(`/tasks/${id}`)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={saving}>
                  Atualizar →
                </Button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}