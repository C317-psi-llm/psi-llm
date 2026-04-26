import { useState, type FormEvent } from 'react'

import DashboardCard from '../../components/DashboardCard'
import PsychologistLayout from './PsychologistLayout'

type Message = {
  author: 'assistant' | 'psychologist'
  id: string
  text: string
}

const initialMessages: Message[] = [
  {
    id: 'assistant-welcome',
    author: 'assistant',
    text: 'Posso ajudar a resumir prontuarios, preparar perguntas para sessao ou organizar hipoteses clinicas.',
  },
]

const quickPrompts = [
  'Resumir sinais de risco da Ana Silva',
  'Gerar perguntas para proxima sessao',
  'Comparar adesao dos pacientes da semana',
]

export default function PsychologistAssistente() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')

  function submitMessage(text: string) {
    const trimmedText = text.trim()

    if (!trimmedText) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `psychologist-${Date.now()}`,
        author: 'psychologist',
        text: trimmedText,
      },
      {
        id: `assistant-${Date.now()}`,
        author: 'assistant',
        text: 'Analise inicial pronta: revise contexto recente, nivel de risco, adesao aos check-ins e combinados da ultima sessao antes de decidir a intervencao.',
      },
    ])
    setInputValue('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitMessage(inputValue)
  }

  return (
    <PsychologistLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Assistente IA
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Apoio para preparar sess&otilde;es e revisar sinais cl&iacute;nicos.
          </p>
        </header>

        <section className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
          <DashboardCard>
            <h2 className="text-lg font-semibold text-gray-950">
              Atalhos cl&iacute;nicos
            </h2>
            <div className="mt-5 space-y-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitMessage(prompt)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-blue-500 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="flex min-h-[560px] flex-col p-0">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-950">
                Conversa
              </h2>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.author === 'psychologist'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <p
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.author === 'psychologist'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row"
            >
              <label className="flex-1">
                <span className="sr-only">Mensagem para o assistente</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Digite uma pergunta clinica"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Enviar
              </button>
            </form>
          </DashboardCard>
        </section>
      </div>
    </PsychologistLayout>
  )
}
