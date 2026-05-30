import { useEffect, useMemo, useState, type ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import Snackbar from '../../../components/Snackbar'
import StatusBadge from '../../../components/StatusBadge'
import {
  useManagerAlerts,
  type ManagerAlert,
} from '../../../hooks/useApi/useManager'
import ManagerLayout from './ManagerLayout'

type AlertFilter = 'Todos' | 'Ativos' | 'Resolvidos'

const filterTabs: AlertFilter[] = ['Todos', 'Ativos', 'Resolvidos']

const actionSuggestions = [
  'Acionar acompanhamento clinico responsavel',
  'Verificar recorrencia do sinal nas proximas semanas',
  'Registrar encaminhamento administrativo',
]

export default function ManagerAlertas() {
  const [page, setPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>('Todos')
  const [openAlertId, setOpenAlertId] = useState<number | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const { data, loading, error } = useManagerAlerts(page, 10)

  const filteredAlerts = useMemo(() => {
    if (!data?.items) return []
    if (selectedFilter === 'Resolvidos') return []
    return data.items
  }, [data?.items, selectedFilter])

  useEffect(() => {
    if (data?.items.length && openAlertId === null) {
      setOpenAlertId(data.items[0].id_insight)
    }
  }, [data?.items, openAlertId])

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error || 'Erro ao carregar alertas.',
      })
    }
  }, [error])

  function toggleAlert(alertId: number) {
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
          <AlertSummaryCard
            label="Alertas ativos"
            value={data?.total ?? 0}
            className="text-rose-600"
          />
          <AlertSummaryCard
            label="Origem IA"
            value={countByOrigin(data?.items ?? [], 'ia')}
            className="text-blue-700"
          />
          <AlertSummaryCard
            label="Origem manual"
            value={countByOrigin(data?.items ?? [], 'manual')}
            className="text-emerald-700"
          />
        </section>

        <div className="flex flex-col gap-5">
          <AlertFilterTabs
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          <section className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 text-sm font-medium leading-6 text-violet-900 shadow-sm">
            Alertas s&atilde;o baseados em sinais registrados por psic&oacute;logos
            ou pela IA. Nenhum dado sens&iacute;vel &eacute; exibido nesta
            visualiza&ccedil;&atilde;o gerencial.
          </section>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && <p className="text-sm text-gray-500">Carregando alertas...</p>}

        {!loading && filteredAlerts.length === 0 && (
          <DashboardCard>
            <p className="text-center text-sm text-gray-500">
              Nenhum alerta encontrado.
            </p>
          </DashboardCard>
        )}

        {!loading && filteredAlerts.length > 0 && (
          <section className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id_insight}
                alert={alert}
                isOpen={openAlertId === alert.id_insight}
                onToggle={() => toggleAlert(alert.id_insight)}
              />
            ))}
          </section>
        )}

        {data && data.total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              P&aacute;gina {page} de {Math.max(1, Math.ceil(data.total / data.limit))}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage(page + 1)}
                disabled={!data.items || data.items.length < data.limit}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Pr&oacute;xima
              </button>
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant="error"
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </ManagerLayout>
  )
}

function AlertSummaryCard({
  className,
  label,
  value,
}: {
  className: string
  label: ReactNode
  value: number
}) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className={`text-4xl font-semibold tracking-tight ${className}`}>
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-gray-500">{label}</p>
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
  return (
    <DashboardCard className="border-l-4 border-l-rose-500 p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        className="flex w-full flex-col gap-4 px-5 py-5 text-left md:flex-row md:items-center md:justify-between"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge variant="attention">Alta</StatusBadge>
            <span className="text-sm font-medium text-gray-400">
              {formatDate(alert.criado_em)}
            </span>
            <StatusBadge variant="stable">{formatOrigin(alert.origem)}</StatusBadge>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-gray-950">
            {alert.usuario_nome || 'Paciente sem identificacao'}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Respons&aacute;vel: {alert.psicologo_nome || 'Nao atribuido'}
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
                  {alert.conteudo}
                </InfoBlock>
                <InfoBlock title="Regra de disparo">
                  Insight classificado com seriedade de alerta.
                </InfoBlock>
              </div>

              <section className="rounded-xl border border-gray-100 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold text-gray-950">
                  Sugest&otilde;es de a&ccedil;&atilde;o
                </h3>
                <ul className="mt-4 space-y-2">
                  {actionSuggestions.map((action) => (
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
    </DashboardCard>
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

function countByOrigin(alerts: ManagerAlert[], origin: string) {
  return alerts.filter((alert) => alert.origem === origin).length
}

function formatOrigin(origin: string) {
  return origin === 'ia' ? 'IA' : 'Manual'
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}
