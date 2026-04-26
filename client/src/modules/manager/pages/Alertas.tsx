import { useMemo, useState, type ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import StatusBadge from '../../../components/StatusBadge'
import ManagerLayout from './ManagerLayout'

type AlertPriority = 'Alta' | 'Media'
type AlertStatus = 'Ativo' | 'Resolvido'
type AlertFilter = 'Ativos' | 'Resolvidos' | 'Todos'

type ManagerAlert = {
  actions: string[]
  date: string
  department: string
  description: ReactNode
  duration: string
  id: string
  note: ReactNode
  priority: AlertPriority
  rule: ReactNode
  status: AlertStatus
  threshold: string
  title: string
  value: string
}

const summaryCards = [
  {
    id: 'high',
    label: 'Alta prioridade',
    value: '4',
    className: 'text-rose-600',
  },
  {
    id: 'medium',
    label: <>Prioridade m&eacute;dia</>,
    value: '7',
    className: 'text-amber-600',
  },
  {
    id: 'resolved',
    label: 'Resolvidos',
    value: '12',
    className: 'text-emerald-700',
  },
]

const filterTabs: AlertFilter[] = ['Todos', 'Ativos', 'Resolvidos']

const alerts: ManagerAlert[] = [
  {
    id: 'engineering-burnout',
    priority: 'Alta',
    status: 'Ativo',
    date: '26 abr 2026',
    title: 'Risco elevado persistente - Engenharia',
    department: 'Engenharia',
    description:
      'O indicador medio de burnout do departamento de Engenharia esta acima do limiar definido para acompanhamento gerencial.',
    rule: <>Indicador &ge; 2.8 por 3 ou mais semanas consecutivas</>,
    value: '3.1',
    threshold: '2.8',
    duration: '3 semanas',
    actions: [
      'Verifique sobrecarga de trabalho',
      'Converse com lideranca tecnica',
      'Avalie recursos disponiveis',
    ],
    note: 'Acoes sugeridas sao orientativas e devem ser avaliadas conforme contexto organizacional.',
  },
  {
    id: 'commercial-stress',
    priority: 'Media',
    status: 'Ativo',
    date: '24 abr 2026',
    title: 'Aumento de estresse - Comercial',
    department: 'Comercial',
    description:
      'A media de estresse do departamento Comercial subiu nas ultimas semanas e merece acompanhamento preventivo.',
    rule: <>Indicador &ge; 2.5 por 2 semanas consecutivas</>,
    value: '2.7',
    threshold: '2.5',
    duration: '2 semanas',
    actions: [
      'Revise metas do periodo',
      'Mapeie conflitos recorrentes',
      'Acompanhe liderancas diretas',
    ],
    note: 'Acoes sugeridas sao orientativas e nao substituem avaliacao especializada.',
  },
  {
    id: 'support-engagement',
    priority: 'Media',
    status: 'Resolvido',
    date: '18 abr 2026',
    title: 'Queda de engajamento - Suporte',
    department: 'Suporte',
    description:
      'A taxa de check-ins do departamento Suporte caiu temporariamente e retornou ao intervalo esperado.',
    rule: <>Engajamento abaixo de 60% por 7 dias</>,
    value: '74%',
    threshold: '60%',
    duration: '1 semana',
    actions: [
      'Manter monitoramento semanal',
      'Reforcar comunicacao de check-ins',
      'Avaliar barreiras de preenchimento',
    ],
    note: 'Alerta resolvido, manter observacao durante o proximo ciclo.',
  },
]

export default function ManagerAlertas() {
  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>('Todos')
  const [openAlertId, setOpenAlertId] = useState<string | null>(alerts[0].id)

  const filteredAlerts = useMemo(() => {
    if (selectedFilter === 'Todos') {
      return alerts
    }

    return alerts.filter((alert) =>
      selectedFilter === 'Ativos'
        ? alert.status === 'Ativo'
        : alert.status === 'Resolvido',
    )
  }, [selectedFilter])

  function toggleAlert(alertId: string) {
    setOpenAlertId((currentId) => (currentId === alertId ? null : alertId))
  }

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Alertas
          </h1>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {summaryCards.map((summary) => (
            <AlertSummaryCard key={summary.id} summary={summary} />
          ))}
        </section>

        <div className="flex flex-col gap-5">
          <AlertFilterTabs
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          <section className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 text-sm font-medium leading-6 text-violet-900 shadow-sm">
            Alertas s&atilde;o baseados em padr&otilde;es agregados da equipe.
            Nenhum dado individual &eacute; identific&aacute;vel nesta
            visualiza&ccedil;&atilde;o.
          </section>
        </div>

        <section className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isOpen={openAlertId === alert.id}
              onToggle={() => toggleAlert(alert.id)}
            />
          ))}
        </section>
      </div>
    </ManagerLayout>
  )
}

