import { useEffect, useState, type ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import Snackbar from '../../../components/Snackbar'
import { useManagerMentalHealthReport } from '../../../hooks/useApi/useManager'
import ManagerLayout from './ManagerLayout'

export default function ManagerRelatorios() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const { data, loading, error, refetch } = useManagerMentalHealthReport()

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error || 'Erro ao carregar relatorio.',
      })
    }
  }, [error])

  return (
    <ManagerLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Relat&oacute;rios
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Indicadores gerenciais agregados da plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
          >
            Atualizar
          </button>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-500">Carregando relatorio...</p>
        )}

        {!loading && data && (
          <>
            <section className="grid gap-5 md:grid-cols-3">
              <ReportMetricCard
                label="Pacientes ativos"
                value={data.totalPatients}
                tone="text-emerald-700"
              />
              <ReportMetricCard
                label="Insights gerados"
                value={data.insightsGenerated}
                tone="text-blue-700"
              />
              <ReportMetricCard
                label="Alertas ativos"
                value={data.alertsActive}
                tone="text-rose-600"
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]">
              <DashboardCard>
                <h2 className="text-lg font-semibold text-gray-950">
                  Distribui&ccedil;&atilde;o de alertas por origem
                </h2>

                <div className="mt-6 space-y-5">
                  {data.alertsByOrigin.length === 0 && (
                    <p className="text-sm text-gray-500">
                      Nenhum alerta registrado no periodo.
                    </p>
                  )}
                  {data.alertsByOrigin.map((item) => (
                    <OriginBar
                      key={item.origem}
                      label={formatOrigin(item.origem)}
                      value={item.count}
                      total={data.alertsActive}
                    />
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard>
                <h2 className="text-lg font-semibold text-gray-950">
                  Leitura executiva
                </h2>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Este relatorio consolida sinais de acompanhamento sem expor
                  conteudo sensivel individual. Use os totais para orientar
                  capacidade clinica, governanca e priorizacao de alertas.
                </p>
              </DashboardCard>
            </section>
          </>
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

function ReportMetricCard({
  label,
  tone,
  value,
}: {
  label: ReactNode
  tone: string
  value: number
}) {
  return (
    <DashboardCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className={`text-4xl font-semibold tracking-tight ${tone}`}>
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-gray-500">{label}</p>
    </DashboardCard>
  )
}

function OriginBar({
  label,
  total,
  value,
}: {
  label: string
  total: number
  value: number
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm font-semibold text-gray-950">{value}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function formatOrigin(origin: string) {
  return origin === 'ia' ? 'IA' : 'Manual'
}
