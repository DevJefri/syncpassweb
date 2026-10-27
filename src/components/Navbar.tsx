import { Link } from 'wouter'
import { useAuth } from '../auth/AuthContext.tsx'

const linkClass = 'rounded-lg px-3 py-2 font-semibold hover:bg-ink/5'

export default function Navbar() {
  const { user, loading, login, logout } = useAuth()

  return (
    <header className="border-b border-line bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-2 px-5 py-3">
        <Link href="/" className="mr-auto text-xl font-extrabold tracking-tight">
          SyncPass
        </Link>
        {loading ? null : user ? (
          <>
            <span className="hidden text-sm text-ink/70 sm:inline">{user.email}</span>
            <button className={linkClass} onClick={() => void logout()}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <button
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-dark"
            onClick={() => void login()}
          >
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  )
}
