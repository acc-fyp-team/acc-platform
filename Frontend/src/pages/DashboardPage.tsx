import { useEffect, useState } from 'react'
import { ShieldCheck, UserPlus, Users, Briefcase } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { api } from '../lib/api'
import AppLayout from '../components/AppLayout'

type Permission = {
  module: string
  action: string
  isAllowed: boolean
  requiresApproval: boolean
}

// A single number card, in the ACC style: pale brand icon square,
// large figure, muted label.
function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users
  value: string | number
  label: string
}) {
  return (
    <div className="rounded-card border border-line bg-card p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-soft text-brand">
        <Icon size={20} />
      </div>
      <div className="font-heading text-3xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const [permissions, setPermissions] = useState<Permission[]>([])
  const [clientCount, setClientCount] = useState<number | null>(null)
  const [employeeCount, setEmployeeCount] = useState<number | null>(null)

  useEffect(() => {
    // All three calls only succeed because the token travels with them.
    api
      .get<Permission[]>('/api/permissions/me')
      .then((res) => setPermissions(res.data))
      .catch(() => setPermissions([]))

    api
      .get<unknown[]>('/api/clients?status=Active')
      .then((res) => setClientCount(res.data.length))
      .catch(() => setClientCount(null))

    api
      .get<unknown[]>('/api/employees?status=Active')
      .then((res) => setEmployeeCount(res.data.length))
      .catch(() => setEmployeeCount(null))
  }, [])

  const firstName = user?.fullName?.split(' ')[0] ?? 'there'
  const allowedModules = [
    ...new Set(permissions.filter((p) => p.isAllowed).map((p) => p.module)),
  ]

  return (
    <AppLayout title="Dashboard">
      {/* Welcome banner */}
      <div className="rounded-card bg-gradient-to-r from-[#1A1A1A] via-[#241611] to-[#3A1C0E] px-7 py-8 text-white">
        <h2 className="font-heading text-2xl font-semibold">
          Welcome, <span className="text-brand">{firstName}</span>
        </h2>
        <p className="mt-1.5 text-white/65">
          Here's what's happening with your company today.
        </p>
      </div>

      {/* Numbers */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={UserPlus}
          value={clientCount ?? '--'}
          label="Active Clients"
        />
        <StatCard
          icon={Users}
          value={employeeCount ?? '--'}
          label="Active Employees"
        />
        <StatCard
          icon={ShieldCheck}
          value={permissions.filter((p) => p.isAllowed).length}
          label="Permissions Granted"
        />
        <StatCard icon={Briefcase} value={user?.role ?? '--'} label="Your Role" />
      </div>

      {/* Access */}
      <div className="mt-6 rounded-card border border-line bg-card p-6">
        <h3 className="font-heading font-semibold text-ink">Modules you can open</h3>
        <p className="mt-1 text-sm text-muted">
          Loaded from the server for your account.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {allowedModules.length === 0 && (
            <span className="text-sm text-subtle">No modules granted yet.</span>
          )}
          {allowedModules.map((module) => (
            <span
              key={module}
              className="rounded-full bg-raised px-3 py-1.5 text-sm text-muted"
            >
              {module}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-subtle">
        Clients and Employees screens are next.
      </p>
    </AppLayout>
  )
}
