import type { ReactNode } from 'react'
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

type SummaryMetric = {
  id: string
  label: ReactNode
  tone: string
  value: string
}

type RiskDistribution = {
  colorClassName: string
  id: string
  label: ReactNode
  patients: number
  value: number
}

type RecentAlert = {
  id: string
  text: ReactNode
  variant: 'attention' | 'new' | 'stable'
}

const summaryMetrics: SummaryMetric[] = [
  {
    id: 'registered-patients',
    label: 'Pacientes cadastrados',
    value: '128',
    tone: 'text-emerald-700',
  },
  {
    id: 'active-psychologists',
    label: <>Psic&oacute;logos ativos</>,
    value: '8',
    tone: 'text-blue-700',
  },
  {
    id: 'high-risk-patients',
    label: 'Pacientes em risco alto',
    value: '14',
    tone: 'text-rose-600',
  },
  {
    id: 'completed-checkins',
    label: 'Check-ins realizados',
    value: '342',
    tone: 'text-gray-950',
  },
]

const checkinsData = [
  {
    week: 'Sem 1',
    checkins: 68,
  },
  {
    week: 'Sem 2',
    checkins: 82,
  },
  {
    week: 'Sem 3',
    checkins: 91,
  },
  {
    week: 'Sem 4',
    checkins: 101,
  },
]

const riskDistribution: RiskDistribution[] = [
  {
    id: 'low',
    label: 'Baixo',
    patients: 64,
    value: 50,
    colorClassName: 'bg-emerald-500',
  },
  {
    id: 'medium',
    label: <>M&eacute;dio</>,
    patients: 50,
    value: 39,
    colorClassName: 'bg-amber-500',
  },
  {
    id: 'high',
    label: 'Alto',
    patients: 14,
    value: 11,
    colorClassName: 'bg-rose-500',
  },
]

const recentAlerts: RecentAlert[] = [
  {
    id: 'high-risk',
    text: '14 pacientes em risco alto',
    variant: 'attention',
  },
  {
    id: 'full-schedule',
    text: <>3 psic&oacute;logos com agenda cheia</>,
    variant: 'stable',
  },
  {
    id: 'checkins-drop',
    text: <>Queda de check-ins nos &uacute;ltimos 7 dias</>,
    variant: 'new',
  },
]

export default function ManagerPainelGeral() {
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

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <ManagerSummaryCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <CheckinsChart />
          <RiskDistributionCard />
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

function CheckinsChart() {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">
        Evolu&ccedil;&atilde;o de check-ins
      </h2>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={checkinsData}
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

function RiskDistributionCard() {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">
        Distribui&ccedil;&atilde;o de risco
      </h2>

      <div className="mt-6 space-y-5">
        {riskDistribution.map((risk) => (
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
                className={`h-full rounded-full ${risk.colorClassName}`}
                style={{ width: `${risk.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
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
