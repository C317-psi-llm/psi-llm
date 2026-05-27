import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import api from "../hooks/useApi";
import ActivityItem from "../components/ActivityItem";
import DashboardCard from "../components/DashboardCard";
import RewardItem from "../components/RewardItem";
import DashboardLayout from "../layouts/DashboardLayout";

const rewards = [
  {
    id: "daily-check-in",
    label: <>Fazer check-in di&aacute;rio</>,
    xp: 10,
  },
  {
    id: "assistant-chat",
    label: "Conversar com assistente",
    xp: 5,
  },
  {
    id: "questionnaire",
    label: <>Completar question&aacute;rio</>,
    xp: 20,
  },
  {
    id: "insights",
    label: "Ver insights",
    xp: 5,
  },
];

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

type Activity = {
  id: string;
  label: string;
  xp: number;
};

type GamificationData = {
  level: string;
  healthScore: number;
  progressPercent: number;
  currentXp: number;
  xpToNextLevel: number;
  streakDays: number;
  totalCheckIns: number;
  latestClassification: string;
  achievements: Achievement[];
  recentActivities: Activity[];
};

export default function Gamificacao() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGamification() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api("/gamification/me");
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || "Erro ao carregar gamificação");
        }

        const json = await res.json();
        setData(json?.data ?? null);
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar gamificação");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGamification();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Gamifica&ccedil;&atilde;o
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Acompanhe sua evolu&ccedil;&atilde;o e conquistas
          </p>
        </header>

        <DashboardCard className="overflow-hidden p-0">
          <div className="bg-linear-to-br from-[#2F8F7B] to-[#4fb39d] p-7 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold ring-1 ring-white/20">
                  {data ? data.level.charAt(0) : "–"}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/75">
                    N&iacute;vel atual
                  </p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                    {data?.level ?? "Carregando..."}
                  </h2>
                </div>
              </div>

              <div className="animate-[xpPulse_1.8s_ease-in-out_infinite] rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                {data ? `${data.currentXp} / 1000 XP` : "…"}
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white/80">
                  {data
                    ? `${data.progressPercent}% até o próximo nível`
                    : "Carregando progresso..."}
                </p>
                <p className="text-sm font-semibold">
                  {data ? `+${data.xpToNextLevel} XP` : "…"}
                </p>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white/20 ring-1 ring-white/20">
                <div
                  className={`h-full rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.55)] ${getProgressWidthClass(
                    data?.progressPercent ?? 0,
                  )}`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-white p-6 sm:grid-cols-3 sm:p-7">
            <StatPill
              label="Sequência"
              value={data ? `${data.streakDays} dias` : "–"}
            />
            <StatPill
              label="Conquistas"
              value={
                data
                  ? `${data.achievements.filter((item) => item.unlocked).length} desbloqueadas`
                  : "–"
              }
            />
            <StatPill
              label="Pontos de bem-estar"
              value={data ? `${data.healthScore}` : "–"}
            />
          </div>
        </DashboardCard>

        <DashboardCard>
          <SectionTitle>Conquistas</SectionTitle>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {data ? (
              data.achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} {...achievement} />
              ))
            ) : (
              <p className="text-sm text-gray-500">Carregando conquistas...</p>
            )}
          </div>
        </DashboardCard>

        <section className="grid gap-6 xl:grid-cols-2">
          <DashboardCard>
            <SectionTitle>Como ganhar pontos</SectionTitle>
            <div className="mt-5 space-y-3">
              {rewards.map((reward) => (
                <RewardItem key={reward.id} xp={reward.xp}>
                  {reward.label}
                </RewardItem>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard>
            <SectionTitle>Atividades recentes</SectionTitle>
            <div className="mt-5 space-y-3">
              {data ? (
                data.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} xp={activity.xp}>
                    {activity.label}
                  </ActivityItem>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Carregando atividades...
                </p>
              )}
            </div>
          </DashboardCard>
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </DashboardLayout>
  );
}

type AchievementBadgeProps = {
  description: string;
  title: string;
  unlocked: boolean;
};

function AchievementBadge({
  description,
  title,
  unlocked,
}: AchievementBadgeProps) {
  return (
    <div
      className={`rounded-2xl border p-4 transition duration-200 ${
        unlocked
          ? "border-emerald-100 bg-emerald-50/70 hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-sm"
          : "border-gray-200 bg-white/80"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold shadow-sm ${
          unlocked ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        ★
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}

type SectionTitleProps = {
  children: ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="text-lg font-semibold text-gray-950">{children}</h2>;
}

type StatPillProps = {
  label: string;
  value: string;
};

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function getProgressWidthClass(progressPercent: number) {
  if (progressPercent >= 100) return "w-full";
  if (progressPercent >= 90) return "w-[90%]";
  if (progressPercent >= 80) return "w-[80%]";
  if (progressPercent >= 70) return "w-[70%]";
  if (progressPercent >= 60) return "w-[60%]";
  if (progressPercent >= 50) return "w-[50%]";
  if (progressPercent >= 40) return "w-[40%]";
  if (progressPercent >= 30) return "w-[30%]";
  if (progressPercent >= 20) return "w-[20%]";
  if (progressPercent >= 10) return "w-[10%]";
  return "w-0";
}
