import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getTaskById, deleteTask } from '../../api/tasks'
import type { Task } from '../../types'
import { Navbar } from '../../components/Navbar'
import { Button } from '../../components/Button'
import { StatusBadge } from '../../components/StatusBadge'
import { ConfirmDialog } from '../../components/ConfirmDialog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    async function fetchTask() {
      setLoading(true)
      try {
        const data = await getTaskById(Number(id))
        setTask(data)
      } catch {
        setError('Tarefa não encontrada.')
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [id])

  async function handleDelete() {
    if (!task) return
    setDeleting(true)
    try {
      await deleteTask(task.id)
      navigate('/tasks')
    } catch {
      setError('Erro ao excluir tarefa. Tente novamente.')
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
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

        {loading && (
          <div className="mt-16 flex justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2">
            {error}
          </p>
        )}

        {!loading && task && (
          <>
            <div className="mt-4 flex flex-col gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-black wrap-break-words">
                {task.title}
              </h1>
              <StatusBadge status={task.status} />
            </div>

            <div className="mt-8 border border-gray-100 divide-y divide-gray-100">
              {task.description && (
                <div className="px-4 py-3">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Descrição
                  </span>
                  <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Criado em
                </span>
                <span className="text-sm text-black">{formatDate(task.createdAt)}</span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Última atualização
                </span>
                <span className="text-sm text-black">{formatDate(task.updatedAt)}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-100">
              <Button variant="ghost" onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Excluir
              </Button>
            </div>
          </>
        )}
      </main>

      {confirmOpen && (
        <ConfirmDialog
          title="Excluir tarefa"
          description="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  )
}