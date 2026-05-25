export type StoredUser = {
  id_usuario: number
  nome: string
  email: string
  papel: string
  [key: string]: unknown
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function getAccessToken(): string | null {
  return readStorage<string>('accessToken')
}

export function getRefreshToken(): string | null {
  return readStorage<string>('refreshToken')
}

export function getStoredUser(): StoredUser | null {
  return readStorage<StoredUser>('user')
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('user')
  } catch {
    // ignore storage errors
  }
}

export function roleHomeRoute(papel: string | undefined): string {
  switch (papel) {
    case 'funcionario':
      return '/patient/home'
    case 'psicologo':
      return '/psychologist/pacientes'
    case 'gestor':
    case 'admin':
      return '/manager/painel'
    default:
      return '/login'
  }
}
