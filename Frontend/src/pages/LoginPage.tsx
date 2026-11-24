import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { errorMessage } from '../lib/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setBusy(true)

    try {
      await login(username, password, keepSignedIn)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Could not sign in. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  const fieldClass =
    'w-full rounded-[10px] border border-line-strong bg-card px-3.5 py-2.5 text-ink outline-none transition placeholder:text-subtle focus:border-brand focus:ring-4 focus:ring-brand/10'

  return (
    <div className="flex min-h-screen">
      {/* Brand panel - hidden on small screens */}
      <div className="hidden w-[44%] flex-col justify-between bg-panel p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="font-heading text-3xl font-bold text-brand">ACC</span>
          <span className="h-9 w-px bg-white/15" />
          <span className="text-xs leading-tight font-medium tracking-wide text-white/60">
            ADMIN
            <br />
            PORTAL
          </span>
        </div>

        <div>
          <h2 className="font-heading text-3xl leading-snug font-semibold">
            Run every site,
            <br />
            from one place.
          </h2>
          <p className="mt-4 max-w-sm text-white/55">
            Projects, materials, attendance and billing - with proof behind every
            rupee spent.
          </p>
        </div>

        <p className="text-xs text-white/35">
          AI-Powered Construction Company ERP
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center bg-page px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-heading text-3xl font-bold text-brand">ACC</span>
          </div>

          <h1 className="font-heading text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted">
            Enter your details to open the portal.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            {error && (
              <div className="mb-5 rounded-[10px] border border-error/25 bg-error/8 px-3.5 py-2.5 text-sm text-error">
                {error}
              </div>
            )}

            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                Username
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
                className={fieldClass}
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className={fieldClass}
              />
            </label>

            <label className="mb-6 flex items-center gap-2.5 text-sm text-muted">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-line-strong accent-brand"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-[10px] bg-brand px-4 py-3 font-medium text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
