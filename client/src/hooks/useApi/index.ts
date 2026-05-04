type ApiOptions = RequestInit & { stream?: boolean }

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined

function readAccessToken(): string | null {
  try {
    const raw = window.localStorage.getItem('accessToken')
    if (raw === null) return null
    return JSON.parse(raw) as string
  } catch {
    return null
  }
}

export async function api(path: string, options: ApiOptions = {}): Promise<Response> {
  const { stream, headers, body, ...rest } = options

  const finalHeaders = new Headers(headers)

  const token = readAccessToken()
  if (token && !finalHeaders.has('Authorization')) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  if (
    typeof body === 'string' &&
    !stream &&
    !finalHeaders.has('Content-Type')
  ) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  const url = `${BASE_URL ?? ''}${path}`

  return fetch(url, {
    ...rest,
    headers: finalHeaders,
    body,
  })
}

export default api
