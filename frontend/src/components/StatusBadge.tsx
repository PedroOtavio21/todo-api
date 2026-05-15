import type { TaskStatus } from '../types'

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isDone = status === 'DONE'

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider
      ${isDone ? 'text-green-600' : 'text-accent'}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-green-500' : 'bg-accent'}`} />
      {isDone ? 'Concluída' : 'Pendente'}
    </span>
  )
}