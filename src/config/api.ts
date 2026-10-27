import { fetchAuthSession } from 'aws-amplify/auth'

// Invoke URL del API Gateway (sin "/" final)
export const API_URL: string = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Llama a la API a través del API Gateway.
 * Si hay sesión, adjunta el access token de Cognito como "Authorization: Bearer ...".
 * Amplify renueva el token automáticamente con el refresh token cuando expira.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new ApiError(0, 'Falta VITE_API_URL en el archivo .env')

  const session = await fetchAuthSession()
  const token = session.tokens?.accessToken?.toString()

  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_URL}${path}`, { ...init, headers })
  const text = await res.text()
  const body = text ? JSON.parse(text) : null

  if (!res.ok) throw new ApiError(res.status, body?.message ?? res.statusText)
  return body as T
}
