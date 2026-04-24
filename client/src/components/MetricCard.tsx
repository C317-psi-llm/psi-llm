import type { ReactNode } from 'react'

type MetricCardProps = {
  accentClassName: string
  label: ReactNode
  max?: number
  value: number
}

export default function MetricCard({
  accentClassName,
  label,
  max = 100,
  value,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-5 flex items-end justify-center gap-1">
        <span className={`text-5xl font-semibold tracking-tight ${accentClassName}`}>
          {value}
        </span>
        <span className="mb-1.5 text-sm font-medium text-gray-400">
          /{max}
        </span>
      </div>
    </article>
  )
}
