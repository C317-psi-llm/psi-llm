import type { ReactNode } from 'react'

export type StatusVariant = 'attention' | 'improvement' | 'new' | 'stable'

type StatusBadgeProps = {
  children: ReactNode
  variant: StatusVariant
}

const statusStyles: Record<StatusVariant, string> = {
  attention: 'bg-rose-50 text-rose-700 ring-rose-100',
  improvement: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  new: 'bg-blue-50 text-blue-700 ring-blue-100',
  stable: 'bg-amber-50 text-amber-700 ring-amber-100',
}

export default function StatusBadge({ children, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[variant]}`}
    >
      {children}
    </span>
  )
}
