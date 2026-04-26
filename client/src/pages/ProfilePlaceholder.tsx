import type { ReactNode } from 'react'

type ProfilePlaceholderProps = {
  title: ReactNode
}

export default function ProfilePlaceholder({ title }: ProfilePlaceholderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
        {title}
      </h1>
    </main>
  )
}
