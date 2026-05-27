import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import api from "../hooks/useApi";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import DashboardLayout from "../layouts/DashboardLayout";

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
    description: <>Responder question&aacute;rio de bem estar</>,
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
    description: <>Ver recomenda&ccedil;&otilde;es personalizadas</>,
    href: "/patient/insights",
    marker: "03",
  },
];

const metricDefinitions = [
  { id: "estresse", label: "Estresse" },
  { id: "ansiedade", label: "Ansiedade" },
  { id: "burnout", label: "Burnout" },
  { id: "depressao", label: <>Depress&atilde;o</> },
];

export default function Home() {
  const [history, setHistory] = useState<DashboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar resultados");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const latestEntry = history[0];
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
    <DashboardLayout>
      <div className="space-y-8">
        <HomeHeader currentDate={formatCurrentDate()} streakDays={streakDays} />
        <ActionCardsGrid cards={actionCards} />

        <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <WellbeingStatusCard metrics={metrics} summaryLabel={summaryLabel} />
          <LatestInsightCard isLoading={isLoading} error={error} />
        </section>
      </div>
    </DashboardLayout>
  );
}

type HomeHeaderProps = {
  currentDate: string;
  streakDays: number;
};

function HomeHeader({ currentDate, streakDays }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Ol&aacute; Ana
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500">{currentDate}</p>
      </div>

      <StreakCard streakDays={streakDays} />
    </header>
  );
}

type StreakCardProps = {
  streakDays: number;
};

function StreakCard({ streakDays }: StreakCardProps) {
  const isActive = streakDays > 0;
  return (
    <DashboardCard className="flex w-full items-center gap-3 border-emerald-100 px-4 py-3 sm:w-auto">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <StreakIcon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-950">
          {isActive
            ? `${streakDays} dias consecutivos`
            : "Nenhum check-in recente"}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          {isActive
            ? "Sequência ativa"
            : "Responda um questionário para começar"}
        </p>
      </div>
    </DashboardCard>
  );
}

type ActionCardsGridProps = {
  cards: ActionCardData[];
};

function ActionCardsGrid({ cards }: ActionCardsGridProps) {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <ActionCard key={card.id} card={card} />
      ))}
    </section>
  );
}

type ActionCardProps = {
  card: ActionCardData;
};

function ActionCard({ card }: ActionCardProps) {
  return (
    <Link
      to={card.href}
      className="group rounded-2xl bg-[#2F8F7B] p-6 text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
        {card.marker}
      </div>
      <h2 className="mt-8 text-xl font-semibold">{card.title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/80">{card.description}</p>
      <span className="mt-6 inline-flex text-sm font-medium text-white/90 transition-transform duration-200 group-hover:translate-x-1">
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
      <SectionTitle>Status de Bem-estar</SectionTitle>
      <p className="mt-2 text-sm text-gray-500">
        Classificação atual: {summaryLabel}
      </p>

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
  isLoading: boolean;
  error: string | null;
};

function LatestInsightCard({ isLoading, error }: LatestInsightCardProps) {
  if (isLoading) {
    return (
      <DashboardCard>
        <SectionTitle>&Uacute;ltimo Insight</SectionTitle>
        <div className="mt-4 text-sm text-gray-500">Carregando dados...</div>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard>
        <SectionTitle>&Uacute;ltimo Insight</SectionTitle>
        <p className="mt-4 text-sm leading-6 text-red-600">{error}</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <SectionTitle>&Uacute;ltimo Insight</SectionTitle>
      <p className="mt-4 text-sm leading-6 text-gray-500">
        Seus registros recentes indicam que pequenas pausas durante o dia podem
        ajudar a reduzir picos de estresse e melhorar sua clareza mental no fim
        da tarde.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <InsightTag>Respira&ccedil;&atilde;o</InsightTag>
        <InsightTag>Pausas ativas</InsightTag>
      </div>

      <Link
        to="/patient/insights"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
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
    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
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
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v18m0-18c-4.5 2.7-6.8 6.1-6.8 10.2A6.8 6.8 0 0 0 12 20m0-17c4.5 2.7 6.8 6.1 6.8 10.2A6.8 6.8 0 0 1 12 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 12.4 11 14.6l4.3-5"
        stroke="currentColor"
        strokeWidth="1.8"
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
      (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
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
