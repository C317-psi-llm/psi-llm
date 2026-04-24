import type { ReactNode } from 'react'

type ProgressBarProps = {
  colorClassName?: string
  label: ReactNode
  level: ReactNode
  value: number
}

export default function ProgressBar({
  colorClassName = 'bg-blue-600',
  label,
  level,
  value,
}: ProgressBarProps) {
  const progress = Math.min(Math.max(value, 0), 100)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm font-semibold text-gray-950">{level}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${colorClassName}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
