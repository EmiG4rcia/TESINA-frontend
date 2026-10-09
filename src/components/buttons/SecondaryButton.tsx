interface SecondaryButtonProps {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SecondaryButton({
  label,
  onClick,
  type = 'button',
  disabled = false,
  size = 'md',
}: SecondaryButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        bg-white hover:bg-gray-50 disabled:bg-gray-100
        text-gray-700 font-medium rounded-lg
        border border-gray-300
        transition-colors duration-200
        flex items-center justify-center
        cursor-pointer disabled:cursor-not-allowed
      `}
    >
      {label}
    </button>
  )
}