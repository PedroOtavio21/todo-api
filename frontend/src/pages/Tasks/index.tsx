import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../../api/tasks'
import { Navbar } from '../../components/Navbar'
import { TaskCard } from '../../components/TaskCard'
import { Button } from '../../components/Button'
import type { Task, TaskStatus } from '../../types'

type Filter = 'ALL' | TaskStatus

export function TasksPage() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getTasks(filter === 'ALL' ? undefined : filter)
        setTasks(data)
      } catch {
        setError('Erro ao carregar tarefas.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filter])

  function handleUpdate(updated: Task) {
    setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
  }

  function handleDelete(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filters: { label: string; value: Filter }[] = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Pendentes', value: 'PENDING' },
    { label: 'Concluídas', value: 'DONE' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Tarefas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'} encontrada{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate('/tasks/new')} className="mt-1">
            Nova tarefa →
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-1 border-b border-gray-200">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-150 border-b-2 -mb-px
                ${filter === f.value
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-black'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 animate-pulse rounded-none border border-gray-100 bg-gray-50" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-none border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📋</span>
            <p className="text-lg font-semibold text-black">
              {filter === 'ALL'
                ? 'Nenhuma tarefa ainda.'
                : filter === 'PENDING'
                ? 'Nenhuma tarefa pendente.'
                : 'Nenhuma tarefa concluída.'}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {filter === 'ALL' && 'Crie sua primeira tarefa para começar.'}
            </p>
            {filter === 'ALL' && (
              <Button onClick={() => navigate('/tasks/new')} className="mt-6">
                Criar tarefa →
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}