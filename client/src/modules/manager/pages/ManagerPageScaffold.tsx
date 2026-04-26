import type { ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import StatusBadge from '../../../components/StatusBadge'
import ManagerLayout from './ManagerLayout'

type ManagerPageScaffoldProps = {
  children?: ReactNode
  description: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
}

export default function ManagerPageScaffold({
  children,
  description,
  eyebrow = 'Gestao operacional',
  title,
}: ManagerPageScaffoldProps) {
  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header>
          <StatusBadge variant="new">{eyebrow}</StatusBadge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {description}
          </p>
        </header>

        {children ?? (
          <DashboardCard>
            <p className="text-sm leading-6 text-gray-500">
              Tela inicial preparada para receber dados do m&oacute;dulo de
              gest&atilde;o.
            </p>
          </DashboardCard>
        )}
      </div>
    </ManagerLayout>
  )
}
