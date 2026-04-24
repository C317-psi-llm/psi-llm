import type { ComponentType, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type IconProps = {
  className?: string
}

export type SidebarItem = {
  href: string
  label: ReactNode
  icon: ComponentType<IconProps>
}

export type SidebarUser = {
  name: string
  email: string
}

type SidebarProps = {
  brand?: string
  brandHref?: string
  isOpen: boolean
  items?: SidebarItem[]
  user?: SidebarUser
  onClose: () => void
}

const defaultUser: SidebarUser = {
  name: 'Ana Silva',
  email: 'ana@empresa.com',
}

const patientSidebarItems: SidebarItem[] = [
  {
    href: '/',
    label: <>In&iacute;cio</>,
    icon: HomeIcon,
  },
  {
    href: '/questionario',
    label: <>Question&aacute;rio</>,
    icon: ClipboardIcon,
  },
  {
    href: '/dashboard',
    label: 'Meu Dashboard',
    icon: ChartIcon,
  },
  {
    href: '/insights',
    label: 'Insights',
    icon: SparklesIcon,
  },
  {
    href: '/chat',
    label: 'Chat de Apoio',
    icon: ChatIcon,
  },
  {
    href: '/gamificacao',
    label: <>Gamifica&ccedil;&atilde;o</>,
    icon: TrophyIcon,
  },
]

export default function Sidebar({
  brand = 'Mentis Tech',
  brandHref = '/',
  isOpen,
  items = patientSidebarItems,
  user = defaultUser,
  onClose,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-gray-200 bg-gray-50 transition-transform duration-200 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Navegacao lateral"
    >
      <SidebarBrand href={brandHref} onClose={onClose}>
        {brand}
      </SidebarBrand>

      <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Menu principal">
        {items.map((item) => (
          <SidebarNavItem key={item.href} item={item} onClose={onClose} />
        ))}
      </nav>

      <SidebarUserCard user={user} />
    </aside>
  )
}

type SidebarBrandProps = {
  children: ReactNode
  href: string
  onClose: () => void
}

function SidebarBrand({ children, href, onClose }: SidebarBrandProps) {
  return (
    <div className="flex h-16 items-center border-b border-gray-200 px-6">
      <NavLink
        to={href}
        onClick={onClose}
        className="text-lg font-semibold tracking-tight text-gray-950"
      >
        {children}
      </NavLink>
    </div>
  )
}

type SidebarNavItemProps = {
  item: SidebarItem
  onClose: () => void
}

function SidebarNavItem({ item, onClose }: SidebarNavItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-white hover:text-gray-950'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`h-5 w-5 ${
              isActive ? 'text-white' : 'text-gray-400'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

type SidebarUserCardProps = {
  user: SidebarUser
}

function SidebarUserCard({ user }: SidebarUserCardProps) {
  return (
    <div className="border-t border-gray-200 px-4 py-5">
      <div className="rounded-lg bg-white px-3 py-3 shadow-sm">
        <p className="truncate text-sm font-semibold text-gray-950">
          {user.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  )
}

function HomeIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 10.75 12 3l9 7.75V20a1 1 0 0 1-1 1h-5.25v-6h-5.5v6H4a1 1 0 0 1-1-1v-9.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClipboardIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 5h6m-7 4.5h8M8 14h8M8 18h5M9 3h6l1 2h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2l1-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChartIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparklesIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 18.5 3.5 21V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H5Zm3-9h8m-8 4h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrophyIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 4h8v4a4 4 0 0 1-8 0V4Zm4 8v4m-3 4h6m-8 0h10M8 6H5a2 2 0 0 0 2 4m9-4h3a2 2 0 0 1-2 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
