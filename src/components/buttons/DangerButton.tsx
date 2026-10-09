interface DangerButtonProps {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  isLoading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function DangerButton({
  label,
  onClick,
  type = 'button',
  isLoading = false,
  disabled = false,
  size = 'md',
}: DangerButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${sizes[size]}
        bg-red-600 hover:bg-red-700 disabled:bg-red-300
        text-white font-medium rounded-lg
        transition-colors duration-200
        flex items-center justify-center gap-2
        cursor-pointer disabled:cursor-not-allowed
      `}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : null}
      {label}
    </button>
  )
}