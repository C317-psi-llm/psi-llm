import { useEffect, useRef, useState } from 'react'

import ChatInput from '../../../components/ChatInput'
import DashboardCard from '../../../components/DashboardCard'
import MessageBubble from '../../../components/MessageBubble'
import PsychologistLayout from '../../../pages/psychologist/PsychologistLayout'

type ChatMessage = {
  id: number
  sender: 'assistant' | 'user'
  text: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'user',
    text: 'Quais pacientes estao com risco elevado?',
  },
  {
    id: 2,
    sender: 'assistant',
    text: 'Amanda Costa apresenta aumento no nivel de estresse nas ultimas semanas.',
  },
  {
    id: 3,
    sender: 'user',
    text: 'Quais recomendacoes posso aplicar?',
  },
]

const quickSuggestions = [
  'Pacientes em risco',
  'Resumo geral',
  'Recomendacoes',
]

export default function AssistenteIA() {
  const [messages, setMessages] = useState(initialMessages)
  const [message, setMessage] = useState('')
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isAssistantTyping])

  function handleSendMessage(text = message) {
    const trimmedText = text.trim()

    if (!trimmedText || isAssistantTyping) {
      return
    }

    const psychologistMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedText,
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      psychologistMessage,
    ])
    setMessage('')
    setIsAssistantTyping(true)

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: getAssistantResponse(trimmedText),
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ])
      setIsAssistantTyping(false)
    }, 600)
  }

  return (
    <PsychologistLayout>
      <div className="flex h-[calc(100vh-4rem)] min-h-[720px] flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Assistente IA
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Ferramenta de apoio para an&aacute;lise e acompanhamento de
            pacientes
          </p>
        </header>

        <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[280px_1fr]">
          <QuickSuggestions onSelect={handleSendMessage} />

          <DashboardCard className="flex min-h-0 flex-col overflow-hidden p-0">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-950">
                Conversa cl&iacute;nica
              </h2>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto scroll-smooth p-4 sm:space-y-6 sm:p-6">
              {messages.map((item) => (
                <MessageBubble key={item.id} sender={item.sender}>
                  {item.text}
                </MessageBubble>
              ))}
              {isAssistantTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              disabled={isAssistantTyping}
              inputRef={inputRef}
              value={message}
              onChange={setMessage}
              onSubmit={() => handleSendMessage()}
            />
          </DashboardCard>
        </section>
      </div>
    </PsychologistLayout>
  )
}

function QuickSuggestions({
  onSelect,
}: {
  onSelect: (suggestion: string) => void
}) {
  return (
    <DashboardCard className="h-fit p-5">
      <h2 className="text-lg font-semibold text-gray-950">
        Sugest&otilde;es r&aacute;pidas
      </h2>
      <div className="mt-5 flex gap-3 overflow-x-auto xl:flex-col xl:overflow-visible">
        {quickSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="min-w-max rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-emerald-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 xl:min-w-0"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </DashboardCard>
  )
}

function TypingIndicator() {
  return (
    <div className="flex animate-[fadeIn_180ms_ease-out] justify-start px-1">
      <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-500 shadow-sm sm:px-5">
        analisando...
      </div>
    </div>
  )
}

function getAssistantResponse(prompt: string) {
  const normalizedPrompt = normalizeText(prompt)

  if (normalizedPrompt.includes('risco')) {
    return 'Pacientes com maior prioridade: Amanda Costa, Carla Souza e Lucas Pereira. Recomendo revisar os check-ins recentes antes da proxima sessao.'
  }

  if (normalizedPrompt.includes('resumo')) {
    return 'Resumo geral: 12 pacientes ativos, 3 em risco alto, media de estresse em 6.2 e ansiedade em 5.8 na ultima semana.'
  }

  if (normalizedPrompt.includes('recomend')) {
    return 'Recomendacoes: priorizar pacientes com risco alto, reforcar estrategias de regulacao emocional e acompanhar adesao aos check-ins.'
  }

  return 'Analise registrada. Posso cruzar esse pedido com risco, historico recente ou indicadores agregados dos pacientes.'
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
