import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-black">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-none border-b-2 bg-transparent px-0 py-2 text-sm text-black outline-none transition placeholder:text-gray-300
          ${error
            ? 'border-red-500'
            : 'border-gray-200 focus:border-black'
          }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}