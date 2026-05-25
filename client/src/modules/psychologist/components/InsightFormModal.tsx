import { useEffect, useState, type FormEvent } from 'react'

import type { Insight } from './InsightCard'

type InsightFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initial?: Pick<Insight, 'conteudo' | 'seriedade'>
  onClose: () => void
  onSubmit: (data: {
    conteudo: string
    seriedade: Insight['seriedade']
  }) => void
}

export default function InsightFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: InsightFormModalProps) {
  const [conteudo, setConteudo] = useState('')
  const [seriedade, setSeriedade] = useState<Insight['seriedade']>('padrao')

  useEffect(() => {
    if (open) {
      setConteudo(initial?.conteudo ?? '')
      setSeriedade(initial?.seriedade ?? 'padrao')
    }
  }, [open, initial])

  if (!open) return null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = conteudo.trim()
    if (!trimmed) return
    onSubmit({ conteudo: trimmed, seriedade })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-gray-950">
          {mode === 'create' ? 'Novo insight' : 'Editar insight'}
        </h2>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-gray-700">Conteudo</span>
          <textarea
            rows={5}
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-gray-700">Seriedade</span>
          <select
            value={seriedade}
            onChange={(e) =>
              setSeriedade(e.target.value as Insight['seriedade'])
            }
            className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="padrao">Padrao</option>
            <option value="alerta">Alerta</option>
            <option value="bom">Bom</option>
          </select>
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!conteudo.trim()}
            className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}
