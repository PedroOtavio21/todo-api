import type { TaskStatus } from '../types'

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isDone = status === 'DONE'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
      ${isDone
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-green-500' : 'bg-yellow-500'}`} />
      {isDone ? 'Concluída' : 'Pendente'}
    </span>
  )
}