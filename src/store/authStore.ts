import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export type UserRole = 'user' | 'admin' | 'organizer'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  loyaltyPoints: number
  city?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  isLoggedIn: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isLoading: false,
        setAuth: (user, token) => set({ user, token }),
        setUser: (partial) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...partial } : null,
          })),
        setLoading: (isLoading) => set({ isLoading }),
        logout: () => set({ user: null, token: null }),
        isLoggedIn: () => !!get().token && !!get().user,
        isAdmin: () => get().user?.role === 'admin',
      }),
      {
        name: 'bms-auth',
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    ),
    { name: 'AuthStore' }
  )
)