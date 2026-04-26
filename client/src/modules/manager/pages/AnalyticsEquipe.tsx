import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import DashboardCard from '../../../components/DashboardCard'
import ManagerLayout from './ManagerLayout'

type DepartmentScore = {
  department: string
  score: number
}

const periodOptions = [
  '\u00daltimas 4 semanas',
  '\u00daltimos 3 meses',
  '\u00daltimo semestre',
]

const indicatorData = [
  {
    week: 'S1',
    estresse: 2.1,
    ansiedade: 2.4,
    burnout: 1.8,
    humor: 3.4,
  },
  {
    week: 'S2',
    estresse: 2.4,
    ansiedade: 2.7,
    burnout: 2.0,
    humor: 3.2,
  },
  {
    week: 'S3',
    estresse: 2.7,
    ansiedade: 2.8,
    burnout: 2.3,
    humor: 3.0,
  },
  {
    week: 'S4',
    estresse: 2.5,
    ansiedade: 2.6,
    burnout: 2.1,
    humor: 3.1,
  },
]

const departmentScores: DepartmentScore[] = [
  {
    department: 'Produto',
    score: 2.2,
  },
  {
    department: 'Engenharia',
    score: 2.9,
  },
  {
    department: 'Comercial',
    score: 2.6,
  },
  {
    department: 'Suporte',
    score: 2.0,
  },
  {
    department: 'Ops',
    score: 2.4,
  },
]

const engagementData = [
  {
    week: 'S1',
    engagement: 72,
  },
  {
    week: 'S2',
    engagement: 78,
  },
  {
    week: 'S3',
    engagement: 69,
  },
  {
    week: 'S4',
    engagement: 82,
  },
]

const chartMargin = { top: 12, right: 24, bottom: 12, left: 0 }

const axisTick = {
  fill: '#64748b',
  fontSize: 12,
}

const tooltipStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  boxShadow: '0 18px 40px rgb(15 23 42 / 0.10)',
}

export default function AnalyticsEquipe() {
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0])

  return (
    <ManagerLayout>
      <div className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Analytics da Equipe
          </h1>
          <p className="text-sm leading-6 text-gray-500">
            Indicadores agregados para acompanhamento organizacional.
          </p>
        </header>

        <div className="space-y-5">
          <section className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4 text-sm font-medium leading-6 text-violet-900 shadow-sm">
            Todos os dados s&atilde;o agregados e an&ocirc;nimos. Grupos com
            menos de 5 pessoas n&atilde;o s&atilde;o exibidos.
          </section>

          <PeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <AnalyticsChart />
          <DepartmentScoresCard />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,1.05fr)]">
          <EngagementChart />
          <DashboardCard>
            <h2 className="text-lg font-semibold text-gray-950">
              Leitura gerencial
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Os indicadores agregados sugerem aumento leve de estresse e
              ansiedade, com engajamento semanal ainda acima de 80%. Recomenda-se
              observar departamentos com score acima de 2.6.
            </p>
          </DashboardCard>
        </section>
      </div>
    </ManagerLayout>
  )
}

function PeriodFilter({
  selectedPeriod,
  onPeriodChange,
}: {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {periodOptions.map((period) => {
        const isActive = selectedPeriod === period

        return (
          <button
            key={period}
            type="button"
            onClick={() => onPeriodChange(period)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-emerald-800 text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-700 hover:text-emerald-800'
            }`}
          >
            {period}
          </button>
        )
      })}
    </div>
  )
}

function AnalyticsChart() {
  return (
    <DashboardCard>
      <ChartHeader
        title={<>Evolu&ccedil;&atilde;o por indicador</>}
        description="Escala agregada de 0 a 4 por semana"
      />

      <div className="mt-8 h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={indicatorData} margin={chartMargin}>
            <CartesianGrid
              stroke="#eef2f7"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickMargin={14}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickMargin={12}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
              contentStyle={tooltipStyle}
              formatter={(value, name) => [`${value}/4`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={38}
              iconType="circle"
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="estresse"
              name="Estresse"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="ansiedade"
              name="Ansiedade"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="burnout"
              name="Burnout"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="humor"
              name="Humor"
              stroke="#0891b2"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}

function DepartmentScoresCard() {
  return (
    <DashboardCard>
      <ChartHeader
        title="Score por departamento"
        description="Quanto maior o score, maior o ponto de atencao"
      />

      <div className="mt-7 space-y-6">
        {departmentScores.map((department) => (
          <DepartmentScoreItem
            key={department.department}
            department={department}
          />
        ))}
      </div>
    </DashboardCard>
  )
}

function DepartmentScoreItem({
  department,
}: {
  department: DepartmentScore
}) {
  const percent = Math.min((department.score / 4) * 100, 100)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-700">
          {department.department}
        </p>
        <p className="text-sm font-semibold text-gray-950">
          {department.score.toFixed(1)}
        </p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${getScoreColor(department.score)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function EngagementChart() {
  return (
    <DashboardCard>
      <ChartHeader
        title="Taxa de engajamento semanal"
        description="Percentual de colaboradores com check-ins respondidos"
      />

      <div className="mt-8 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={engagementData} margin={chartMargin}>
            <defs>
              <linearGradient
                id="engagementGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#047857" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#047857" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#eef2f7"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickMargin={14}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickMargin={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value}%`, 'Engajamento']}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stroke="#047857"
              strokeWidth={2.5}
              fill="url(#engagementGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}

function ChartHeader({
  description,
  title,
}: {
  description: string
  title: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  )
}

function getScoreColor(score: number) {
  if (score >= 2.7) {
    return 'bg-rose-500'
  }

  if (score >= 2.4) {
    return 'bg-amber-500'
  }

  return 'bg-emerald-500'
}
