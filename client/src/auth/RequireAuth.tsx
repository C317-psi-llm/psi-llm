import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getAccessToken } from './auth'

type RequireAuthProps = {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const token = getAccessToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
