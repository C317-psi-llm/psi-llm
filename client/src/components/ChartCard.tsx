import type { ReactNode } from 'react'

import DashboardCard from './DashboardCard'

type ChartCardProps = {
  children: ReactNode
  title: ReactNode
}

export default function ChartCard({ children, title }: ChartCardProps) {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
      <div className="mt-8 h-[380px] w-full">{children}</div>
    </DashboardCard>
  )
}
