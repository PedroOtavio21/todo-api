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

  return (
    <>
      <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.status === 'DONE'}
            onChange={handleToggle}
            disabled={loadingToggle}
            className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
          />
          <div>
            <p className={`text-sm font-medium ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="mt-0.5 text-xs text-gray-500">{task.description}</p>
            )}
            <div className="mt-2">
              <StatusBadge status={task.status} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Ver detalhes"
          >
            👁
          </button>
          <button
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
            title="Excluir"
          >
            🗑️
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