import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type PatientLevel = 'Alto' | 'Medio' | 'Baixo'

type Patient = {
  anxiety: number
  burnout: number
  id: string
  level: PatientLevel
  name: string
  sessions: number
  stress: number
}

const patients: Patient[] = [
  {
    id: 'amanda-costa',
    name: 'Amanda Costa',
    level: 'Alto',
    stress: 8,
    anxiety: 8,
    burnout: 8,
    sessions: 12,
  },
  {
    id: 'bruno-lima',
    name: 'Bruno Lima',
    level: 'Medio',
    stress: 6,
    anxiety: 7,
    burnout: 5,
    sessions: 9,
  },
  {
    id: 'carla-mendes',
    name: 'Carla Mendes',
    level: 'Baixo',
    stress: 3,
    anxiety: 4,
    burnout: 2,
    sessions: 16,
  },
  {
    id: 'daniel-rocha',
    name: 'Daniel Rocha',
    level: 'Alto',
    stress: 9,
    anxiety: 8,
    burnout: 7,
    sessions: 7,
  },
  {
    id: 'elisa-martins',
    name: 'Elisa Martins',
    level: 'Medio',
    stress: 5,
    anxiety: 6,
    burnout: 5,
    sessions: 14,
  },
  {
    id: 'fernando-alves',
    name: 'Fernando Alves',
    level: 'Baixo',
    stress: 2,
    anxiety: 3,
    burnout: 3,
    sessions: 11,
  },
  {
    id: 'gabriela-souza',
    name: 'Gabriela Souza',
    level: 'Alto',
    stress: 8,
    anxiety: 9,
    burnout: 8,
    sessions: 10,
  },
  {
    id: 'heitor-nunes',
    name: 'Heitor Nunes',
    level: 'Medio',
    stress: 6,
    anxiety: 5,
    burnout: 6,
    sessions: 8,
  },
  {
    id: 'isabela-ferreira',
    name: 'Isabela Ferreira',
    level: 'Baixo',
    stress: 4,
    anxiety: 3,
    burnout: 2,
    sessions: 18,
  },
  {
    id: 'juliana-cardoso',
    name: 'Juliana Cardoso',
    level: 'Medio',
    stress: 7,
    anxiety: 6,
    burnout: 5,
    sessions: 13,
  },
  {
    id: 'lucas-pereira',
    name: 'Lucas Pereira',
    level: 'Alto',
    stress: 9,
    anxiety: 7,
    burnout: 8,
    sessions: 6,
  },
  {
    id: 'marina-gomes',
    name: 'Marina Gomes',
    level: 'Baixo',
    stress: 3,
    anxiety: 2,
    burnout: 3,
    sessions: 15,
  },
]

const levelOptions = ['Todos os n\u00edveis', 'Alto', 'M\u00e9dio', 'Baixo']

export default function Pacientes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0])

  const filteredPatients = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm)
    const normalizedLevel = normalizeText(selectedLevel)

    return patients.filter((patient) => {
      const matchesSearch = normalizeText(patient.name).includes(normalizedSearch)
      const matchesLevel =
        selectedLevel === levelOptions[0] ||
        normalizeText(patient.level) === normalizedLevel

      return matchesSearch && matchesLevel
    })
  }, [searchTerm, selectedLevel])

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Pacientes - Dra. Renata
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-base font-semibold text-gray-700">
                Meus pacientes
              </p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                12 ativos
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="w-full sm:w-72">
              <span className="sr-only">Buscar paciente</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar paciente..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="w-full sm:w-48">
              <span className="sr-only">Filtrar por n&iacute;vel</span>
              <select
                value={selectedLevel}
                onChange={(event) => setSelectedLevel(event.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                {levelOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </section>
      </div>
    </PsychologistLayout>
  )
}

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-800">
          {patient.name.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-gray-950">
            {patient.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {patient.sessions} sess&otilde;es
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <MetricChip label="Estresse" value={patient.stress} />
        <MetricChip label="Ansiedade" value={patient.anxiety} />
        <MetricChip label="Burnout" value={patient.burnout} />
      </div>

      <Link
        to={`/psychologist/pacientes/${patient.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        Ver detalhes
      </Link>
    </article>
  )
}

function MetricChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
      {label} {value}
    </span>
  )
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
