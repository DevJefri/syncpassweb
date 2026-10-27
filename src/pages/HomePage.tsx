import { useAuth } from '../auth/AuthContext.tsx'
import ApiStatus from '../components/ApiStatus.tsx'

function formatDateTime(iso?: string) {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('es-ES')
  } catch {
    return iso
  }
}

function formatDuration(ms: number) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

export default function HomePage() {
  const { user, loading, error, login, logout } = useAuth()

  if (loading) return <p>Cargando...</p>

  if (user) {
    const role = user.role || (user.groups && user.groups.length > 0 ? user.groups.join(', ') : 'Sin rol asignado')
    const sessionDate = formatDateTime(user.loginAt)
    const now = new Date().toLocaleString('es-ES')
    const connectionDuration = user.loginAt ? formatDuration(Date.now() - new Date(user.loginAt).getTime()) : '-'

    return (
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">SyncPass</h1>
            <p className="mt-2 text-lg text-ink/70">Panel de sesión</p>
          </div>
          <button
            onClick={() => void logout()}
            className="rounded-lg bg-ink/90 px-4 py-2 font-semibold text-white hover:bg-ink"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-xl font-extrabold">Datos del usuario conectado</h2>
            <p className="mt-1 text-sm text-ink/60">Información de sesión actual</p>
          </div>
          <dl className="grid gap-4 px-6 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-ink/60">Correo electrónico</dt>
              <dd className="mt-1 font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Usuario / Username</dt>
              <dd className="mt-1 font-semibold">{user.username ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Identificador (sub)</dt>
              <dd className="mt-1 break-all font-semibold">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Rol / Grupo</dt>
              <dd className="mt-1 font-semibold">{role}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Fecha y hora de inicio de sesión</dt>
              <dd className="mt-1 font-semibold">{sessionDate}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Tiempo de conexión</dt>
              <dd className="mt-1 font-semibold">{connectionDuration}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink/60">Fecha y hora actual</dt>
              <dd className="mt-1 font-semibold">{now}</dd>
            </div>
          </dl>
        </div>

        <ApiStatus />
      </section>
    )
  }

  return (
    <section className="py-8">
      <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
        Tu aplicación empieza aquí.
      </h1>
      <p className="mt-5 max-w-prose text-lg text-ink/70">
        Inicia sesión o crea tu cuenta en la pantalla de acceso de Cognito.
      </p>
      {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
      <div className="mt-8">
        <button
          onClick={() => void login()}
          className="rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark"
        >
          Iniciar sesión
        </button>
      </div>
    </section>
  )
}
