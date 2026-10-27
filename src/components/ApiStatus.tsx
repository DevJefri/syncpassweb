import { useState } from 'react'
import { apiFetch, API_URL } from '../config/api.ts'

interface Result {
  label: string
  ok: boolean
  detail: string
}

// Panel de prueba: confirma que Front -> API Gateway -> EC2 funciona.
export default function ApiStatus() {
  const [results, setResults] = useState<Result[]>([])
  const [busy, setBusy] = useState(false)

  async function run(label: string, path: string) {
    try {
      const data = await apiFetch<unknown>(path)
      return { label, ok: true, detail: JSON.stringify(data) }
    } catch (err) {
      return { label, ok: false, detail: (err as Error).message }
    }
  }

  async function onTest() {
    setBusy(true)
    setResults([
      await run('GET /api/health (público)', '/api/health'),
      await run('GET /api/me (protegido, usa tu token)', '/api/me'),
    ])
    setBusy(false)
  }

  return (
    <div className="mt-8 max-w-2xl rounded-2xl border border-line bg-white p-6">
      <h2 className="text-lg font-extrabold">Conexión con la API</h2>
      <p className="mt-1 text-sm text-ink/60 break-all">{API_URL || 'VITE_API_URL sin configurar'}</p>
      <button
        onClick={() => void onTest()}
        disabled={busy}
        className="mt-4 rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {busy ? 'Probando...' : 'Probar API'}
      </button>
      <ul className="mt-4 flex flex-col gap-2">
        {results.map((r) => (
          <li key={r.label} className="text-sm">
            <span className={r.ok ? 'font-semibold text-green-700' : 'font-semibold text-red-700'}>
              {r.ok ? 'OK' : 'ERROR'}
            </span>{' '}
            {r.label}
            <pre className="mt-1 overflow-x-auto rounded bg-ink/5 p-2 text-xs">{r.detail}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
}
