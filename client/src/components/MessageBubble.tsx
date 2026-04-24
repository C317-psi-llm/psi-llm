type MessageBubbleProps = {
  children: string
  sender: 'assistant' | 'user'
}

export default function MessageBubble({ children, sender }: MessageBubbleProps) {
  const isUser = sender === 'user'

  return (
    <div
      className={`flex animate-[fadeIn_180ms_ease-out] px-1 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[min(70%,680px)] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:px-5 ${
          isUser
            ? 'rounded-br-md bg-blue-600 text-white'
            : 'rounded-bl-md bg-gray-100 text-gray-800'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
