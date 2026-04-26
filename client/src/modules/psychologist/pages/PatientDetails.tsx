import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type MetricTone = 'high' | 'low' | 'medium'

type PatientMetric = {
  id: string
  label: string
  tone: MetricTone
  value: string
}

type CheckIn = {
  date: string
  mood: string
  note: string
  stressScore: string
}

type PatientDetails = {
  checkIns: CheckIn[]
  id: string
  metrics: PatientMetric[]
  name: string
  sessions: number
  status: string
}

const patientsById: Record<string, PatientDetails> = {
  'amanda-costa': {
    id: 'amanda-costa',
    name: 'Amanda Costa',
    sessions: 12,
    status: 'Ativo',
    metrics: [
      {
        id: 'stress',
        label: 'Estresse',
        value: '8/10',
        tone: 'high',
      },
      {
        id: 'anxiety',
        label: 'Ansiedade',
        value: '8/10',
        tone: 'high',
      },
      {
        id: 'burnout',
        label: 'Burnout',
        value: '8/10',
        tone: 'high',
      },
      {
        id: 'risk',
        label: 'Risco geral',
        value: 'Moderado',
        tone: 'medium',
      },
    ],
    checkIns: [
      {
        date: '10 abr 2026',
        mood: 'Sobrecarregada',
        stressScore: 'Estresse 8/10',
        note: 'Relatou maior cansaco apos jornadas prolongadas.',
      },
      {
        date: '08 abr 2026',
        mood: 'Ansiosa',
        stressScore: 'Estresse 7/10',
        note: 'Dificuldade para desacelerar no fim do dia.',
      },
      {
        date: '05 abr 2026',
        mood: 'Estavel',
        stressScore: 'Estresse 5/10',
        note: 'Manteve rotina de sono e pausas breves.',
      },
    ],
  },
}

const fallbackPatient = patientsById['amanda-costa']

const evolutionData = [
  {
    week: 'Sem 1',
    estresse: 5,
    ansiedade: 5,
    burnout: 4,
  },
  {
    week: 'Sem 2',
    estresse: 6,
    ansiedade: 6,
    burnout: 5,
  },
  {
    week: 'Sem 3',
    estresse: 7,
    ansiedade: 7,
    burnout: 7,
  },
  {
    week: 'Sem 4',
    estresse: 8,
    ansiedade: 8,
    burnout: 8,
  },
]

const metricToneStyles: Record<MetricTone, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  medium: 'bg-amber-50 text-amber-700 ring-amber-100',
  high: 'bg-rose-50 text-rose-700 ring-rose-100',
}

export default function PatientDetails() {
  const { id } = useParams()
  const patient = patientsById[id ?? ''] ?? fallbackPatient

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <PatientHeader patient={patient} />

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {patient.metrics.map((metric) => (
            <PatientMetricCard key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <PatientEvolutionChart />
          <ObservationsCard />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.45fr]">
          <CheckInsList checkIns={patient.checkIns} />
          <ActionPanel />
        </section>
      </div>
    </PsychologistLayout>
  )
}

function PatientHeader({ patient }: { patient: PatientDetails }) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <Link
          to="/psychologist/pacientes"
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:border-emerald-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          Voltar
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            {patient.name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Paciente desde abril de 2026 &bull; {patient.sessions}{' '}
            sess&otilde;es
          </p>
        </div>
      </div>

      <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
        {patient.status}
      </span>
    </header>
  )
}

function PatientMetricCard({ metric }: { metric: PatientMetric }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{metric.label}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-gray-950">
          {metric.value}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${metricToneStyles[metric.tone]}`}
        >
          {getToneLabel(metric.tone)}
        </span>
      </div>
    </article>
  )
}

function PatientEvolutionChart() {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-950">
        Evolu&ccedil;&atilde;o nas &uacute;ltimas semanas
      </h2>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={evolutionData}
            margin={{ top: 8, right: 16, bottom: 8, left: -12 }}
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
            <Line
              type="monotone"
              dataKey="estresse"
              name="Estresse"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="ansiedade"
              name="Ansiedade"
              stroke="#d97706"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="burnout"
              name="Burnout"
              stroke="#059669"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

function CheckInsList({ checkIns }: { checkIns: CheckIn[] }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-950">
        &Uacute;ltimos check-ins
      </h2>

      <div className="mt-5 space-y-4">
        {checkIns.map((checkIn) => (
          <CheckInItem key={`${checkIn.date}-${checkIn.mood}`} checkIn={checkIn} />
        ))}
      </div>
    </article>
  )
}

function CheckInItem({ checkIn }: { checkIn: CheckIn }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-950">
            {checkIn.date} &mdash; {checkIn.mood} &mdash; {checkIn.stressScore}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {checkIn.note}
          </p>
        </div>
      </div>
    </div>
  )
}

function ObservationsCard() {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-950">
        Observa&ccedil;&otilde;es sugeridas
      </h2>
      <p className="mt-4 text-sm leading-7 text-gray-600">
        Paciente apresenta aumento gradual nos indicadores de estresse e
        ansiedade. Recomenda-se acompanhamento pr&oacute;ximo e refor&ccedil;o
        de estrat&eacute;gias de regula&ccedil;&atilde;o emocional.
      </p>
    </article>
  )
}

function ActionPanel() {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-950">
        A&ccedil;&otilde;es
      </h2>

      <div className="mt-5 space-y-3">
        <ActionButton>Enviar mensagem</ActionButton>
        <ActionButton>Agendar sess&atilde;o</ActionButton>
        <ActionButton to="/psychologist/historico">
          Ver hist&oacute;rico completo
        </ActionButton>
      </div>
    </article>
  )
}

function ActionButton({
  children,
  to,
}: {
  children: ReactNode
  to?: string
}) {
  const className =
    'inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2'

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={className}>
      {children}
    </button>
  )
}

function getToneLabel(tone: MetricTone) {
  if (tone === 'low') {
    return 'Leve'
  }

  if (tone === 'medium') {
    return 'Moderado'
  }

  return 'Alto'
}
