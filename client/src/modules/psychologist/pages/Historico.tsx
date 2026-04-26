import { useMemo, useState } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import StatusBadge, { type StatusVariant } from '../../../components/StatusBadge'
import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type RiskLevel = 'Alto' | 'Baixo' | 'Medio'

type HistoryRecord = {
  date: string
  id: string
  patientName: string
  risk: RiskLevel
  summary: string
  type: 'Alerta' | 'Check-in' | 'Insight' | 'Sessao'
}

type SelectFieldProps = {
  label: string
  onChange: (value: string) => void
  options: string[]
  value: string
}

const historyRecords: HistoryRecord[] = [
  {
    id: 'record-1',
    patientName: 'Amanda Costa',
    date: '10 abr 2026',
    type: 'Check-in',
    summary: 'Relatou alto nivel de estresse',
    risk: 'Alto',
  },
  {
    id: 'record-2',
    patientName: 'Joao Lima',
    date: '09 abr 2026',
    type: 'Sessao',
    summary: 'Revisao de progresso semanal',
    risk: 'Medio',
  },
  {
    id: 'record-3',
    patientName: 'Carla Souza',
    date: '08 abr 2026',
    type: 'Alerta',
    summary: 'Aumento nos sinais de burnout',
    risk: 'Alto',
  },
  {
    id: 'record-4',
    patientName: 'Marina Alves',
    date: '07 abr 2026',
    type: 'Insight',
    summary: 'Melhora no padrao de sono',
    risk: 'Baixo',
  },
  {
    id: 'record-5',
    patientName: 'Amanda Costa',
    date: '05 abr 2026',
    type: 'Sessao',
    summary: 'Reforco de estrategias de regulacao emocional',
    risk: 'Medio',
  },
  {
    id: 'record-6',
    patientName: 'Bruno Lima',
    date: '03 abr 2026',
    type: 'Check-in',
    summary: 'Indicadores estaveis durante a semana',
    risk: 'Baixo',
  },
]

const patientOptions = ['Todos os pacientes', ...getUniquePatientNames()]
const periodOptions = [
  'Todos os per\u00edodos',
  '\u00daltimos 7 dias',
  '\u00daltimos 30 dias',
  '\u00daltimos 90 dias',
]

const riskVariants: Record<RiskLevel, StatusVariant> = {
  Alto: 'attention',
  Baixo: 'improvement',
  Medio: 'stable',
}

export default function Historico() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(patientOptions[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0])

  const filteredRecords = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm)

    return historyRecords.filter((record) => {
      const matchesSearch = normalizeText(record.patientName).includes(
        normalizedSearch,
      )
      const matchesPatient =
        selectedPatient === patientOptions[0] ||
        record.patientName === selectedPatient

      return matchesSearch && matchesPatient
    })
  }, [searchTerm, selectedPatient])

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Hist&oacute;rico
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Acompanhe registros recentes dos seus pacientes
          </p>
        </header>

        <HistoryFilters
          searchTerm={searchTerm}
          selectedPatient={selectedPatient}
          selectedPeriod={selectedPeriod}
          onSearchChange={setSearchTerm}
          onPatientChange={setSelectedPatient}
          onPeriodChange={setSelectedPeriod}
        />

        {filteredRecords.length > 0 ? (
          <section className="space-y-4">
            {filteredRecords.map((record) => (
              <HistoryItem key={record.id} record={record} />
            ))}
          </section>
        ) : (
          <DashboardCard>
            <p className="text-center text-sm font-medium text-gray-500">
              Nenhum registro encontrado.
            </p>
          </DashboardCard>
        )}
      </div>
    </PsychologistLayout>
  )
}

function HistoryFilters({
  searchTerm,
  selectedPatient,
  selectedPeriod,
  onSearchChange,
  onPatientChange,
  onPeriodChange,
}: {
  searchTerm: string
  selectedPatient: string
  selectedPeriod: string
  onSearchChange: (value: string) => void
  onPatientChange: (value: string) => void
  onPeriodChange: (value: string) => void
}) {
  return (
    <DashboardCard className="p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_220px_220px]">
        <label>
          <span className="sr-only">Buscar paciente</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar paciente..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <SelectField
          label="Selecionar paciente"
          options={patientOptions}
          value={selectedPatient}
          onChange={onPatientChange}
        />
        <SelectField
          label="Selecionar periodo"
          options={periodOptions}
          value={selectedPeriod}
          onChange={onPeriodChange}
        />
      </div>
    </DashboardCard>
  )
}

function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function HistoryItem({ record }: { record: HistoryRecord }) {
  return (
    <DashboardCard className="p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
            <h2 className="break-words text-lg font-semibold text-gray-950">
              {record.patientName}
            </h2>
            <p className="text-sm font-medium text-gray-400">{record.date}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <StatusBadge variant="new">{formatRecordType(record.type)}</StatusBadge>
            <p className="text-sm leading-6 text-gray-600">{record.summary}</p>
          </div>
        </div>

        <div className="flex md:justify-end">
          <RiskBadge risk={record.risk} />
        </div>
      </div>
    </DashboardCard>
  )
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const variantByRisk = riskVariants[risk]

  return <StatusBadge variant={variantByRisk}>{formatRiskLevel(risk)}</StatusBadge>
}

function formatRecordType(type: HistoryRecord['type']) {
  if (type === 'Sessao') {
    return 'Sess\u00e3o'
  }

  return type
}

function formatRiskLevel(risk: RiskLevel) {
  if (risk === 'Medio') {
    return 'M\u00e9dio'
  }

  return risk
}

function getUniquePatientNames() {
  return Array.from(new Set(historyRecords.map((record) => record.patientName)))
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
