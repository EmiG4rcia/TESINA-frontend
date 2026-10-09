import type { ReactNode } from 'react'

interface IconButtonProps {
  icon: ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  tooltip?: string
  disabled?: boolean
  variant?: 'default' | 'danger' | 'success'
}

export function IconButton({
  icon,
  onClick,
  tooltip,
  disabled = false,
  variant = 'default',
}: IconButtonProps) {
  const variants = {
    default: 'text-gray-500 hover:text-blue-600 hover:bg-blue-50',
    danger: 'text-gray-500 hover:text-red-600 hover:bg-red-50',
    success: 'text-gray-500 hover:text-green-600 hover:bg-green-50',
  }

  return (
    <button
        type="button"
        onClick={(e) => onClick?.(e)}
        disabled={disabled}
        title={tooltip}
        className={`
            ${variants[variant]}
            p-2 rounded-lg transition-colors duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            cursor-pointer
          `}
            >
            {icon}
    </button>
  )
}