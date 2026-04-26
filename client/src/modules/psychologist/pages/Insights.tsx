import { useMemo, useState, type ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import StatusBadge, { type StatusVariant } from '../../../components/StatusBadge'
import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type InsightType = 'Alerta' | 'Estavel' | 'Melhora'

type InsightSummary = {
  id: string
  label: ReactNode
  tone: 'attention' | 'improvement' | 'stable'
  value: string
}

type Insight = {
  date: string
  description: ReactNode
  id: string
  patient: string
  title: string
  type: InsightType
}

type FeaturedInsightData = {
  description: ReactNode
  recommendation: ReactNode
  title: string
}

type InsightFiltersProps = {
  onTypeChange: (value: string) => void
  selectedType: string
}

const insightsMock: {
  featured: FeaturedInsightData
  items: Insight[]
  summaries: InsightSummary[]
} = {
  summaries: [
    {
      id: 'attention-patients',
      label: <>pacientes em aten&ccedil;&atilde;o</>,
      tone: 'attention',
      value: '3',
    },
    {
      id: 'identified-improvements',
      label: 'melhorias identificadas',
      tone: 'improvement',
      value: '5',
    },
    {
      id: 'recent-alerts',
      label: 'alertas recentes',
      tone: 'stable',
      value: '2',
    },
  ],
  featured: {
    title: 'Aumento de estresse em pacientes ativos',
    description: (
      <>
        Foi identificado aumento nos n&iacute;veis m&eacute;dios de estresse em
        parte dos pacientes acompanhados nos &uacute;ltimos dias.
      </>
    ),
    recommendation:
      'Recomenda-se revisar os check-ins recentes e priorizar pacientes com risco alto.',
  },
  items: [
    {
      id: 'anxiety-amanda',
      title: 'Ansiedade elevada',
      patient: 'Amanda Costa',
      type: 'Alerta',
      description:
        'Paciente apresentou aumento nos indicadores de ansiedade.',
      date: 'Hoje',
    },
    {
      id: 'sleep-marina',
      title: 'Melhora no sono',
      patient: 'Marina Alves',
      type: 'Melhora',
      description: 'Paciente relatou melhora na qualidade do sono.',
      date: 'Ontem',
    },
    {
      id: 'stability-joao',
      title: 'Estabilidade emocional',
      patient: 'Joao Lima',
      type: 'Estavel',
      description:
        'Indicadores permaneceram estaveis nos ultimos check-ins.',
      date: 'H\u00e1 2 dias',
    },
    {
      id: 'burnout-carla',
      title: 'Sinais de burnout',
      patient: 'Carla Souza',
      type: 'Alerta',
      description:
        'Aumento gradual de exaustao relatada nos registros recentes.',
      date: 'H\u00e1 3 dias',
    },
  ],
}

const filterOptions = ['Todos', 'Alerta', 'Melhora', 'Est\u00e1vel']

const typeVariants: Record<InsightType, StatusVariant> = {
  Alerta: 'attention',
  Estavel: 'new',
  Melhora: 'improvement',
}

const summaryValueClassNames: Record<InsightSummary['tone'], string> = {
  attention: 'text-rose-600',
  improvement: 'text-emerald-700',
  stable: 'text-blue-700',
}

export default function Insights() {
  const [selectedType, setSelectedType] = useState(filterOptions[0])

  const filteredInsights = useMemo(() => {
    if (selectedType === filterOptions[0]) {
      return insightsMock.items
    }

    return insightsMock.items.filter(
      (insight) =>
        normalizeText(formatInsightType(insight.type)) ===
        normalizeText(selectedType),
    )
  }, [selectedType])

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Insights
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              An&aacute;lises e recomenda&ccedil;&otilde;es sobre seus pacientes
            </p>
          </div>

          <InsightFilters
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {insightsMock.summaries.map((summary) => (
            <InsightSummaryCard key={summary.id} summary={summary} />
          ))}
        </section>

        <FeaturedInsight insight={insightsMock.featured} />

        <section className="grid gap-5 lg:grid-cols-2">
          {filteredInsights.map((insight) => (
            <InsightItem key={insight.id} insight={insight} />
          ))}
        </section>
      </div>
    </PsychologistLayout>
  )
}

function InsightFilters({ selectedType, onTypeChange }: InsightFiltersProps) {
  return (
    <DashboardCard className="w-full p-3 sm:w-56">
      <label>
        <span className="sr-only">Filtrar por tipo</span>
        <select
          value={selectedType}
          onChange={(event) => onTypeChange(event.target.value)}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        >
          {filterOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </DashboardCard>
  )
}

function InsightSummaryCard({ summary }: { summary: InsightSummary }) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p
        className={`text-4xl font-semibold tracking-tight ${
          summaryValueClassNames[summary.tone]
        }`}
      >
        {summary.value}
      </p>
      <p className="mt-2 text-sm font-medium text-gray-500">{summary.label}</p>
    </DashboardCard>
  )
}

function FeaturedInsight({ insight }: { insight: FeaturedInsightData }) {
  return (
    <DashboardCard className="border-amber-100 p-6 shadow-md">
      <StatusBadge variant="stable">Priorit&aacute;rio</StatusBadge>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-gray-950">
        {insight.title}
      </h2>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-gray-600">
        {insight.description}
      </p>
      <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-800 ring-1 ring-inset ring-amber-100">
        {insight.recommendation}
      </div>
    </DashboardCard>
  )
}

function InsightItem({ insight }: { insight: Insight }) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            {insight.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {insight.patient}
          </p>
        </div>
        <InsightTypeBadge type={insight.type} />
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {insight.description}
      </p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {insight.date}
      </p>
    </DashboardCard>
  )
}

function InsightTypeBadge({ type }: { type: InsightType }) {
  return (
    <StatusBadge variant={typeVariants[type]}>
      {formatInsightType(type)}
    </StatusBadge>
  )
}

function formatInsightType(type: InsightType) {
  if (type === 'Estavel') {
    return 'Est\u00e1vel'
  }

  return type
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
