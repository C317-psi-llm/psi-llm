import type { ReactNode } from 'react'

import DashboardCard from './DashboardCard'
import StatusBadge, { type StatusVariant } from './StatusBadge'

type InsightCardProps = {
  date: string
  description: ReactNode
  status: StatusVariant
  statusLabel: ReactNode
  title: ReactNode
}

export default function InsightCard({
  date,
  description,
  status,
  statusLabel,
  title,
}: InsightCardProps) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>

        <StatusBadge variant={status}>{statusLabel}</StatusBadge>
      </div>

      <p className="mt-4 text-xs font-medium text-gray-400">{date}</p>
    </DashboardCard>
  )
}
