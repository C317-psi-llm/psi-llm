import type { ReactNode } from 'react'

type ChipProps = {
  children: ReactNode
  onClick?: () => void
}

export default function Chip({ children, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className="rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
