import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/useApi";

import AnswerButton from "../components/AnswerButton";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import DashboardLayout from "../layouts/DashboardLayout";

const storageKey = "mentis-questionario";

const defaultOptionLabels = [
  "Muito baixo",
  "Baixo",
  "Moderado",
  "Alto",
  "Muito alto",
];

export default function Questionario() {
  const [questionnaire, setQuestionnaire] = useState<any | null>(null);
  const [flattenQuestions, setFlattenQuestions] = useState<any[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    getInitialQuestionIndex,
  );
  const [answers, setAnswers] =
    useState<Record<string, number>>(getInitialAnswers);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const totalQuestions = flattenQuestions.length;
  const isFinished =
    currentQuestionIndex >= totalQuestions && totalQuestions > 0;
  const progressValue = isFinished
    ? 100
    : totalQuestions === 0
      ? 0
      : ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const progressLabel = isFinished
    ? `${totalQuestions} de ${totalQuestions}`
    : `${Math.min(currentQuestionIndex + 1, totalQuestions)} de ${totalQuestions}`;
  const canGoBack = currentQuestionIndex > 0;

  // Persist progress
  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        currentQuestionIndex,
        questionnaireId: questionnaire?.id_questionario ?? null,
      }),
    );
  }, [answers, currentQuestionIndex, questionnaire]);

  // Load questionnaires and structure
  useEffect(() => {
    (async () => {
      try {
        const listRes = await api("/questionnaires");
        const listJson = await listRes.json().catch(() => null);
        const questionnaires = listJson?.data ?? [];
        const id =
          questionnaires[0]?.id_questionario ?? questionnaires[0]?.id ?? 1;

        const res = await api(`/questionnaires/${id}`);
        if (!res.ok) {
          console.error("Failed to fetch questionnaire", await res.text());
          return;
        }
        const json = await res.json();
        const q = json?.data ?? json;
        setQuestionnaire(q);

        // normalize structure
        const structure =
          typeof q?.estrutura_json === "string"
            ? JSON.parse(q.estrutura_json)
            : q?.estrutura_json;
        const flat: any[] = [];
        for (const section of structure?.sections || []) {
          for (const ques of section.questions || []) {
            flat.push({
              ...ques,
              sectionTitle: section.title,
            });
          }
        }
        setFlattenQuestions(flat);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // When questionnaire is finished, submit to backend
  useEffect(() => {
    if (!isFinished || submitted || isSubmitting) return;
    (async () => {
      setIsSubmitting(true);
      try {
        const id = questionnaire?.id_questionario ?? questionnaire?.id ?? 1;

        const res = await api(`/questionnaires/${id}/response`, {
          method: "POST",
          body: JSON.stringify({ responses: answers }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          console.error("Failed to submit questionnaire", err);
          alert("Erro ao enviar respostas. Elas foram salvas localmente.");
        } else {
          localStorage.removeItem(storageKey);
          setSubmitted(true);
        }
      } catch (e) {
        console.error(e);
        alert("Erro ao enviar respostas. Elas foram salvas localmente.");
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [isFinished, submitted, isSubmitting, answers, questionnaire]);

  function handleAnswerSelect(value: number) {
    if (isTransitioning) return;

    setIsTransitioning(true);

    const currentQuestion = flattenQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

    window.setTimeout(() => {
      setCurrentQuestionIndex((index) => index + 1);
      setIsTransitioning(false);
    }, 420);
  }

  function handleGoBack() {
    if (!canGoBack || isTransitioning) return;
    setIsTransitioning(false);
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col justify-center space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            {questionnaire?.titulo ?? "Check-in de Bem-estar"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {questionnaire?.descricao ?? "Leva menos de 2 minutos"}
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
              onViewResults={() => navigate("/patient/dashboard")}
            />
          ) : (
            <QuestionStep
              key={currentQuestionIndex}
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              isTransitioning={isTransitioning}
              onSelectAnswer={handleAnswerSelect}
              question={flattenQuestions[currentQuestionIndex]}
            />
          )}
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}

type QuestionStepProps = {
  answers: Record<string, number>;
  currentQuestionIndex: number;
  isTransitioning: boolean;
  onSelectAnswer: (value: number) => void;
  question?: any;
};

function QuestionStep({
  answers,
  currentQuestionIndex,
  isTransitioning,
  onSelectAnswer,
  question,
}: QuestionStepProps) {
  const selectedValue = question ? answers[question.id] : undefined;

  return (
    <div
      className={`mt-10 transition duration-300 ${
        isTransitioning
          ? "translate-y-2 opacity-40"
          : "translate-y-0 animate-[fadeIn_220ms_ease-out] opacity-100"
      }`}
    >
      <h2 className="mx-auto max-w-2xl text-center text-2xl font-semibold leading-tight text-gray-950">
        {question?.text ?? "..."}
      </h2>

      <div className="mt-8 grid gap-3">
        {defaultOptionLabels.map((label, idx) => (
          <AnswerButton
            key={label}
            disabled={isTransitioning}
            isSelected={selectedValue === idx}
            onClick={() => onSelectAnswer(idx)}
          >
            {label}
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
  );
}

type CompletionStateProps = {
  onGoBack: () => void;
  onViewResults: () => void;
};

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
  );
}

function getStoredQuestionario() {
  const storedValue = localStorage.getItem(storageKey);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as {
      answers?: Record<string, number>;
      currentQuestionIndex?: number;
      questionnaireId?: number | null;
    };
  } catch {
    return null;
  }
}

function getInitialAnswers() {
  const storedQuestionario = getStoredQuestionario();

  return (
    (storedQuestionario?.answers as Record<string, number> | undefined) ?? {}
  );
}

function getInitialQuestionIndex() {
  const storedQuestionario = getStoredQuestionario();
  const storedIndex = storedQuestionario?.currentQuestionIndex;

  if (typeof storedIndex !== "number") {
    return 0;
  }

  return Math.max(storedIndex, 0);
}
