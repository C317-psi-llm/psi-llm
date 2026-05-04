import { useCallback, useEffect, useRef, useState } from 'react'

import ChatInput from '../components/ChatInput'
import MessageBubble from '../components/MessageBubble'
import Snackbar from '../components/Snackbar'
import { api } from '../hooks/useApi'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useStream } from '../hooks/useStream'
import DashboardLayout from '../layouts/DashboardLayout'

type ChatMessage = {
  id: string
  sender: 'assistant' | 'user'
  text: string
}

type ConversationSummary = {
  id_conversa: number
  data_inicio: string
}

type ServerMessage = {
  id_mensagem: number
  conteudo: string
  remetente: 'usuario' | 'assistente'
}

type StoredUser = {
  id_usuario: number
}

function toClientMessage(msg: ServerMessage): ChatMessage {
  return {
    id: `srv-${msg.id_mensagem}`,
    sender: msg.remetente === 'assistente' ? 'assistant' : 'user',
    text: msg.conteudo,
  }
}

function formatDataInicio(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function Chat() {
  const [user] = useLocalStorage<StoredUser>('user', null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pendingMessage, setPendingMessage] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const streamingIdRef = useRef<string | null>(null)

  const { isStreaming, send: sendStream } = useStream()

  const showError = useCallback((message: string) => {
    setSnackbar({ open: true, message })
  }, [])

  const loadConversation = useCallback(
    async (id: number) => {
      setIsLoadingConversation(true)
      try {
        const response = await api(`/conversations/${id}`)
        const payload = await response.json().catch(() => null)
        if (!response.ok || !payload?.success) {
          showError(payload?.message || 'Erro ao carregar conversa.')
          return
        }
        const serverMessages: ServerMessage[] = payload.data.messages || []
        setMessages(serverMessages.map(toClientMessage))
      } catch (err) {
        showError(
          err instanceof Error ? err.message : 'Erro ao carregar conversa.',
        )
      } finally {
        setIsLoadingConversation(false)
      }
    },
    [showError],
  )

  const loadConversations = useCallback(
    async (autoSelect: boolean) => {
      if (!user?.id_usuario) return
      try {
        const response = await api(
          `/conversations/user/${user.id_usuario}?page=1`,
        )
        const payload = await response.json().catch(() => null)
        if (!response.ok || !payload?.success) {
          showError(payload?.message || 'Erro ao carregar conversas.')
          return
        }
        const items: ConversationSummary[] = payload.data.items || []
        setConversations(items)
        if (autoSelect && items.length > 0) {
          const latest = items[0]
          setSelectedId(latest.id_conversa)
          loadConversation(latest.id_conversa)
        } else if (autoSelect && items.length === 0) {
          setSelectedId(null)
          setMessages([])
        }
      } catch (err) {
        showError(
          err instanceof Error ? err.message : 'Erro ao carregar conversas.',
        )
      }
    },
    [loadConversation, showError, user?.id_usuario],
  )

  useEffect(() => {
    loadConversations(true)
  }, [loadConversations])

  useEffect(() => {
    inputRef.current?.focus()
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isStreaming])

  function handleSelectConversation(id: number) {
    if (id === selectedId) return
    setSelectedId(id)
    loadConversation(id)
  }

  async function handleCreateConversation() {
    try {
      const response = await api('/conversations', { method: 'POST' })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) {
        showError(payload?.message || 'Erro ao criar conversa.')
        return
      }
      const created = payload.data
      setSelectedId(created.id_conversa)
      setMessages([])
      await loadConversations(false)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao criar conversa.')
    }
  }

  function handleSendMessage() {
    const text = pendingMessage.trim()
    if (!text || isStreaming || selectedId === null) return

    const userMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: 'user',
      text,
    }
    const assistantId = `stream-${Date.now() + 1}`
    streamingIdRef.current = assistantId
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      sender: 'assistant',
      text: '',
    }

    setMessages((current) => [...current, userMessage, assistantPlaceholder])
    setPendingMessage('')

    sendStream(
      `/conversations/${selectedId}/messages`,
      { content: text },
      {
        onDelta: (_delta, accumulated) => {
          setMessages((current) =>
            current.map((msg) =>
              msg.id === assistantId ? { ...msg, text: accumulated } : msg,
            ),
          )
        },
        onDone: (accumulated) => {
          setMessages((current) =>
            current.map((msg) =>
              msg.id === assistantId ? { ...msg, text: accumulated } : msg,
            ),
          )
          streamingIdRef.current = null
        },
        onError: (message) => {
          showError(message)
          setMessages((current) =>
            current.filter((msg) => msg.id !== assistantId),
          )
          streamingIdRef.current = null
        },
      },
    )
  }

  const hasConversations = conversations.length > 0
  const hasSelected = selectedId !== null

  return (
    <DashboardLayout contentClassName="flex h-screen flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Chat de apoio
            </h1>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              Este assistente n&atilde;o substitui ajuda profissional. Em caso
              de emerg&ecirc;ncia ou risco imediato, procure atendimento
              especializado.
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateConversation}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Nova conversa
          </button>
        </header>

        <div className="flex min-h-0 flex-1 gap-4">
          <aside className="flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-950">
                Hist&oacute;rico
              </h2>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {hasConversations ? (
                conversations.map((conversation) => {
                  const isActive = conversation.id_conversa === selectedId
                  return (
                    <button
                      key={conversation.id_conversa}
                      type="button"
                      onClick={() =>
                        handleSelectConversation(conversation.id_conversa)
                      }
                      className={`w-full rounded-lg border border-gray-200 px-3 py-2.5 text-left transition-colors duration-150 hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                        isActive ? 'bg-sky-100' : 'bg-white'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-950">
                        Conversa #{conversation.id_conversa}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Data de in&iacute;cio:{' '}
                        {formatDataInicio(conversation.data_inicio)}
                      </p>
                    </button>
                  )
                })
              ) : (
                <p className="px-2 py-4 text-sm text-gray-500">
                  Nenhuma conversa ainda. Clique em &quot;Nova conversa&quot;
                  para come&ccedil;ar.
                </p>
              )}
            </div>
          </aside>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {hasSelected ? (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto scroll-smooth p-4 sm:space-y-6 sm:p-6">
                  {isLoadingConversation && messages.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Carregando conversa...
                    </p>
                  ) : (
                    messages
                      .filter((item) => item.text.length > 0)
                      .map((item) => (
                        <MessageBubble key={item.id} sender={item.sender}>
                          {item.text}
                        </MessageBubble>
                      ))
                  )}
                  {isStreaming &&
                    streamingIdRef.current &&
                    !messages.some(
                      (m) =>
                        m.id === streamingIdRef.current && m.text.length > 0,
                    ) && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                <ChatInput
                  disabled={isStreaming}
                  inputRef={inputRef}
                  value={pendingMessage}
                  onChange={setPendingMessage}
                  onSubmit={handleSendMessage}
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-gray-500">
                Crie uma nova conversa para come&ccedil;ar a conversar com o
                assistente.
              </div>
            )}
          </section>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        variant="error"
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
    </DashboardLayout>
  )
}

function TypingIndicator() {
  return (
    <div className="flex animate-[fadeIn_180ms_ease-out] justify-start px-1">
      <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500 shadow-sm sm:px-5">
        digitando...
      </div>
    </div>
  )
}
