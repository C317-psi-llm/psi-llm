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

import ChartCard from '../components/ChartCard'
import MetricCard from '../components/MetricCard'
import DashboardLayout from '../layouts/DashboardLayout'

const metrics = [
  {
    id: 'stress',
    label: 'Estresse',
    value: 55,
    accentClassName: 'text-orange-500',
  },
  {
    id: 'anxiety',
    label: 'Ansiedade',
    value: 10,
    accentClassName: 'text-emerald-600',
  },
  {
    id: 'burnout',
    label: 'Burnout',
    value: 15,
    accentClassName: 'text-emerald-600',
  },
  {
    id: 'depression',
    label: <>Depress&atilde;o</>,
    value: 80,
    accentClassName: 'text-red-500',
  },
]

const trendData = [
  {
    week: 'Sem 1',
    estresse: 62,
    ansiedade: 22,
    burnout: 28,
    depressao: 70,
  },
  {
    week: 'Sem 2',
    estresse: 58,
    ansiedade: 18,
    burnout: 24,
    depressao: 74,
  },
  {
    week: 'Sem 3',
    estresse: 65,
    ansiedade: 14,
    burnout: 19,
    depressao: 78,
  },
  {
    week: 'Sem 4',
    estresse: 55,
    ansiedade: 10,
    burnout: 15,
    depressao: 80,
  },
]

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader />

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              accentClassName={metric.accentClassName}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </section>

        <ChartCard title={<>Tend&ecirc;ncia por Tema</>}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 12, right: 24, left: 8, bottom: 16 }}
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
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickMargin={14}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickMargin={12}
                tickFormatter={formatLevelTick}
              />
              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
                contentStyle={{
                  border: '1px solid #eef2f7',
                  borderRadius: '12px',
                  boxShadow: '0 18px 40px rgb(15 23 42 / 0.10)',
                  padding: '10px 12px',
                }}
                labelStyle={{
                  color: '#0f172a',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
                itemStyle={{ color: '#475569', fontSize: 12 }}
                formatter={(value, name) => [`${value}/100`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={44}
                iconType="circle"
                wrapperStyle={{ paddingTop: 22, fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="estresse"
                name="Estresse"
                stroke="#fb923c"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="ansiedade"
                name="Ansiedade"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="burnout"
                name="Burnout"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="depressao"
                name={'Depress\u00e3o'}
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  )
}

function PageHeader() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Meu painel de sa&uacute;de mental
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-500">
          &Uacute;ltimos 30 dias
        </p>
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:border-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Per&iacute;odo
        </button>
      </div>
    </header>
  )
}

function formatLevelTick(value: number) {
  if (value >= 100) {
    return 'Alto'
  }

  if (value >= 50) {
    return 'M\u00e9dio'
  }

  return 'Baixo'
}
