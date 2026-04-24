import type { ReactNode } from 'react'

type ActivityItemProps = {
  children: ReactNode
  xp: number
}

export default function ActivityItem({ children, xp }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        <p className="text-sm font-medium text-gray-700">{children}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-blue-600">
        +{xp} XP
      </span>
    </div>
  )
}
