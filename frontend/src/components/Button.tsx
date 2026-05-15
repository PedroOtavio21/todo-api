import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
  loading?: boolean
}

const variants = {
  primary: 'bg-black text-white hover:bg-[#E8500A] disabled:bg-gray-300',
  danger:  'bg-black text-white border-2 border-black hover:bg-red-600 disabled:opacity-40',
  ghost:   'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white disabled:opacity-40',
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}