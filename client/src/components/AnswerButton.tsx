import type { ReactNode } from 'react'

type AnswerButtonProps = {
  children: ReactNode
  disabled?: boolean
  isSelected?: boolean
  onClick: () => void
}

export default function AnswerButton({
  children,
  disabled = false,
  isSelected = false,
  onClick,
}: AnswerButtonProps) {
  return (
    <button
      type="button"
      className={`w-full rounded-full border px-5 py-4 text-center text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        isSelected
          ? 'scale-[1.02] border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100 ring-4 ring-blue-100 hover:bg-blue-600 hover:text-white'
          : 'border-gray-200 bg-white text-gray-700 shadow-sm'
      } disabled:cursor-not-allowed disabled:hover:translate-y-0`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
