import type { ReactNode } from 'react'

import DashboardCard from '../../components/DashboardCard'
import StatusBadge from '../../components/StatusBadge'
import PsychologistLayout from './PsychologistLayout'

type HistoryEntry = {
  date: string
  id: string
  note: ReactNode
  patient: string
  summary: ReactNode
  tag: ReactNode
}

const historyEntries: HistoryEntry[] = [
  {
    id: 'entry-1',
    date: 'Hoje, 09:50',
    patient: 'Ana Silva',
    tag: <>Plano atualizado</>,
    summary: <>Sess&atilde;o individual conclu&iacute;da</>,
    note: 'Incluida rotina de pausa breve antes de reunioes de alta demanda.',
  },
  {
    id: 'entry-2',
    date: 'Ontem, 16:20',
    patient: 'Carla Mendes',
    tag: 'Evolucao',
    summary: <>Check-in revisado</>,
    note: 'Indicadores sugerem melhora de sono e maior regularidade emocional.',
  },
  {
    id: 'entry-3',
    date: 'Segunda, 11:10',
    patient: 'Joao Pereira',
    tag: <>Aten&ccedil;&atilde;o</>,
    summary: <>Alerta analisado</>,
    note: 'Baixa adesao ao plano nas ultimas 2 semanas. Reforcar combinados.',
  },
]

export default function PsychologistHistorico() {
  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Hist&oacute;rico
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Linha do tempo de sess&otilde;es, alertas e atualiza&ccedil;&otilde;es
            cl&iacute;nicas.
          </p>
        </header>

        <DashboardCard>
          <div className="space-y-6">
            {historyEntries.map((entry, index) => (
              <article key={entry.id} className="relative pl-8">
                {index < historyEntries.length - 1 && (
                  <span className="absolute left-[7px] top-5 h-full w-px bg-gray-200" />
                )}
                <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {entry.date}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-gray-950">
                      {entry.patient}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      {entry.summary}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {entry.note}
                    </p>
                  </div>
                  <StatusBadge variant={index === 2 ? 'attention' : 'stable'}>
                    {entry.tag}
                  </StatusBadge>
                </div>
              </article>
            ))}
          </div>
        </DashboardCard>
      </div>
    </PsychologistLayout>
  )
}
