import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Snackbar from '../../../components/Snackbar'
import { api } from '../../../hooks/useApi'
import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'
import ConversationTranscriptModal from '../components/ConversationTranscriptModal'
import InsightCard, { type Insight } from '../components/InsightCard'
import InsightFormModal from '../components/InsightFormModal'

type Patient = {
  id_usuario: number
  nome: string
  email: string
  status: string
}

type Conversation = {
  id_conversa: number
  data_inicio: string
  status: string
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function PatientDetails() {
  const { id } = useParams()
  const patientId = Number(id)

  const [patient, setPatient] = useState<Patient | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [openConversation, setOpenConversation] = useState<number | null>(null)
  const [formState, setFormState] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    editing?: Insight
  }>({ open: false, mode: 'create' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const loadData = useCallback(async () => {
    if (!patientId || Number.isNaN(patientId)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setLoading(true)
    setNotFound(false)

    try {
      const [patientRes, convRes, insightsRes] = await Promise.all([
        api(`/psychologist/patients/${patientId}`),
        api(`/psychologist/patients/${patientId}/conversations`),
        api(`/insights?id_usuario=${patientId}`),
      ])

      const patientPayload = await patientRes.json().catch(() => null)
      const convPayload = await convRes.json().catch(() => null)
      const insightsPayload = await insightsRes.json().catch(() => null)

      if (!patientRes.ok || !patientPayload?.success) {
        setNotFound(true)
        setPatient(null)
        return
      }

      setPatient(patientPayload.data)
      setConversations(
        convRes.ok && convPayload?.success ? (convPayload.data ?? []) : [],
      )
      setInsights(
        insightsRes.ok && insightsPayload?.success
          ? (insightsPayload.data ?? [])
          : [],
      )
    } catch {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados do paciente.',
      })
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleCreateInsight(data: {
    conteudo: string
    seriedade: Insight['seriedade']
  }) {
    if (!patient) return
    const res = await api('/insights', {
      method: 'POST',
      body: JSON.stringify({
        id_usuario: patient.id_usuario,
        conteudo: data.conteudo,
        seriedade: data.seriedade,
      }),
    })
    const payload = await res.json().catch(() => null)
    if (!res.ok || !payload?.success) {
      setSnackbar({
        open: true,
        message: payload?.message || 'Erro ao criar insight.',
      })
      return
    }
    setInsights((prev) => [payload.data, ...prev])
    setFormState({ open: false, mode: 'create' })
  }

  async function handleUpdateInsight(data: {
    conteudo: string
    seriedade: Insight['seriedade']
  }) {
    const editing = formState.editing
    if (!editing) return
    const res = await api(`/insights/${editing.id_insight}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    const payload = await res.json().catch(() => null)
    if (!res.ok || !payload?.success) {
      setSnackbar({
        open: true,
        message: payload?.message || 'Erro ao atualizar insight.',
      })
      return
    }
    setInsights((prev) =>
      prev.map((i) =>
        i.id_insight === editing.id_insight ? payload.data : i,
      ),
    )
    setFormState({ open: false, mode: 'create' })
  }

  async function handleDeleteInsight(insight: Insight) {
    const res = await api(`/insights/${insight.id_insight}`, {
      method: 'DELETE',
    })
    const payload = await res.json().catch(() => null)
    if (!res.ok || !payload?.success) {
      setSnackbar({
        open: true,
        message: payload?.message || 'Erro ao excluir insight.',
      })
      return
    }
    setInsights((prev) =>
      prev.filter((i) => i.id_insight !== insight.id_insight),
    )
  }

  if (loading) {
    return (
      <PsychologistLayout>
        <p className="text-sm text-gray-500">Carregando...</p>
      </PsychologistLayout>
    )
  }

  if (notFound || !patient) {
    return (
      <PsychologistLayout>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Paciente nao encontrado.</p>
          <Link
            to="/psychologist/pacientes"
            className="inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-emerald-700 hover:text-emerald-800"
          >
            Voltar
          </Link>
        </div>
      </PsychologistLayout>
    )
  }

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header>
          <Link
            to="/psychologist/pacientes"
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:border-emerald-700 hover:text-emerald-800"
          >
            Voltar
          </Link>
          <div className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              {patient.nome}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{patient.email}</p>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-950">Conversas</h2>
            <div className="mt-4 space-y-3">
              {conversations.length === 0 && (
                <p className="text-sm text-gray-500">
                  Sem conversas registradas para este paciente.
                </p>
              )}
              {conversations.map((conv) => (
                <button
                  key={conv.id_conversa}
                  type="button"
                  onClick={() => setOpenConversation(conv.id_conversa)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-slate-50 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {formatDateTime(conv.data_inicio)}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                    {conv.status}
                  </span>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-950">Insights</h2>
              <button
                type="button"
                onClick={() =>
                  setFormState({ open: true, mode: 'create' })
                }
                className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
              >
                Novo insight
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {insights.length === 0 && (
                <p className="text-sm text-gray-500">Sem insights ainda.</p>
              )}
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id_insight}
                  insight={insight}
                  onEdit={(i) =>
                    setFormState({
                      open: true,
                      mode: 'edit',
                      editing: i,
                    })
                  }
                  onDelete={handleDeleteInsight}
                />
              ))}
            </div>
          </article>
        </section>
      </div>

      <ConversationTranscriptModal
        open={openConversation !== null}
        id_conversa={openConversation}
        onClose={() => setOpenConversation(null)}
        onInsightsGenerated={(rows) =>
          setInsights((prev) => [...rows, ...prev])
        }
      />

      <InsightFormModal
        open={formState.open}
        mode={formState.mode}
        initial={
          formState.mode === 'edit' ? formState.editing : undefined
        }
        onClose={() => setFormState({ open: false, mode: 'create' })}
        onSubmit={
          formState.mode === 'create'
            ? handleCreateInsight
            : handleUpdateInsight
        }
      />

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant="error"
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </PsychologistLayout>
  )
}
