import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getAccessToken, getStoredUser, roleHomeRoute } from './auth'

type RequireRoleProps = {
  allow: string[]
  children: ReactNode
}

export default function RequireRole({ allow, children }: RequireRoleProps) {
  const token = getAccessToken()
  const user = getStoredUser()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (!allow.includes(user.papel)) {
    return <Navigate to={roleHomeRoute(user.papel)} replace />
  }

  return <>{children}</>
}
