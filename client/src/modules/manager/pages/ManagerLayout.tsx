import type { ComponentType, ReactNode } from 'react'

import type { SidebarItem } from '../../../components/Sidebar'
import DashboardLayout from '../../../layouts/DashboardLayout'

type IconProps = {
  className?: string
}

type ManagerLayoutProps = {
  children: ReactNode
  title?: string
}

const managerUser = {
  name: 'Gestora Helena',
  email: 'gestao@mentis.com',
}

export default function ManagerLayout({ children, title }: ManagerLayoutProps) {
  return (
    <DashboardLayout
      brand="Mentis Gestao"
      brandHref="/manager/painel"
      sidebarItems={managerSidebarItems}
      title={title}
      user={managerUser}
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

const DashboardIcon = createIcon(
  <path
    d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const PsychologistsIcon = createIcon(
  <path
    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0m13-9 1.5 1.5L22 10"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const PatientsIcon = createIcon(
  <path
    d="M15.5 20a4.5 4.5 0 0 0-9 0M11 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.5 19a3.5 3.5 0 0 0-3-3.45M16.5 4.4a3 3 0 0 1 0 5.8"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const AnalyticsIcon = createIcon(
  <path
    d="M4 19V5m0 14h16M8 15l3-3 3 2 4-6M8 19v-4m4 4v-7m4 7v-5"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const ReportsIcon = createIcon(
  <path
    d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M8.5 13h7M8.5 17h5"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const AlertsIcon = createIcon(
  <path
    d="M12 4 3.5 19h17L12 4Zm0 5v4m0 3h.01"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const SettingsIcon = createIcon(
  <path
    d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5-3.5a7.8 7.8 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2-1.1L14.7 3h-5.4L9 5.8a8 8 0 0 0-2 1.1l-2.4-1-2 3.4 2 1.5a8.8 8.8 0 0 0 0 2.4l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2 1.1l.3 2.8h5.4l.3-2.8a8 8 0 0 0 2-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
)

const managerSidebarItems: SidebarItem[] = [
  {
    href: '/manager/painel',
    label: 'Painel Geral',
    icon: DashboardIcon,
  },
  {
    href: '/manager/psicologos',
    label: <>Psic&oacute;logos</>,
    icon: PsychologistsIcon,
  },
  {
    href: '/manager/pacientes',
    label: 'Pacientes',
    icon: PatientsIcon,
  },
  {
    href: '/manager/analytics',
    label: 'Analytics da Equipe',
    icon: AnalyticsIcon,
  },
  {
    href: '/manager/relatorios',
    label: <>Relat&oacute;rios</>,
    icon: ReportsIcon,
  },
  {
    href: '/manager/alertas',
    label: 'Alertas',
    icon: AlertsIcon,
  },
  {
    href: '/manager/privacidade',
    label: 'Privacidade & Dados',
    icon: SettingsIcon,
  },
  {
    href: '/manager/configuracoes',
    label: <>Configura&ccedil;&otilde;es</>,
    icon: SettingsIcon,
  },
]
