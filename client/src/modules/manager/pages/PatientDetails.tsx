import { Link, useParams } from 'react-router-dom'

import DashboardCard from '../../../components/DashboardCard'
import StatusBadge from '../../../components/StatusBadge'
import { useManagerPatientDetail } from '../../../hooks/useApi/useManager'
import ManagerLayout from './ManagerLayout'

export default function ManagerPatientDetails() {
  const { id } = useParams()
  const patientId = Number(id)
  const validPatientId = Number.isFinite(patientId) ? patientId : null
  const { data: patient, loading, error } = useManagerPatientDetail(validPatientId)

  if (!validPatientId) {
    return (
      <ManagerLayout>
        <NotFoundMessage />
      </ManagerLayout>
    )
  }

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header>
          <Link
            to="/manager/pacientes"
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:border-emerald-700 hover:text-emerald-800"
          >
            Voltar
          </Link>
          <div className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Detalhes do paciente
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Visao administrativa com dados cadastrais e responsavel clinico.
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && <p className="text-sm text-gray-500">Carregando...</p>}

        {!loading && !patient && <NotFoundMessage />}

        {!loading && patient && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <DashboardCard>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-800">
                  {patient.nome.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
                    {patient.nome}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{patient.email}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge
                      variant={
                        patient.status === 'active' ? 'improvement' : 'stable'
                      }
                    >
                      {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                    <StatusBadge
                      variant={patient.aceitou_lgpd ? 'stable' : 'attention'}
                    >
                      LGPD {patient.aceitou_lgpd ? 'aceita' : 'pendente'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h2 className="text-lg font-semibold text-gray-950">
                Acompanhamento
              </h2>
              <dl className="mt-5 space-y-4">
                <DetailRow
                  label="Psicologo"
                  value={patient.psicologo_nome || 'Nao atribuido'}
                />
                <DetailRow
                  label="Cadastro"
                  value={formatDate(patient.data_cadastro)}
                />
                <DetailRow label="ID" value={patient.id_usuario} />
              </dl>
            </DashboardCard>
          </section>
        )}
      </div>
    </ManagerLayout>
  )
}

function NotFoundMessage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Paciente nao encontrado.</p>
      <Link
        to="/manager/pacientes"
        className="inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-emerald-700 hover:text-emerald-800"
      >
        Voltar
      </Link>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR')
}
