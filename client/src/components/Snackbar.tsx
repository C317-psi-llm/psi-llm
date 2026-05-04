import { useEffect } from 'react'

type SnackbarVariant = 'error' | 'info'

type SnackbarProps = {
  open: boolean
  message: string
  variant?: SnackbarVariant
  duration?: number
  onClose: () => void
}

const variantClasses: Record<SnackbarVariant, string> = {
  error: 'bg-rose-600 text-white',
  info: 'bg-gray-900 text-white',
}

export default function Snackbar({
  open,
  message,
  variant = 'info',
  duration = 4000,
  onClose,
}: SnackbarProps) {
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4"
    >
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${variantClasses[variant]}`}
      >
        <span>{message}</span>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="rounded-md text-white/80 transition-colors duration-150 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          x
        </button>
      </div>
    </div>
  )
}
