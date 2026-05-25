import { useEffect, useState } from 'react'

import { api } from '../../../hooks/useApi'
import type { Insight } from './InsightCard'

type Message = {
  id_mensagem: number
  conteudo: string
  remetente: string
  data_envio: string
}

type ConversationTranscriptModalProps = {
  open: boolean
  id_conversa: number | null
  onClose: () => void
  onInsightsGenerated: (insights: Insight[]) => void
}

export default function ConversationTranscriptModal({
  open,
  id_conversa,
  onClose,
  onInsightsGenerated,
}: ConversationTranscriptModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || id_conversa == null) {
      setMessages([])
      setError('')
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')

    api(`/psychologist/conversations/${id_conversa}`)
      .then(async (res) => {
        const payload = await res.json().catch(() => null)
        if (cancelled) return
        if (!res.ok || !payload?.success) {
          setError(payload?.message || 'Erro ao carregar conversa.')
          setMessages([])
          return
        }
        setMessages(payload.data?.messages ?? [])
      })
      .catch(() => {
        if (!cancelled) setError('Erro ao carregar conversa.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, id_conversa])

  async function handleGenerate() {
    if (id_conversa == null || generating) return
    setGenerating(true)
    setError('')
    try {
      const res = await api(
        `/psychologist/conversations/${id_conversa}/generate-insights`,
        { method: 'POST' },
      )
      const payload = await res.json().catch(() => null)
      if (!res.ok || !payload?.success) {
        setError(payload?.message || 'Erro ao gerar insights.')
        return
      }
      onInsightsGenerated(payload.data ?? [])
      onClose()
    } catch {
      setError('Erro ao gerar insights.')
    } finally {
      setGenerating(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-950">
            Transcricao da conversa
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <p className="text-sm text-gray-500">Carregando mensagens...</p>
          )}
          {!loading && messages.length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma mensagem nesta conversa.</p>
          )}
          <div className="space-y-3">
            {messages.map((msg) => {
              const isUser = msg.remetente === 'usuario'
              return (
                <div
                  key={msg.id_mensagem}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-6 ${
                      isUser
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-gray-800'
                    }`}
                  >
                    {msg.conteudo}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <p className="px-6 pb-2 text-sm text-rose-600">{error}</p>
        )}

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || loading}
            className="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? 'Gerando...' : 'Gerar insights'}
          </button>
        </div>
      </div>
    </div>
  )
}
