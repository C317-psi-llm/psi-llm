import { useMemo, useState } from 'react'

import DashboardCard from '../../components/DashboardCard'
import StatusBadge, { type StatusVariant } from '../../components/StatusBadge'
import PsychologistLayout from './PsychologistLayout'

type PatientRecord = {
  adherence: string
  id: string
  lastCheckIn: string
  name: string
  nextSession: string
  status: StatusVariant
  statusLabel: string
}

const patients: PatientRecord[] = [
  {
    id: 'ana',
    name: 'Ana Silva',
    status: 'attention',
    statusLabel: 'Atencao',
    lastCheckIn: 'Hoje, 08:10',
    nextSession: 'Hoje, 09:00',
    adherence: '92%',
  },
  {
    id: 'joao',
    name: 'Joao Pereira',
    status: 'stable',
    statusLabel: 'Observacao',
    lastCheckIn: 'Ontem, 19:45',
    nextSession: 'Hoje, 11:30',
    adherence: '68%',
  },
  {
    id: 'carla',
    name: 'Carla Mendes',
    status: 'improvement',
    statusLabel: 'Melhora',
    lastCheckIn: 'Hoje, 07:20',
    nextSession: 'Amanha, 14:00',
    adherence: '88%',
  },
  {
    id: 'bruno',
    name: 'Bruno Lima',
    status: 'new',
    statusLabel: 'Novo',
    lastCheckIn: 'Sem registro',
    nextSession: 'Sexta, 10:00',
    adherence: '0%',
  },
]

export default function PsychologistPacientes() {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      ),
    [searchTerm],
  )

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Pacientes
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Acompanhe ades&atilde;o, risco e pr&oacute;ximas sess&otilde;es.
            </p>
          </div>

          <label className="w-full max-w-sm">
            <span className="sr-only">Buscar paciente</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar paciente"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </header>

        <DashboardCard className="overflow-hidden p-0">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 max-lg:hidden">
            <span>Paciente</span>
            <span>Status</span>
            <span>&Uacute;ltimo check-in</span>
            <span>Pr&oacute;xima sess&atilde;o</span>
            <span>Ades&atilde;o</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <article
                key={patient.id}
                className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.7fr] lg:items-center"
              >
                <div>
                  <h2 className="font-semibold text-gray-950">
                    {patient.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    ID cl&iacute;nico: {patient.id.toUpperCase()}
                  </p>
                </div>
                <StatusBadge variant={patient.status}>
                  {patient.statusLabel}
                </StatusBadge>
                <InfoBlock label="Ultimo check-in" value={patient.lastCheckIn} />
                <InfoBlock
                  label="Proxima sessao"
                  value={patient.nextSession}
                />
                <InfoBlock label="Adesao" value={patient.adherence} />
              </article>
            ))}
          </div>
        </DashboardCard>
      </div>
    </PsychologistLayout>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 lg:hidden">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  )
}
