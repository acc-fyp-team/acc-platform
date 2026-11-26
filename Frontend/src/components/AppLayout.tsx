import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  DollarSign,
  HardHat,
  LayoutGrid,
  LogOut,
  Package,
  Settings,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

type NavItem = {
  label: string
  icon: LucideIcon
  to?: string // set once the screen exists
}

// The sidebar mirrors the ACC admin portal. Items without a `to`
// are planned screens that have not been built yet, so they are
// shown but dimmed instead of leading to an empty page.
const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Main',
    items: [{ label: 'Dashboard', icon: LayoutGrid, to: '/dashboard' }],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', icon: Users },
      { label: 'Clients', icon: UserPlus, to: '/clients' },
      { label: 'Employees', icon: User, to: '/employees' },
      { label: 'Materials', icon: Package },
      { label: 'Assignments', icon: CalendarDays },
      { label: 'Projects', icon: Building2 },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Attendance', icon: ClipboardList },
      { label: 'Salaries', icon: CreditCard },
      { label: 'Billing & Invoices', icon: DollarSign },
      { label: 'Field View', icon: HardHat },
      { label: 'Notifications', icon: Bell },
      { label: 'Alerts', icon: AlertTriangle },
    ],
  },
  {
    title: 'Account',
    items: [{ label: 'Settings', icon: Settings }],
  },
]

export default function AppLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = (user?.fullName ?? '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-panel text-white lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="font-heading text-2xl font-bold text-brand">ACC</span>
          <span className="h-8 w-px bg-white/15" />
          <span className="text-[11px] leading-tight font-medium tracking-wide text-white/60">
            ADMIN
            <br />
            PORTAL
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-white/35 uppercase">
                {section.title}
              </p>

              {section.items.map((item) => {
                const Icon = item.icon

                // Not built yet - visible, but clearly inactive.
                if (!item.to) {
                  return (
                    <div
                      key={item.label}
                      className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/25"
                      title="Coming in a later sprint"
                    >
                      <Icon size={18} />
                      {item.label}
                    </div>
                  )
                }

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                        isActive
                          ? 'bg-brand font-medium text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white',
                      ].join(' ')
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col bg-page">
        <header className="flex items-center justify-between border-b border-line bg-card px-6 py-4">
          <h1 className="font-heading text-xl font-semibold text-ink">{title}</h1>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-ink">{user?.fullName}</div>
              <div className="text-xs text-muted">{user?.role}</div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
              {initials || 'U'}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition hover:bg-hover hover:text-ink"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
