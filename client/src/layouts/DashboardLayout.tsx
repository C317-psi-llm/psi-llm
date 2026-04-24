import { useState, type ReactNode } from 'react'

import Sidebar, {
  type SidebarItem,
  type SidebarUser,
} from '../components/Sidebar'

type DashboardLayoutProps = {
  brand?: string
  brandHref?: string
  children: ReactNode
  contentClassName?: string
  sidebarItems?: SidebarItem[]
  title?: string
  user?: SidebarUser
}

export default function DashboardLayout({
  brand,
  brandHref,
  children,
  contentClassName = '',
  sidebarItems,
  title,
  user,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        brand={brand}
        brandHref={brandHref}
        isOpen={isSidebarOpen}
        items={sidebarItems}
        user={user}
        onClose={closeSidebar}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-gray-950/30 md:hidden"
          aria-label="Fechar menu"
          onClick={closeSidebar}
        />
      )}

      <div className="min-h-screen md:pl-60">
        <MobileHeader
          title={title ?? brand ?? 'Mentis Tech'}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main
          className={`px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${contentClassName}`}
        >
          {title && <PageTitle>{title}</PageTitle>}
          {children}
        </main>
      </div>
    </div>
  )
}

type MobileHeaderProps = {
  title: string
  onMenuClick: () => void
}

function MobileHeader({ title, onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 md:hidden">
      <IconButton ariaLabel="Abrir menu" onClick={onMenuClick}>
        <MenuIcon className="h-5 w-5" />
      </IconButton>

      <p className="min-w-0 truncate text-sm font-semibold text-gray-950">
        {title}
      </p>
    </header>
  )
}

type PageTitleProps = {
  children: ReactNode
}

function PageTitle({ children }: PageTitleProps) {
  return (
    <header className="mb-8 hidden md:block">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
        {children}
      </h1>
    </header>
  )
}

type IconButtonProps = {
  ariaLabel: string
  children: ReactNode
  onClick: () => void
}

function IconButton({ ariaLabel, children, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

type MenuIconProps = {
  className?: string
}

function MenuIcon({ className = '' }: MenuIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
