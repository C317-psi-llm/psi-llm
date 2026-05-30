import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import DashboardCard from '../../../components/DashboardCard'
import Snackbar from '../../../components/Snackbar'
import { useManagerPatients } from '../../../hooks/useApi/useManager'
import ManagerLayout from './ManagerLayout'

type Patient = {
  id_usuario: number
  nome: string
  email: string
  status: string
  aceitou_lgpd: boolean
  psicologo_nome: string | null
  psicologo_id: number | null
}

export default function ManagerPacientes() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const { data, loading, error } = useManagerPatients(page, 10)

  const filteredPatients = useMemo(() => {
    if (!data?.items) return []
    const normalizedSearch = searchTerm.toLowerCase()
    if (!normalizedSearch) return data.items
    return data.items.filter(
      (p) =>
        p.nome.toLowerCase().includes(normalizedSearch) ||
        p.email.toLowerCase().includes(normalizedSearch) ||
        (p.psicologo_nome && p.psicologo_nome.toLowerCase().includes(normalizedSearch)),
    )
  }, [data?.items, searchTerm])

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error || 'Erro ao carregar pacientes.',
      })
    }
  }, [error])

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Pacientes
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Visualize indicadores agregados de pacientes acompanhados pela operação.
            </p>
            {data?.total && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  {data.total} {data.total === 1 ? 'paciente' : 'pacientes'}
                </span>
              </div>
            )}
          </div>

          <label className="w-full sm:w-72">
            <span className="sr-only">Buscar paciente</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nome, email ou psicólogo..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Carregando pacientes...</p>
        )}

        {!loading && (!data?.items || data.items.length === 0) && (
          <DashboardCard>
            <p className="text-center text-sm text-gray-500">
              Nenhum paciente encontrado.
            </p>
          </DashboardCard>
        )}

        {!loading && filteredPatients.length === 0 && data?.items && data.items.length > 0 && (
          <DashboardCard>
            <p className="text-center text-sm text-gray-500">
              Nenhum paciente encontrado para esta busca.
            </p>
          </DashboardCard>
        )}

        {!loading && filteredPatients.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id_usuario} patient={patient} />
            ))}
          </section>
        )}

        {data && data.total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {page} de {Math.ceil(data.total / data.limit)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data.items || data.items.length < data.limit}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant="error"
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </ManagerLayout>
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

          {patient.psicologo_nome && (
            <p className="mt-2 truncate text-sm text-gray-600">
              <span className="font-medium">Psicólogo:</span> {patient.psicologo_nome}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                patient.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {patient.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
            {patient.aceitou_lgpd && (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                LGPD ✓
              </span>
            )}
          </div>
        </div>
      </div>

      <Link
        to={`/manager/pacientes/${patient.id_usuario}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
      >
        Ver detalhes
      </Link>
    </article>
  )
}
