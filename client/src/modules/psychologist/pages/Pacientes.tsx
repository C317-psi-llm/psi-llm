import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import Snackbar from '../../../components/Snackbar'
import { api } from '../../../hooks/useApi'
import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type Patient = {
  id_usuario: number
  nome: string
  email: string
  status: string
}

export default function Pacientes() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    api('/psychologist/patients')
      .then(async (res) => {
        const payload = await res.json().catch(() => null)
        if (cancelled) return
        if (!res.ok || !payload?.success) {
          setSnackbar({
            open: true,
            message: payload?.message || 'Erro ao carregar pacientes.',
          })
          setPatients([])
          return
        }
        setPatients(payload.data ?? [])
      })
      .catch(() => {
        if (!cancelled) {
          setSnackbar({
            open: true,
            message: 'Erro ao carregar pacientes.',
          })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredPatients = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm)
    if (!normalizedSearch) return patients
    return patients.filter(
      (p) =>
        normalizeText(p.nome).includes(normalizedSearch) ||
        normalizeText(p.email).includes(normalizedSearch),
    )
  }, [patients, searchTerm])

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Meus pacientes
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {patients.length} {patients.length === 1 ? 'ativo' : 'ativos'}
              </span>
            </div>
          </div>

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
        </header>

        {loading && (
          <p className="text-sm text-gray-500">Carregando pacientes...</p>
        )}

        {!loading && patients.length === 0 && (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Voce ainda nao possui pacientes atribuidos.
          </p>
        )}

        {!loading && patients.length > 0 && filteredPatients.length === 0 && (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Nenhum paciente encontrado para esta busca.
          </p>
        )}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id_usuario} patient={patient} />
          ))}
        </section>
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant="error"
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </PsychologistLayout>
  )
}

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-semibold text-emerald-800">
          {patient.nome.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-gray-950">
            {patient.nome}
          </h2>
          <p className="mt-1 truncate text-sm font-medium text-gray-500">
            {patient.email}
          </p>
        </div>
      </div>

      <Link
        to={`/psychologist/pacientes/${patient.id_usuario}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        Ver detalhes
      </Link>
    </article>
  )
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
