export type Insight = {
  id_insight: number
  conteudo: string
  seriedade: 'padrao' | 'alerta' | 'bom'
  origem: 'manual' | 'ia'
  criado_em: string
  modificado_em: string
}

const seriedadeStyles: Record<Insight['seriedade'], string> = {
  alerta: 'bg-rose-50 text-rose-700 ring-rose-100',
  padrao: 'bg-gray-100 text-gray-700 ring-gray-200',
  bom: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

const seriedadeLabels: Record<Insight['seriedade'], string> = {
  alerta: 'Alerta',
  padrao: 'Padrao',
  bom: 'Bom',
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

type InsightCardProps = {
  insight: Insight
  onEdit: (insight: Insight) => void
  onDelete: (insight: Insight) => void
}

export default function InsightCard({
  insight,
  onEdit,
  onDelete,
}: InsightCardProps) {
  function handleDelete() {
    if (
      window.confirm('Tem certeza que deseja excluir este insight?')
    ) {
      onDelete(insight)
    }
  }

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${seriedadeStyles[insight.seriedade]}`}
        >
          {seriedadeLabels[insight.seriedade]}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {insight.origem === 'ia' ? 'Gerado por IA' : 'Manual'}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-700">{insight.conteudo}</p>

      <p className="mt-3 text-xs text-gray-400">
        {formatDateTime(insight.criado_em)}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(insight)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-emerald-700 hover:text-emerald-800"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
        >
          Excluir
        </button>
      </div>
    </article>
  )
}
