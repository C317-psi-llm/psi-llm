import { type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import DashboardCard from '../../../components/DashboardCard'
import StatusBadge from '../../../components/StatusBadge'
import ManagerLayout from './ManagerLayout'
import {
  useManagerDashboard,
  type RiskDistributionData,
} from '../../../hooks/useApi/useManager'

type SummaryMetric = {
  id: string
  label: ReactNode
  tone: string
  value: string
}

type RecentAlert = {
  id: string
  text: ReactNode
  variant: 'attention' | 'new' | 'stable'
}

export default function ManagerPainelGeral() {
  const { data, loading, error } = useManagerDashboard()
  const recentAlerts: RecentAlert[] = data
    ? [
        {
          id: 'high-risk',
          text: `${data.stats.highRiskPatients ?? 0} pacientes em risco alto`,
          variant: 'attention',
        },
        {
          id: 'active-psychologists',
          text: (
            <>
              {data.stats.activePsychologists} psic&oacute;logos ativos
            </>
          ),
          variant: 'stable',
        },
        {
          id: 'completed-checkins',
          text: `${data.stats.completedCheckins} check-ins realizados`,
          variant: 'new',
        },
      ]
    : []

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Painel Geral
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Vis&atilde;o administrativa da plataforma
          </p>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Erro ao carregar dados: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Carregando dados...
          </div>
        ) : data ? (
          <>
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <ManagerSummaryCard
                metric={{
                  id: 'registered-patients',
                  label: 'Pacientes cadastrados',
                  value: String(data.stats.registeredPatients),
                  tone: 'text-emerald-700',
                }}
              />
              <ManagerSummaryCard
                metric={{
                  id: 'active-psychologists',
                  label: <>Psic&oacute;logos ativos</>,
                  value: String(data.stats.activePsychologists),
                  tone: 'text-blue-700',
                }}
              />
              <ManagerSummaryCard
                metric={{
                  id: 'high-risk-patients',
                  label: 'Pacientes em risco alto',
                  value: String(data.stats.highRiskPatients ?? 0),
                  tone: 'text-rose-600',
                }}
              />
              <ManagerSummaryCard
                metric={{
                  id: 'completed-checkins',
                  label: 'Check-ins realizados',
                  value: String(data.stats.completedCheckins),
                  tone: 'text-gray-950',
                }}
              />
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
              <CheckinsChart data={data.checkins} />
              <RiskDistributionCard data={data.riskDistribution} />
            </section>

            <DashboardCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    Alertas recentes
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Sinais administrativos que exigem acompanhamento.
                  </p>
                </div>
                <StatusBadge variant="attention">{recentAlerts.length}</StatusBadge>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {recentAlerts.map((alert) => (
                  <RecentAlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </DashboardCard>
          </>
        ) : null}
      </div>
    </ManagerLayout>
  )
}

function ManagerSummaryCard({ metric }: { metric: SummaryMetric }) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{metric.label}</p>
      <p
        className={`mt-4 text-4xl font-semibold tracking-tight ${metric.tone}`}
      >
        {metric.value}
      </p>
    </DashboardCard>
  )
}

function CheckinsChart({ data }: { data: any[] }) {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">
        Evolu&ccedil;&atilde;o de check-ins
      </h2>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 18, bottom: 8, left: -10 }}
          >
            <CartesianGrid
              stroke="#eef2f7"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 18px 40px rgb(15 23 42 / 0.10)',
              }}
              formatter={(value) => [`${value}`, 'Check-ins']}
            />
            <Bar
              dataKey="checkins"
              fill="#047857"
              radius={[8, 8, 0, 0]}
              barSize={42}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}

function RiskDistributionCard({ data }: { data: RiskDistributionData[] }) {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">
        Distribui&ccedil;&atilde;o de risco
      </h2>

      <div className="mt-6 space-y-5">
        {data.map((risk) => (
          <div key={risk.id}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-gray-700">
                {risk.label}
              </p>
              <p className="text-sm font-semibold text-gray-950">
                {risk.patients} pacientes
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${getRiskColor(risk.id)}`}
                style={{ width: `${risk.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

function getRiskColor(riskId: string) {
  if (riskId === 'high') return 'bg-rose-500'
  if (riskId === 'medium') return 'bg-amber-500'
  return 'bg-emerald-500'
}

function RecentAlertItem({ alert }: { alert: RecentAlert }) {
  return (
    <article className="rounded-xl border border-gray-100 bg-slate-50 p-4 transition duration-200 hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold leading-6 text-gray-800">
          {alert.text}
        </p>
        <StatusBadge variant={alert.variant}>Alerta</StatusBadge>
      </div>
    </article>
  )
}
