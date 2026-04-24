import { useEffect, useRef, useState } from 'react'

import ChatInput from '../components/ChatInput'
import MessageBubble from '../components/MessageBubble'
import DashboardLayout from '../layouts/DashboardLayout'

type ChatMessage = {
  id: number
  sender: 'assistant' | 'user'
  text: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'assistant',
    text: 'Oi, Ana. Estou aqui para te ouvir. Como voce esta se sentindo agora?',
  },
]

export default function Chat() {
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

  function handleSendMessage() {
    const text = message.trim()

    if (!text || isAssistantTyping) {
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setMessage('')
    setIsAssistantTyping(true)

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Obrigado por compartilhar. Tente fazer uma pausa curta e respirar com calma por alguns ciclos. Quer me contar um pouco mais sobre o que aconteceu?',
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
      setIsAssistantTyping(false)
    }, 600)
  }

  return (
    <DashboardLayout contentClassName="flex h-screen flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Chat de apoio
          </h1>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Este assistente n&atilde;o substitui ajuda profissional. Em caso de
            emerg&ecirc;ncia ou risco imediato, procure atendimento
            especializado.
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
            onSubmit={handleSendMessage}
          />
        </section>
      </div>
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
