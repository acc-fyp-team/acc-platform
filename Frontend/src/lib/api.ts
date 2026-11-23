import axios from 'axios'

// Where the backend lives. Change it in one place only.
const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5112'

export const api = axios.create({ baseURL })

export const TOKEN_KEY = 'acc_token'
export const USER_KEY = 'acc_user'

// Before every request goes out, attach the saved token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the server ever answers 401, the session is over:
// clear what we stored and send the user back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// Pulls the server's { message } out of an axios error.
export function errorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback
  }
  return fallback
}
