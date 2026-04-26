import type { ReactNode } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import ChartCard from '../../../components/ChartCard'
import DashboardCard from '../../../components/DashboardCard'
import StatusBadge from '../../../components/StatusBadge'
import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type Summary = {
  helper: ReactNode
  id: string
  label: ReactNode
  tone: 'attention' | 'default' | 'improvement'
  value: string
}

type Alert = {
  id: string
  indicator: ReactNode
  name: string
}

const summaries: Summary[] = [
  {
    id: 'active-patients',
    helper: 'Carteira em acompanhamento',
    label: 'Pacientes ativos',
    tone: 'default',
    value: '12',
  },
  {
    id: 'high-risk',
    helper: 'Prioridade para hoje',
    label: 'Pacientes em risco alto',
    tone: 'attention',
    value: '3',
  },
  {
    id: 'stress-average',
    helper: <>N&iacute;vel semanal m&eacute;dio</>,
    label: <>M&eacute;dia de estresse</>,
    tone: 'attention',
    value: '6.2',
  },
  {
    id: 'anxiety-average',
    helper: <>N&iacute;vel semanal m&eacute;dio</>,
    label: <>M&eacute;dia de ansiedade</>,
    tone: 'improvement',
    value: '5.8',
  },
]

const overviewData = [
  {
    week: 'Sem 1',
    estresse: 5.4,
    ansiedade: 4.9,
  },
  {
    week: 'Sem 2',
    estresse: 5.8,
    ansiedade: 5.2,
  },
  {
    week: 'Sem 3',
    estresse: 6.0,
    ansiedade: 5.5,
  },
  {
    week: 'Sem 4',
    estresse: 6.2,
    ansiedade: 5.8,
  },
]

const alerts: Alert[] = [
  {
    id: 'amanda-costa',
    name: 'Amanda Costa',
    indicator: 'Estresse alto',
  },
  {
    id: 'joao-lima',
    name: 'Joao Lima',
    indicator: 'Ansiedade alta',
  },
  {
    id: 'carla-souza',
    name: 'Carla Souza',
    indicator: 'Burnout elevado',
  },
]

export default function PainelGeral() {
  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Painel Geral
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Vis&atilde;o geral dos seus pacientes
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <OverviewChart />
          <AlertsCard />
        </section>
      </div>
    </PsychologistLayout>
  )
}

function SummaryCard({ summary }: { summary: Summary }) {
  const valueClassName = {
    attention: 'text-rose-600',
    default: 'text-gray-950',
    improvement: 'text-emerald-700',
  }[summary.tone]

  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{summary.label}</p>
      <p
        className={`mt-4 text-4xl font-semibold tracking-tight ${valueClassName}`}
      >
        {summary.value}
      </p>
      <p className="mt-2 text-sm leading-6 text-gray-500">{summary.helper}</p>
    </DashboardCard>
  )
}

function OverviewChart() {
  return (
    <ChartCard title={<>Evolu&ccedil;&atilde;o geral dos pacientes</>}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={overviewData}
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
            domain={[0, 10]}
            ticks={[0, 5, 10]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickMargin={10}
            label={{
              value: 'N\u00edvel',
              angle: -90,
              position: 'insideLeft',
              fill: '#64748b',
              fontSize: 12,
            }}
          />
          <Tooltip
            cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
            contentStyle={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 18px 40px rgb(15 23 42 / 0.10)',
            }}
            formatter={(value, name) => [`${value}/10`, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="estresse"
            name={'Estresse m\u00e9dio'}
            stroke="#dc2626"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="ansiedade"
            name={'Ansiedade m\u00e9dia'}
            stroke="#059669"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function AlertsCard() {
  return (
    <DashboardCard className="border-rose-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-950">
          Pacientes que precisam de aten&ccedil;&atilde;o
        </h2>
        <StatusBadge variant="attention">{alerts.length}</StatusBadge>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </DashboardCard>
  )
}

function AlertItem({ alert }: { alert: Alert }) {
  return (
    <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4 transition duration-200 hover:bg-rose-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-950">{alert.name}</p>
          <p className="mt-1 text-sm font-semibold text-rose-700">
            {alert.indicator}
          </p>
        </div>
        <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
      </div>
    </div>
  )
}