function AlertSummaryCard({
  summary,
}: {
  summary: (typeof summaryCards)[number]
}) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className={`text-4xl font-semibold tracking-tight ${summary.className}`}>
        {summary.value}
      </p>
      <p className="mt-2 text-sm font-medium text-gray-500">{summary.label}</p>
    </DashboardCard>
  )
}

function AlertFilterTabs({
  selectedFilter,
  onFilterChange,
}: {
  selectedFilter: AlertFilter
  onFilterChange: (filter: AlertFilter) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {filterTabs.map((filter) => {
        const isActive = selectedFilter === filter

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-emerald-800 text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-700 hover:text-emerald-800'
            }`}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}

function AlertCard({
  alert,
  isOpen,
  onToggle,
}: {
  alert: ManagerAlert
  isOpen: boolean
  onToggle: () => void
}) {
  const borderClassName =
    alert.priority === 'Alta' ? 'border-l-rose-500' : 'border-l-amber-500'

  return (
    <DashboardCard
      className={`border-l-4 p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${borderClassName}`}
    >
      <button
        type="button"
        className="flex w-full flex-col gap-4 px-5 py-5 text-left md:flex-row md:items-center md:justify-between"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <PriorityBadge priority={alert.priority} />
            <span className="text-sm font-medium text-gray-400">
              {alert.date}
            </span>
            {alert.status === 'Resolvido' && (
              <StatusBadge variant="improvement">Resolvido</StatusBadge>
            )}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-gray-950">
            {alert.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Departamento: {alert.department}
          </p>
        </div>

        <span className="text-sm font-semibold text-emerald-800">
          {isOpen ? 'Recolher' : 'Expandir'}
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          <div
            className={`border-t border-gray-100 px-5 pb-5 pt-5 transition duration-500 ease-out ${
              isOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-2 opacity-0'
            }`}
          >
            <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
              <div className="space-y-6">
                <InfoBlock title="Descri&ccedil;&atilde;o">
                  {alert.description}
                </InfoBlock>
                <InfoBlock title="Regra de disparo">{alert.rule}</InfoBlock>
                <InfoBlock title="Nota">{alert.note}</InfoBlock>
              </div>

              <div className="space-y-6">
                <section className="rounded-xl border border-gray-100 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold text-gray-950">
                    M&eacute;tricas
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <MetricItem
                      label="Valor atual"
                      tone="danger"
                      value={alert.value}
                    />
                    <MetricItem
                      label="Limiar"
                      tone="warning"
                      value={alert.threshold}
                    />
                    <MetricItem
                      label="Dura&ccedil;&atilde;o"
                      tone="neutral"
                      value={alert.duration}
                    />
                  </div>
                </section>

                <section className="rounded-xl border border-gray-100 bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold text-gray-950">
                    Sugest&otilde;es de a&ccedil;&atilde;o
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {alert.actions.map((action) => (
                      <li
                        key={action}
                        className="rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-600 shadow-sm"
                      >
                        {action}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function PriorityBadge({ priority }: { priority: AlertPriority }) {
  return (
    <StatusBadge variant={priority === 'Alta' ? 'attention' : 'stable'}>
      {formatPriority(priority)}
    </StatusBadge>
  )
}

function InfoBlock({
  children,
  title,
}: {
  children: ReactNode
  title: ReactNode
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-gray-600">{children}</p>
    </section>
  )
}

function MetricItem({
  label,
  tone,
  value,
}: {
  label: ReactNode
  tone: 'danger' | 'neutral' | 'warning'
  value: ReactNode
}) {
  const toneClassName = {
    danger: 'border-rose-100 bg-rose-50 text-rose-700',
    neutral: 'border-blue-100 bg-blue-50 text-blue-700',
    warning: 'border-amber-100 bg-amber-50 text-amber-700',
  }[tone]

  return (
    <div
      className={`rounded-xl border px-4 py-4 shadow-sm ${toneClassName}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

function formatPriority(priority: AlertPriority) {
  if (priority === 'Media') {
    return 'M\u00e9dia'
  }

  return priority
}
