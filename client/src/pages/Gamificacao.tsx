import type { ReactNode } from 'react'

import ActivityItem from '../components/ActivityItem'
import DashboardCard from '../components/DashboardCard'
import RewardItem from '../components/RewardItem'
import DashboardLayout from '../layouts/DashboardLayout'

const rewards = [
  {
    id: 'daily-check-in',
    label: <>Fazer check-in di&aacute;rio</>,
    xp: 10,
  },
  {
    id: 'assistant-chat',
    label: 'Conversar com assistente',
    xp: 5,
  },
  {
    id: 'questionnaire',
    label: <>Completar question&aacute;rio</>,
    xp: 20,
  },
  {
    id: 'insights',
    label: 'Ver insights',
    xp: 5,
  },
]

const recentActivities = [
  {
    id: 'completed-check-in',
    label: <>Voc&ecirc; completou um check-in</>,
    xp: 10,
  },
  {
    id: 'used-assistant',
    label: <>Voc&ecirc; conversou com o assistente</>,
    xp: 5,
  },
  {
    id: 'viewed-insights',
    label: <>Voc&ecirc; visualizou insights</>,
    xp: 5,
  },
]

const achievements = [
  {
    id: 'seven-days',
    title: '7 dias seguidos',
    description: 'Manteve sua rotina de check-ins ativa.',
  },
  {
    id: 'first-chat',
    title: 'Primeira conversa',
    description: 'Usou o chat de apoio pela primeira vez.',
  },
  {
    id: 'insight-reader',
    title: 'Explorador de insights',
    description: 'Visualizou recomendacoes personalizadas.',
  },
]

export default function Gamificacao() {
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
          <div className="bg-gradient-to-br from-[#2F8F7B] to-[#4fb39d] p-7 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold ring-1 ring-white/20">
                  5
                </div>
                <div>
                  <p className="text-sm font-medium text-white/75">
                    N&iacute;vel atual
                  </p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                    Equilibrado
                  </h2>
                </div>
              </div>

              <div className="animate-[xpPulse_1.8s_ease-in-out_infinite] rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                700 / 1000 XP
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white/80">
                  70% at&eacute; o pr&oacute;ximo n&iacute;vel
                </p>
                <p className="text-sm font-semibold">+300 XP</p>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white/20 ring-1 ring-white/20">
                <div className="h-full w-[70%] rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.55)]" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-white p-6 sm:grid-cols-3 sm:p-7">
            <StatPill label="Sequencia" value="12 dias" />
            <StatPill label="Conquistas" value="8" />
            <StatPill label="XP restante" value="300" />
          </div>
        </DashboardCard>

        <DashboardCard>
          <SectionTitle>Conquistas</SectionTitle>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} {...achievement} />
            ))}
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
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} xp={activity.xp}>
                  {activity.label}
                </ActivityItem>
              ))}
            </div>
          </DashboardCard>
        </section>
      </div>
    </DashboardLayout>
  )
}

type AchievementBadgeProps = {
  description: string
  title: string
}

function AchievementBadge({ description, title }: AchievementBadgeProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-semibold text-emerald-700 shadow-sm">
        &#9733;
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  )
}

type SectionTitleProps = {
  children: ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="text-lg font-semibold text-gray-950">{children}</h2>
}

type StatPillProps = {
  label: string
  value: string
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-950">{value}</p>
    </div>
  )
}
