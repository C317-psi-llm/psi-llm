import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import DashboardCard from '../components/DashboardCard'
import ProgressBar from '../components/ProgressBar'
import DashboardLayout from '../layouts/DashboardLayout'

type ActionCardData = {
  description: ReactNode
  href: string
  id: string
  marker: string
  title: string
}

type WellbeingMetric = {
  colorClassName: string
  id: string
  label: ReactNode
  level: ReactNode
  value: number
}

const actionCards: ActionCardData[] = [
  {
    id: 'check-in',
    title: 'Fazer Check-in',
    description: <>Responder question&aacute;rio de bem estar</>,
    href: '/questionario',
    marker: '01',
  },
  {
    id: 'support-chat',
    title: 'Chat de apoio',
    description: 'Converse com o assistente IA',
    href: '/chat',
    marker: '02',
  },
  {
    id: 'insights',
    title: 'Insights',
    description: <>Ver recomenda&ccedil;&otilde;es personalizadas</>,
    href: '/insights',
    marker: '03',
  },
]

const wellbeingMetrics: WellbeingMetric[] = [
  {
    id: 'anxiety',
    label: 'Ansiedade',
    level: 'Alto',
    value: 82,
    colorClassName: 'bg-rose-500',
  },
  {
    id: 'stress',
    label: 'Estresse',
    level: <>M&eacute;dio</>,
    value: 58,
    colorClassName: 'bg-amber-500',
  },
  {
    id: 'burnout',
    label: 'Burnout',
    level: 'Leve',
    value: 34,
    colorClassName: 'bg-emerald-500',
  },
  {
    id: 'depression',
    label: <>Depress&atilde;o</>,
    level: 'Leve',
    value: 28,
    colorClassName: 'bg-sky-500',
  },
]

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <HomeHeader currentDate={formatCurrentDate()} />
        <ActionCardsGrid cards={actionCards} />

        <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <WellbeingStatusCard metrics={wellbeingMetrics} />
          <LatestInsightCard />
        </section>
      </div>
    </DashboardLayout>
  )
}

type HomeHeaderProps = {
  currentDate: string
}

function HomeHeader({ currentDate }: HomeHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Ol&aacute; Ana
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500">{currentDate}</p>
      </div>

      <StreakCard />
    </header>
  )
}

function StreakCard() {
  return (
    <DashboardCard className="flex w-full items-center gap-3 border-emerald-100 px-4 py-3 sm:w-auto">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <StreakIcon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-950">
          12 dias consecutivos
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          Sequ&ecirc;ncia ativa
        </p>
      </div>
    </DashboardCard>
  )
}

type ActionCardsGridProps = {
  cards: ActionCardData[]
}

function ActionCardsGrid({ cards }: ActionCardsGridProps) {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <ActionCard key={card.id} card={card} />
      ))}
    </section>
  )
}

type ActionCardProps = {
  card: ActionCardData
}

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
      <p className="mt-2 text-sm leading-6 text-white/80">
        {card.description}
      </p>
      <span className="mt-6 inline-flex text-sm font-medium text-white/90 transition-transform duration-200 group-hover:translate-x-1">
        Acessar
      </span>
    </Link>
  )
}

type WellbeingStatusCardProps = {
  metrics: WellbeingMetric[]
}

function WellbeingStatusCard({ metrics }: WellbeingStatusCardProps) {
  return (
    <DashboardCard>
      <SectionTitle>Status de Bem-estar</SectionTitle>

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
  )
}

function LatestInsightCard() {
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
        to="/insights"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        Ver todos os insights
      </Link>
    </DashboardCard>
  )
}

type SectionTitleProps = {
  children: ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="text-lg font-semibold text-gray-950">{children}</h2>
}

type InsightTagProps = {
  children: ReactNode
}

function InsightTag({ children }: InsightTagProps) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      {children}
    </span>
  )
}

type IconProps = {
  className?: string
}

function StreakIcon({ className = '' }: IconProps) {
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
  )
}

function formatCurrentDate() {
  const date = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return date.charAt(0).toUpperCase() + date.slice(1)
}
