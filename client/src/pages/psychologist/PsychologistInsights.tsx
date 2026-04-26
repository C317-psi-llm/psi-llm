import type { ReactNode } from 'react'

import DashboardCard from '../../components/DashboardCard'
import ProgressBar from '../../components/ProgressBar'
import StatusBadge from '../../components/StatusBadge'
import PsychologistLayout from './PsychologistLayout'

type ClinicalInsight = {
  action: ReactNode
  description: ReactNode
  id: string
  title: ReactNode
}

const focusIndicators = [
  {
    id: 'stress',
    label: 'Estresse medio da carteira',
    value: 64,
    colorClassName: 'bg-amber-500',
  },
  {
    id: 'adherence',
    label: 'Adesao aos check-ins',
    value: 86,
    colorClassName: 'bg-emerald-500',
  },
  {
    id: 'risk',
    label: 'Pacientes em risco alto',
    value: 12,
    colorClassName: 'bg-rose-500',
  },
]

const insights: ClinicalInsight[] = [
  {
    id: 'late-day-stress',
    title: 'Pico de estresse no fim da tarde',
    description:
      'Pacientes com rotina corporativa registraram maior tensao entre 16h e 19h.',
    action: <>Sugerir pausas estruturadas antes do encerramento do expediente.</>,
  },
  {
    id: 'sleep-pattern',
    title: 'Sono associado a maior estabilidade',
    description:
      'Pacientes com check-ins de sono regular mantiveram menor variacao emocional.',
    action: <>Priorizar higiene do sono nos planos de cuidado.</>,
  },
  {
    id: 'low-adherence',
    title: 'Queda de adesao apos duas semanas',
    description:
      'Novos pacientes tendem a reduzir check-ins apos o periodo inicial.',
    action: <>Agendar reforco de combinados na segunda sessao.</>,
  },
]

export default function PsychologistInsights() {
  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Insights
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sinais agregados para apoiar decis&otilde;es cl&iacute;nicas.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          {focusIndicators.map((indicator) => (
            <DashboardCard key={indicator.id}>
              <ProgressBar
                colorClassName={indicator.colorClassName}
                label={indicator.label}
                level={`${indicator.value}%`}
                value={indicator.value}
              />
            </DashboardCard>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {insights.map((insight, index) => (
            <DashboardCard key={insight.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-950">
                  {insight.title}
                </h2>
                <StatusBadge variant={index === 0 ? 'attention' : 'new'}>
                  IA
                </StatusBadge>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                {insight.description}
              </p>
              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm font-medium leading-6 text-blue-800">
                {insight.action}
              </div>
            </DashboardCard>
          ))}
        </section>
      </div>
    </PsychologistLayout>
  )
}
