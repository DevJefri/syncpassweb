import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchAuthSession, fetchUserAttributes, getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

export interface AppUser {
  id: string
  email: string
  username?: string
  groups?: string[]
  role?: string
  loginAt?: string
}

interface AuthState {
  user: AppUser | null
  loading: boolean
  error: string
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const returningFromCognito = new URLSearchParams(window.location.search).has('code')

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const decoded = atob(padded)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const current = await getCurrentUser()
      const attrs = await fetchUserAttributes()
      let groups: string[] = []
      let role: string | undefined

      try {
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()
        const idToken = session.tokens?.idToken?.toString()
        const payload = accessToken ? decodeJwtPayload(accessToken) : idToken ? decodeJwtPayload(idToken) : null
        if (payload) {
          if (Array.isArray(payload['cognito:groups'])) {
            groups = payload['cognito:groups']
          }
          if (typeof payload['custom:role'] === 'string') {
            role = payload['custom:role']
          } else if (typeof payload.role === 'string') {
            role = payload.role
          } else if (groups.length > 0) {
            role = groups[0]
          }
        }
      } catch {
        // ignore
      }

      setUser({
        id: current.userId,
        email: attrs.email ?? current.username,
        username: current.username,
        groups,
        role,
        loginAt: new Date().toISOString(),
      })
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const stopListening = Hub.listen('auth', async ({ payload }) => {
      if (payload.event === 'signInWithRedirect') {
        await refresh()
        setLoading(false)
        window.history.replaceState({}, '', window.location.pathname)
      }
      if (payload.event === 'signInWithRedirect_failure') {
        setError('No se pudo completar el inicio de sesión con Cognito.')
        setLoading(false)
      }
    })

    if (!returningFromCognito) {
      void refresh().finally(() => setLoading(false))
    }
    return stopListening
  }, [refresh])

  const login = useCallback(async () => {
    setError('')
    try {
      await signInWithRedirect()
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
