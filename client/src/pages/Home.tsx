import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../auth/auth";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../hooks/useApi";
import {
  usePatientInsights,
  type PatientInsight,
} from "../hooks/useApi/useInsights";

type ActionCardData = {
  description: ReactNode;
  href: string;
  id: string;
  marker: string;
  title: string;
};

type WellbeingMetric = {
  colorClassName: string;
  id: string;
  label: ReactNode;
  level: ReactNode;
  value: number;
};

type DashboardEntry = {
  id_resposta_questionario: number;
  data_resposta: string;
  nivel_estresse: number;
  nivel_ansiedade: number;
  nivel_burnout: number;
  nivel_depressao: number;
  pontuacao_total?: number;
  classificacao_geral?: string;
};

const actionCards: ActionCardData[] = [
  {
    id: "check-in",
    title: "Fazer Check-in",
    description: <>Responder questionário de bem estar</>,
    href: "/patient/questionario",
    marker: "01",
  },
  {
    id: "support-chat",
    title: "Chat de apoio",
    description: "Converse com o assistente IA",
    href: "/patient/chat",
    marker: "02",
  },
  {
    id: "insights",
    title: "Insights",
    description: <>Ver recomendações personalizadas</>,
    href: "/patient/insights",
    marker: "03",
  },
];

const metricDefinitions = [
  { id: "estresse", label: "Estresse" },
  { id: "ansiedade", label: "Ansiedade" },
  { id: "burnout", label: "Burnout" },
  { id: "depressao", label: <>Depressão</> },
];

export default function Home() {
  const [history, setHistory] = useState<DashboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: insights,
    loading: isLoadingInsights,
    error: insightsError,
  } = usePatientInsights();

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api("/questionnaires/responses/history?days=30");

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || "Erro ao carregar resultados");
        }

        const json = await res.json();
        setHistory(json?.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar resultados",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const storedUser = getStoredUser();
  const patientName = getFirstName(storedUser?.nome);

  const latestEntry = history[0];
  const latestInsight = insights[0] ?? null;
  const streakDays = useMemo(() => computeStreak(history), [history]);

  const summaryLabel = latestEntry?.classificacao_geral ?? "Nenhum check-in";

  const metrics = useMemo(() => {
    const hasEntry = Boolean(latestEntry);

    return metricDefinitions.map((metric) => {
      let value = 0;

      if (latestEntry) {
        switch (metric.id) {
          case "estresse":
            value = latestEntry.nivel_estresse;
            break;
          case "ansiedade":
            value = latestEntry.nivel_ansiedade;
            break;
          case "burnout":
            value = latestEntry.nivel_burnout;
            break;
          case "depressao":
            value = latestEntry.nivel_depressao;
            break;
        }
      }

      return {
        id: metric.id,
        label: metric.label,
        value,
        level: hasEntry ? getMetricLevel(value) : "Sem dados",
        colorClassName: getMetricColor(value),
      };
    });
  }, [latestEntry]);

  return (
    <DashboardLayout title="Home">
      <div className="space-y-8">
        <HomeHeader
          currentDate={formatCurrentDate()}
          streakDays={streakDays}
          userName={patientName}
        />

        {isLoading && (
          <DashboardCard>
            <p className="text-sm text-gray-500">
              Carregando dados do painel...
            </p>
          </DashboardCard>
        )}

        {error && (
          <DashboardCard>
            <p className="text-sm text-rose-700">{error}</p>
          </DashboardCard>
        )}

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <WellbeingStatusCard metrics={metrics} summaryLabel={summaryLabel} />
          <LatestInsightCard
            error={insightsError}
            insight={latestInsight}
            isLoading={isLoadingInsights}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <StreakCard streakDays={streakDays} />

          <DashboardCard>
            <SectionTitle>Ações rápidas</SectionTitle>
            <ActionCardsGrid cards={actionCards} />
          </DashboardCard>
        </section>
      </div>
    </DashboardLayout>
  );
}

type HomeHeaderProps = {
  currentDate: string;
  streakDays: number;
  userName: string;
};

function HomeHeader({ currentDate, streakDays, userName }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-5 rounded-3xl bg-linear-to-br from-[#2F8F7B] to-[#54b69f] p-7 text-white shadow-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
          Painel do paciente
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Olá, {userName}
        </h1>
        <p className="mt-3 text-sm text-white/80">{currentDate}</p>
      </div>

      <div className="rounded-2xl bg-white/15 px-5 py-4 ring-1 ring-white/20">
        <p className="text-sm text-white/75">Sequência atual</p>
        <p className="mt-1 text-2xl font-semibold">
          {streakDays > 0 ? `${streakDays} dias` : "Sem sequência"}
        </p>
      </div>
    </header>
  );
}

type StreakCardProps = {
  streakDays: number;
};

function StreakCard({ streakDays }: StreakCardProps) {
  const isActive = streakDays > 0;

  return (
    <DashboardCard>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <StreakIcon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            {isActive
              ? `${streakDays} dias consecutivos`
              : "Nenhum check-in recente"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isActive
              ? "Sequência ativa"
              : "Responda um questionário para começar"}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

type ActionCardsGridProps = {
  cards: ActionCardData[];
};

function ActionCardsGrid({ cards }: ActionCardsGridProps) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <ActionCard key={card.id} card={card} />
      ))}
    </div>
  );
}

