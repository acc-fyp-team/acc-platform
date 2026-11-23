import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api, errorMessage } from '../lib/api'

type Permission = {
  module: string
  action: string
  isAllowed: boolean
  requiresApproval: boolean
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [permissions, setPermissions] = useState<Permission[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch the signed-in user's permissions. This is the proof that the
  // token works: the request only succeeds because it carries the token.
  useEffect(() => {
    api
      .get<Permission[]>('/api/permissions/me')
      .then((res) => setPermissions(res.data))
      .catch((err) => setError(errorMessage(err, 'Could not load permissions.')))
  }, [])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  // The modules this user may at least view.
  const modules = [...new Set(permissions.filter((p) => p.isAllowed).map((p) => p.module))]

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              ACC
            </div>
            <span className="font-semibold text-slate-900">ACC Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{user?.fullName}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.fullName}
        </h1>
        <p className="mt-1 text-slate-500">
          You are signed in as <span className="font-medium">{user?.username}</span>.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-medium text-slate-900">Your access</h2>
          <p className="mt-1 text-sm text-slate-500">
            {permissions.length} permissions loaded from the server.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {modules.map((module) => (
              <span
                key={module}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {module}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Clients and Employees screens come next.
        </p>
      </main>
    </div>
  )
}
