import type { ReactNode } from 'react'
import DashboardCard from '../components/DashboardCard'
import InsightCard from '../components/InsightCard'
import StatusBadge, { type StatusVariant } from '../components/StatusBadge'
import DashboardLayout from '../layouts/DashboardLayout'
import {
  usePatientInsights,
  type PatientInsight,
  type InsightSeriedade,
} from '../hooks/useApi/useInsights'

const statusLabels: Record<InsightSeriedade, ReactNode> = {
  alerta: 'Atenção',
  bom: 'Melhora',
  padrao: 'Estável',
}

const statusVariants: Record<InsightSeriedade, StatusVariant> = {
  alerta: 'attention',
  bom: 'improvement',
  padrao: 'stable',
}

const originLabels: Record<PatientInsight['origem'], string> = {
  ia: 'IA',
  manual: 'Manual',
}

export default function Insights() {
  const { data: insights, loading, error, refetch } = usePatientInsights()
  const latestInsight = insights[0]
  const previousInsights = latestInsight ? insights.slice(1) : []

  return (
    <DashboardLayout title="Insights">
      <div className="space-y-8">
        <InsightsHeader />

        {loading && <LoadingState />}

        {!loading && error && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && insights.length === 0 && <EmptyState />}

        {!loading && !error && latestInsight && (
          <>
            <FeaturedInsight insight={latestInsight} />
            <InsightHistorySection insights={previousInsights} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

function InsightsHeader() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Acompanhamento
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
          Seus Insights
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Recomendações e observações baseadas nos registros acompanhados pela
          plataforma.
        </p>
      </div>
    </header>
  )
}

function LoadingState() {
  return (
    <DashboardCard>
      <p className="text-sm text-gray-500">Carregando insights...</p>
    </DashboardCard>
  )
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <DashboardCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            Não foi possível carregar os insights
          </h2>
          <p className="mt-2 text-sm text-rose-700">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          Tentar novamente
        </button>
      </div>
    </DashboardCard>
  )
}

function EmptyState() {
  return (
    <DashboardCard>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-950">
          Nenhum insight disponível
        </h2>
        <p className="text-sm leading-6 text-gray-500">
          Quando novos insights forem registrados pelo acompanhamento, eles
          aparecerão aqui.
        </p>
      </div>
    </DashboardCard>
  )
}

function FeaturedInsight({ insight }: { insight: PatientInsight }) {
  return (
    <DashboardCard className="overflow-hidden p-0">
      <div className="bg-linear-to-br from-[#2F8F7B] to-[#54b69f] p-7 text-white sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <StatusBadge variant="new">Mais recente</StatusBadge>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              {getInsightTitle(insight)}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85">
              {insight.conteudo}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MetadataPill>{statusLabels[insight.seriedade]}</MetadataPill>
            <MetadataPill>{originLabels[insight.origem]}</MetadataPill>
            <MetadataPill>{formatInsightDate(insight.criado_em)}</MetadataPill>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function InsightHistorySection({ insights }: { insights: PatientInsight[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-950">
          Histórico de Insights
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Registros anteriores vinculados ao seu acompanhamento.
        </p>
      </div>

      {insights.length === 0 ? (
        <DashboardCard>
          <p className="text-sm text-gray-500">
            Ainda não existem insights anteriores.
          </p>
        </DashboardCard>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id_insight}
              date={formatInsightDate(insight.criado_em)}
              description={insight.conteudo}
              status={statusVariants[insight.seriedade]}
              statusLabel={statusLabels[insight.seriedade]}
              title={getInsightTitle(insight)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function MetadataPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25">
      {children}
    </span>
  )
}

function getInsightTitle(insight: PatientInsight) {
  if (insight.seriedade === 'alerta') {
    return insight.origem === 'ia'
      ? 'Ponto de atenção identificado pela IA'
      : 'Ponto de atenção registrado'
  }

  if (insight.seriedade === 'bom') {
    return insight.origem === 'ia'
      ? 'Evolução positiva identificada pela IA'
      : 'Evolução positiva registrada'
  }

  return insight.origem === 'ia' ? 'Insight gerado pela IA' : 'Insight manual'
}

function formatInsightDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}