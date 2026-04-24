import { type FormEvent, type RefObject } from 'react'

type ChatInputProps = {
  disabled?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onSubmit: () => void
  value: string
}

export default function ChatInput({
  disabled = false,
  inputRef,
  onChange,
  onSubmit,
  value,
}: ChatInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      className="sticky bottom-0 flex flex-col gap-3 border-t border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Digite sua mensagem"
        className="min-h-11 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        disabled={disabled}
      />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled || !value.trim()}
      >
        Enviar
      </button>
    </form>
  )
}
