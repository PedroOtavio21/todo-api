import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Task } from '../types'
import { StatusBadge } from './StatusBadge'
import { ConfirmDialog } from './ConfirmDialog'
import { updateTask, deleteTask } from '../api/tasks'

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: number) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loadingToggle, setLoadingToggle] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  async function handleToggle() {
    setLoadingToggle(true)
    try {
      const updated = await updateTask(task.id, {
        status: task.status === 'PENDING' ? 'DONE' : 'PENDING',
      })
      onUpdate(updated)
    } finally {
      setLoadingToggle(false)
    }
  }

  async function handleDelete() {
    setLoadingDelete(true)
    try {
      await deleteTask(task.id)
      onDelete(task.id)
    } finally {
      setLoadingDelete(false)
      setConfirmOpen(false)
    }
  }

  const isDone = task.status === 'DONE'

  return (
    <>
      <div className="group flex items-center justify-between border border-gray-200 bg-white px-5 py-4 transition-all duration-150 hover:border-black">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isDone}
            onChange={handleToggle}
            disabled={loadingToggle}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-accent shrink-0"
            title={isDone ? 'Marcar como pendente' : 'Marcar como concluída'}
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-snug ${isDone ? 'text-gray-400 line-through' : 'text-accent'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="mt-0.5 text-xs text-gray-500 truncate">{task.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={task.status} />
              <span className="text-xs text-gray-400">
                Criado em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="p-2 text-gray-400 hover:text-black transition-colors"
            title="Ver detalhes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
            className="p-2 text-gray-400 hover:text-black transition-colors"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Excluir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          title="Excluir tarefa"
          description={`Tem certeza que deseja excluir "${task.title}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
          loading={loadingDelete}
        />
      )}
    </>
  )
}