import type { TaskStatus } from '../types'

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isDone = status === 'DONE'

  return (
    <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider
      ${isDone
        ? 'border-black text-black bg-white'
        : 'border-accent text-accent bg-white'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-black' : 'bg-accent'}`} />
      {isDone ? 'Concluída' : 'Pendente'}
    </span>
  )
}