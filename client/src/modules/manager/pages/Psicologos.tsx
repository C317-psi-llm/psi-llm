import { useEffect, useMemo, useState } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import Snackbar from '../../../components/Snackbar'
import { useManagerPsychologists } from '../../../hooks/useApi/useManager'
import ManagerLayout from './ManagerLayout'

type Psychologist = {
  id_usuario: number
  nome: string
  email: string
  status: string
  patientCount: number
}

export default function ManagerPsicologos() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const { data, loading, error } = useManagerPsychologists(page, 10)

  const filteredPsychologists = useMemo(() => {
    if (!data?.items) return []
    const normalizedSearch = searchTerm.toLowerCase()
    if (!normalizedSearch) return data.items
    return data.items.filter(
      (p) =>
        p.nome.toLowerCase().includes(normalizedSearch) ||
        p.email.toLowerCase().includes(normalizedSearch),
    )
  }, [data?.items, searchTerm])

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error || 'Erro ao carregar psicólogos.',
      })
    }
  }, [error])

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Psicólogos
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Acompanhe capacidade, agenda e distribuição da equipe clínica.
            </p>
            {data?.total && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {data.total} {data.total === 1 ? 'psicólogo' : 'psicólogos'}
                </span>
              </div>
            )}
          </div>

          <label className="w-full sm:w-72">
            <span className="sr-only">Buscar psicólogo</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nome ou email..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Carregando psicólogos...</p>
        )}

        {!loading && (!data?.items || data.items.length === 0) && (
          <DashboardCard>
            <p className="text-center text-sm text-gray-500">
              Nenhum psicólogo encontrado.
            </p>
          </DashboardCard>
        )}

        {!loading && filteredPsychologists.length === 0 && data?.items && data.items.length > 0 && (
          <DashboardCard>
            <p className="text-center text-sm text-gray-500">
              Nenhum psicólogo encontrado para esta busca.
            </p>
          </DashboardCard>
        )}

        {!loading && filteredPsychologists.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPsychologists.map((psychologist) => (
              <PsychologistCard key={psychologist.id_usuario} psychologist={psychologist} />
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

function PsychologistCard({ psychologist }: { psychologist: Psychologist }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-800">
          {psychologist.nome.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-gray-950">
            {psychologist.nome}
          </h2>
          <p className="mt-1 truncate text-sm font-medium text-gray-500">
            {psychologist.email}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                psychologist.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {psychologist.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
              {psychologist.patientCount} {psychologist.patientCount === 1 ? 'paciente' : 'pacientes'}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
