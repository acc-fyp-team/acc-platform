import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api, TOKEN_KEY, USER_KEY } from '../lib/api'

// The signed-in user, exactly as the login endpoint returns it (minus the token).
export type AuthUser = {
  userID: number
  username: string
  fullName: string
  role: string
  profilePicture: string | null
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (username: string, password: string, keepSignedIn: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // On a page refresh, bring the signed-in user back from storage.
  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY)
    if (saved) {
      try {
        setUser(JSON.parse(saved) as AuthUser)
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  async function login(username: string, password: string, keepSignedIn: boolean) {
    const { data } = await api.post('/api/auth/login', {
      username,
      password,
      keepSignedIn,
    })

    const { token, ...profile } = data as AuthUser & { token: string }

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