type ActionCardProps = {
  card: ActionCardData;
};

function ActionCard({ card }: ActionCardProps) {
  return (
    <Link
      to={card.href}
      className="group rounded-2xl border border-gray-100 bg-slate-50 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:bg-white hover:shadow-sm"
    >
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
        {card.marker}
      </span>
      <h3 className="mt-4 text-base font-semibold text-gray-950">
        {card.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        {card.description}
      </p>
      <span className="mt-5 inline-flex text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800">
        Acessar
      </span>
    </Link>
  );
}

type WellbeingStatusCardProps = {
  metrics: WellbeingMetric[];
  summaryLabel: string;
};

function WellbeingStatusCard({
  metrics,
  summaryLabel,
}: WellbeingStatusCardProps) {
  return (
    <DashboardCard>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            Status de Bem-estar
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Classificação atual: {summaryLabel}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {metrics.map((metric) => (
          <ProgressBar
            key={metric.id}
            colorClassName={metric.colorClassName}
            label={metric.label}
            level={metric.level}
            value={metric.value}
          />
        ))}
      </div>
    </DashboardCard>
  );
}

type LatestInsightCardProps = {
  error: string | null;
  insight: PatientInsight | null;
  isLoading: boolean;
};

function LatestInsightCard({
  error,
  insight,
  isLoading,
}: LatestInsightCardProps) {
  if (isLoading) {
    return (
      <DashboardCard>
        <h2 className="text-lg font-semibold text-gray-950">Último Insight</h2>
        <p className="mt-4 text-sm leading-6 text-gray-500">
          Carregando insight mais recente...
        </p>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard>
        <h2 className="text-lg font-semibold text-gray-950">Último Insight</h2>
        <p className="mt-4 text-sm leading-6 text-rose-700">{error}</p>
      </DashboardCard>
    );
  }

  if (!insight) {
    return (
      <DashboardCard>
        <h2 className="text-lg font-semibold text-gray-950">Último Insight</h2>
        <p className="mt-4 text-sm leading-6 text-gray-500">
          Nenhum insight disponível no momento. Quando houver novos registros de
          acompanhamento, eles aparecerão aqui.
        </p>
        <Link
          to="/patient/insights"
          className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Ver página de insights
        </Link>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            Último Insight
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {formatInsightDate(insight.criado_em)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <InsightTag>{formatInsightSeverity(insight.seriedade)}</InsightTag>
          <InsightTag>{formatInsightOrigin(insight.origem)}</InsightTag>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-gray-600">
        {insight.conteudo}
      </p>

      <Link
        to="/patient/insights"
        className="mt-6 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
      >
        Ver todos os insights
      </Link>
    </DashboardCard>
  );
}

type SectionTitleProps = {
  children: ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="text-lg font-semibold text-gray-950">{children}</h2>;
}

type InsightTagProps = {
  children: ReactNode;
};

function InsightTag({ children }: InsightTagProps) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      {children}
    </span>
  );
}

type IconProps = {
  className?: string;
};

function StreakIcon({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 3.5c2.1 2.6 3.2 4.7 3.2 6.5 0 .8-.2 1.5-.5 2.1 1.6-.6 2.8-1.7 3.6-3.2 1 1.6 1.5 3.2 1.5 4.8 0 4-3.3 6.8-7.8 6.8S4.2 17.7 4.2 13.7c0-2.3 1.1-4.4 3.2-6.3.2 1.9.9 3.3 2.1 4.2-.3-2.9.5-5.6 2.5-8.1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCurrentDate() {
  const date = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return date.charAt(0).toUpperCase() + date.slice(1);
}

function getMetricColor(value: number) {
  if (value >= 75) return "bg-rose-500";
  if (value >= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

function getMetricLevel(value: number) {
  if (value >= 75) return "Alto";
  if (value >= 40) return "Médio";
  if (value > 0) return "Baixo";
  return "Sem dados";
}

function computeStreak(history: DashboardEntry[]) {
  if (history.length === 0) return 0;

  let streak = 0;
  let previousDate: Date | null = null;

  for (const entry of history) {
    const currentDate = new Date(entry.data_resposta);
    currentDate.setHours(0, 0, 0, 0);

    if (!previousDate) {
      streak = 1;
      previousDate = currentDate;
      continue;
    }

    const diff = Math.round(
      (previousDate.getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diff === 0) {
      continue;
    }

    if (diff === 1) {
      streak += 1;
      previousDate = currentDate;
      continue;
    }

    break;
  }

  return streak;
}

function getFirstName(name?: string) {
  if (!name?.trim()) return "paciente";

  return name.trim().split(/\s+/)[0];
}

function formatInsightOrigin(origin: PatientInsight["origem"]) {
  return origin === "ia" ? "IA" : "Manual";
}

function formatInsightSeverity(severity: PatientInsight["seriedade"]) {
  const labels: Record<PatientInsight["seriedade"], string> = {
    alerta: "Atenção",
    bom: "Melhora",
    padrao: "Estável",
  };

  return labels[severity] ?? "Insight";
}

function formatInsightDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}