import type { ReactNode } from 'react'

import Chip from '../components/Chip'
import DashboardCard from '../components/DashboardCard'
import InsightCard from '../components/InsightCard'
import StatusBadge, { type StatusVariant } from '../components/StatusBadge'
import DashboardLayout from '../layouts/DashboardLayout'

type InsightItem = {
  date: string
  description: ReactNode
  id: string
  status: Exclude<StatusVariant, 'new'>
  title: ReactNode
}

const statusLabels: Record<InsightItem['status'], ReactNode> = {
  attention: <>Aten&ccedil;&atilde;o</>,
  improvement: 'Melhora',
  stable: <>Est&aacute;vel</>,
}

const insightHistory: InsightItem[] = [
  {
    id: 'general-wellbeing',
    title: 'Melhora no bem-estar geral',
    description:
      'Seus registros mostram maior consistencia nos check-ins e mais estabilidade emocional.',
    status: 'improvement',
    date: 'H\u00e1 2 dias',
  },
  {
    id: 'routine-stability',
    title: <>Rotina emocional est&aacute;vel</>,
    description:
      'Os indicadores permaneceram proximos da media, sem variacoes bruscas nesta semana.',
    status: 'stable',
    date: 'H\u00e1 5 dias',
  },
  {
    id: 'stress-attention',
    title: 'Aumento de estresse no periodo da tarde',
    description:
      'Foi identificado um padrao de maior tensao apos longos intervalos sem pausa.',
    status: 'attention',
    date: 'H\u00e1 1 semana',
  },
]

const suggestionChips = [
  {
    id: 'breathing',
    label: <>Respira&ccedil;&atilde;o</>,
  },
  {
    id: 'active-breaks',
    label: 'Pausas ativas',
  },
]

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <InsightsHeader />
        <FeaturedInsight />
        <InsightHistorySection insights={insightHistory} />
      </div>
    </DashboardLayout>
  )
}

function InsightsHeader() {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
        Seus Insights
      </h1>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Recomenda&ccedil;&otilde;es baseadas no seu comportamento recente
      </p>
    </header>
  )
}

function FeaturedInsight() {
  return (
    <DashboardCard className="p-7 shadow-md">
      <StatusBadge variant="new">Novo</StatusBadge>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700">
        Percebemos um aumento no seu n&iacute;vel de estresse nas &uacute;ltimas
        semanas. Pequenas pausas planejadas e exerc&iacute;cios de
        respira&ccedil;&atilde;o podem ajudar a reduzir a tens&atilde;o ao longo
        do dia.
      </p>

      <SuggestionChips />
    </DashboardCard>
  )
}

function SuggestionChips() {
  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-gray-950">
        Sugest&otilde;es para hoje
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestionChips.map((chip) => (
          <Chip key={chip.id}>{chip.label}</Chip>
        ))}
      </div>
    </div>
  )
}

type InsightHistorySectionProps = {
  insights: InsightItem[]
}

function InsightHistorySection({ insights }: InsightHistorySectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-950">
          Hist&oacute;rico de Insights
        </h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            date={insight.date}
            description={insight.description}
            status={insight.status}
            statusLabel={statusLabels[insight.status]}
            title={insight.title}
          />
        ))}
      </div>
    </section>
  )
}
