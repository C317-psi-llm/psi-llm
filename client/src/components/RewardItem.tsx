import type { ReactNode } from 'react'

type RewardItemProps = {
  children: ReactNode
  xp: number
}

export default function RewardItem({ children, xp }: RewardItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-sm">
      <p className="text-sm font-medium text-gray-700">{children}</p>
      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        +{xp} XP
      </span>
    </div>
  )
}
