import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AnswerButton from '../components/AnswerButton'
import DashboardCard from '../components/DashboardCard'
import ProgressBar from '../components/ProgressBar'
import DashboardLayout from '../layouts/DashboardLayout'

const questions = [
  'Como voc\u00ea avaliaria seu n\u00edvel de estresse hoje?',
  'Como est\u00e1 sua qualidade de sono?',
  'Voc\u00ea se sentiu ansioso hoje?',
  'Seu n\u00edvel de energia est\u00e1 como?',
  'Voc\u00ea conseguiu se concentrar bem?',
]

const answerOptions = [
  'Muito alto',
  'Alto',
  'Moderado',
  'Baixo',
  'Muito baixo',
]

const storageKey = 'mentis-questionario'

export default function Questionario() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    getInitialQuestionIndex,
  )
  const [answers, setAnswers] = useState<string[]>(getInitialAnswers)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigate = useNavigate()

  const isFinished = currentQuestionIndex >= questions.length
  const progressValue = isFinished
    ? 100
    : ((currentQuestionIndex + 1) / questions.length) * 100
  const progressLabel = isFinished
    ? `${questions.length} de ${questions.length}`
    : `${currentQuestionIndex + 1} de ${questions.length}`
  const canGoBack = currentQuestionIndex > 0

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        currentQuestionIndex,
      }),
    )
  }, [answers, currentQuestionIndex])

  function handleAnswerSelect(answer: string) {
    if (isTransitioning) {
      return
    }

    setIsTransitioning(true)

    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers]
      nextAnswers[currentQuestionIndex] = answer
      return nextAnswers
    })

    window.setTimeout(() => {
      setCurrentQuestionIndex((index) => index + 1)
      setIsTransitioning(false)
    }, 420)
  }

  function handleGoBack() {
    if (!canGoBack || isTransitioning) {
      return
    }

    setIsTransitioning(false)
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0))
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Check-in de Bem-estar
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Leva menos de 2 minutos
          </p>
        </header>

        <DashboardCard className="p-6 sm:p-8">
          <ProgressBar
            colorClassName="bg-[#2F8F7B]"
            label={progressLabel}
            level={`${Math.round(progressValue)}%`}
            value={progressValue}
          />

          {!isFinished && (
            <div className="mt-4 flex justify-start">
              <button
                type="button"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!canGoBack || isTransitioning}
                onClick={handleGoBack}
              >
                Voltar
              </button>
            </div>
          )}

          {isFinished ? (
            <CompletionState
              onGoBack={handleGoBack}
              onViewResults={() => navigate('/dashboard')}
            />
          ) : (
            <QuestionStep
              key={currentQuestionIndex}
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              isTransitioning={isTransitioning}
              onSelectAnswer={handleAnswerSelect}
            />
          )}
        </DashboardCard>
      </div>
    </DashboardLayout>
  )
}

type QuestionStepProps = {
  answers: string[]
  currentQuestionIndex: number
  isTransitioning: boolean
  onSelectAnswer: (answer: string) => void
}

function QuestionStep({
  answers,
  currentQuestionIndex,
  isTransitioning,
  onSelectAnswer,
}: QuestionStepProps) {
  const selectedAnswer = answers[currentQuestionIndex]

  return (
    <div
      className={`mt-10 transition duration-300 ${
        isTransitioning
          ? 'translate-y-2 opacity-40'
          : 'translate-y-0 animate-[fadeIn_220ms_ease-out] opacity-100'
      }`}
    >
      <h2 className="mx-auto max-w-2xl text-center text-2xl font-semibold leading-tight text-gray-950">
        {questions[currentQuestionIndex]}
      </h2>

      <div className="mt-8 grid gap-3">
        {answerOptions.map((option) => (
          <AnswerButton
            key={option}
            disabled={isTransitioning}
            isSelected={selectedAnswer === option}
            onClick={() => onSelectAnswer(option)}
          >
            {option}
          </AnswerButton>
        ))}
      </div>

      <div className="mt-6 min-h-6 text-center">
        {isTransitioning && (
          <p className="animate-[fadeIn_180ms_ease-out] text-sm font-medium text-blue-600">
            Resposta registrada. Avan&ccedil;ando...
          </p>
        )}
      </div>
    </div>
  )
}

type CompletionStateProps = {
  onGoBack: () => void
  onViewResults: () => void
}

function CompletionState({ onGoBack, onViewResults }: CompletionStateProps) {
  return (
    <div className="mt-12 animate-[fadeIn_220ms_ease-out] text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl font-semibold text-emerald-700">
        &#10003;
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-gray-950">
        Obrigado por responder!
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Suas respostas foram registradas e j&aacute; podem apoiar seus
        indicadores.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onGoBack}
        >
          Voltar
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onViewResults}
        >
          Ver resultados
        </button>
      </div>
    </div>
  )
}

function getStoredQuestionario() {
  const storedValue = localStorage.getItem(storageKey)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue) as {
      answers?: string[]
      currentQuestionIndex?: number
    }
  } catch {
    return null
  }
}

function getInitialAnswers() {
  const storedQuestionario = getStoredQuestionario()

  return Array.isArray(storedQuestionario?.answers)
    ? storedQuestionario.answers
    : []
}

function getInitialQuestionIndex() {
  const storedQuestionario = getStoredQuestionario()
  const storedIndex = storedQuestionario?.currentQuestionIndex

  if (typeof storedIndex !== 'number') {
    return 0
  }

  return Math.min(Math.max(storedIndex, 0), questions.length)
}
