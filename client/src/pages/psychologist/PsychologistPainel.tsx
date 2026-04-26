import type { ReactNode } from 'react'

import DashboardCard from '../../components/DashboardCard'
import ProgressBar from '../../components/ProgressBar'
import StatusBadge from '../../components/StatusBadge'
import PsychologistLayout from './PsychologistLayout'

type ClinicalMetric = {
  description: ReactNode
  id: string
  label: ReactNode
  value: string
}

type RiskPatient = {
  detail: ReactNode
  id: string
  name: string
  score: number
  status: ReactNode
}

type Appointment = {
  hour: string
  id: string
  name: string
  type: ReactNode
}

const metrics: ClinicalMetric[] = [
  {
    id: 'patients',
    label: 'Pacientes ativos',
    value: '42',
    description: '8 em acompanhamento intensivo',
  },
  {
    id: 'sessions',
    label: <>Sess&otilde;es hoje</>,
    value: '7',
    description: '3 online e 4 presenciais',
  },
  {
    id: 'alerts',
    label: 'Alertas abertos',
    value: '5',
    description: '2 com prioridade alta',
  },
  {
    id: 'adherence',
    label: <>Ades&atilde;o semanal</>,
    value: '86%',
    description: 'Check-ins respondidos',
  },
]

const riskPatients: RiskPatient[] = [
  {
    id: 'ana',
    name: 'Ana Silva',
    score: 82,
    status: <>Aten&ccedil;&atilde;o</>,
    detail: 'Estresse elevado nos ultimos 3 check-ins.',
  },
  {
    id: 'joao',
    name: 'Joao Pereira',
    score: 74,
    status: <>Observa&ccedil;&atilde;o</>,
    detail: 'Queda de humor e baixa adesao ao plano.',
  },
  {
    id: 'carla',
    name: 'Carla Mendes',
    score: 61,
    status: <>Est&aacute;vel</>,
    detail: 'Indicadores sem variacao brusca na semana.',
  },
]

const appointments: Appointment[] = [
  {
    id: 'session-1',
    hour: '09:00',
    name: 'Ana Silva',
    type: <>Sess&atilde;o individual</>,
  },
  {
    id: 'session-2',
    hour: '11:30',
    name: 'Joao Pereira',
    type: <>Revis&atilde;o de plano</>,
  },
  {
    id: 'session-3',
    hour: '15:00',
    name: 'Grupo Ansiedade',
    type: <>Sess&atilde;o em grupo</>,
  },
]

export default function PsychologistPainel() {
  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <PageHeader />

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricSummary key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <RiskOverview patients={riskPatients} />
          <TodaySchedule appointments={appointments} />
        </section>
      </div>
    </PsychologistLayout>
  )
}

function PageHeader() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Painel Geral
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Vis&atilde;o cl&iacute;nica dos pacientes acompanhados hoje.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm">
        Hoje
      </div>
    </header>
  )
}

function MetricSummary({ metric }: { metric: ClinicalMetric }) {
  return (
    <DashboardCard className="p-5">
      <p className="text-sm font-medium text-gray-500">{metric.label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-gray-950">
        {metric.value}
      </p>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        {metric.description}
      </p>
    </DashboardCard>
  )
}

function RiskOverview({ patients }: { patients: RiskPatient[] }) {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-950">
          Prioridades cl&iacute;nicas
        </h2>
        <StatusBadge variant="attention">5 alertas</StatusBadge>
      </div>

      <div className="mt-6 space-y-5">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-xl border border-gray-100 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-950">{patient.name}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {patient.detail}
                </p>
              </div>
              <StatusBadge variant={patient.score > 75 ? 'attention' : 'stable'}>
                {patient.status}
              </StatusBadge>
            </div>
            <div className="mt-4">
              <ProgressBar
                colorClassName={
                  patient.score > 75 ? 'bg-rose-500' : 'bg-amber-500'
                }
                label="Indice de risco"
                level={`${patient.score}/100`}
                value={patient.score}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

function TodaySchedule({ appointments }: { appointments: Appointment[] }) {
  return (
    <DashboardCard>
      <h2 className="text-lg font-semibold text-gray-950">Agenda do dia</h2>

      <div className="mt-6 space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex gap-4 rounded-xl border border-gray-100 p-4"
          >
            <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-700">
              {appointment.hour}
            </div>
            <div>
              <h3 className="font-semibold text-gray-950">
                {appointment.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{appointment.type}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
