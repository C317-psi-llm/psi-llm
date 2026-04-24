import type { ReactNode } from 'react'

type DashboardCardProps = {
  children: ReactNode
  className?: string
}

export default function DashboardCard({
  children,
  className = '',
}: DashboardCardProps) {
  return (
    <article
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </article>
  )
}
