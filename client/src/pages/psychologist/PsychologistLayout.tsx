import type { ComponentType, ReactNode } from 'react'

import type { SidebarItem } from '../../components/Sidebar'
import DashboardLayout from '../../layouts/DashboardLayout'

type IconProps = {
  className?: string
}

type PsychologistLayoutProps = {
  children: ReactNode
  title?: string
}

const psychologistUser = {
  name: 'Dra. Renata',
  email: 'renata@mentis.com',
}

export default function PsychologistLayout({
  children,
  title,
}: PsychologistLayoutProps) {
  return (
    <DashboardLayout
      brand="Mentis Clinico"
      brandHref="/psychologist/painel"
      sidebarItems={psychologistSidebarItems}
      title={title}
      user={psychologistUser}
    >
      {children}
    </DashboardLayout>
  )
}

function createIcon(paths: ReactNode): ComponentType<IconProps> {
  return function Icon({ className = '' }: IconProps) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {paths}
      </svg>
    )
  }
}

const PanelsIcon = createIcon(
  <>
    <path
      d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4ZM13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4ZM4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4ZM13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </>,
)

const UsersIcon = createIcon(
  <>
    <path
      d="M15.5 20a4.5 4.5 0 0 0-9 0M11 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.5 19a3.5 3.5 0 0 0-3-3.45M16.5 4.4a3 3 0 0 1 0 5.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>,
)

const HistoryIcon = createIcon(
  <>
    <path
      d="M4 12a8 8 0 1 0 2.35-5.65M4 5v5h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8v4l3 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>,
)

const SparklesIcon = createIcon(
  <>
    <path
      d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>,
)

const AssistantIcon = createIcon(
  <>
    <path
      d="M8 6h8a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-1.5L12 20l-2.5-3H8a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 11h.01M12 11h.01M15 11h.01"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </>,
)

const psychologistSidebarItems: SidebarItem[] = [
  {
    href: '/psychologist/painel',
    label: 'Painel Geral',
    icon: PanelsIcon,
  },
  {
    href: '/psychologist/pacientes',
    label: 'Pacientes',
    icon: UsersIcon,
  },
  {
    href: '/psychologist/historico',
    label: <>Hist&oacute;rico</>,
    icon: HistoryIcon,
  },
  {
    href: '/psychologist/insights',
    label: 'Insights',
    icon: SparklesIcon,
  },
  {
    href: '/psychologist/assistente',
    label: 'Assistente IA',
    icon: AssistantIcon,
  },
]
