// export type UserRole = 'user' | 'admin' | 'organizer'

// export interface User {
//   id: string
//   name: string
//   email: string
//   role: UserRole
//   loyaltyPoints: number
// }

// interface AuthState {
//   user: User | null
//   token: string | null
//   setAuth: (user: User, token: string) => void
//   logout: () => void
//   isLoggedIn: () => boolean
//   isAdmin: () => boolean
// }

// export const useAuthStore = create<AuthState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         user: null, token: null,
//         setAuth: (user, token) => set({ user, token }),
//         logout: () => set({ user: null, token: null }),
//         isLoggedIn: () => !!get().token && !!get().user,
//         isAdmin: () => get().user?.role === 'admin',
//       }),
//       {
//         name: 'bms-auth',
//         // only persist user + token, not functions
//         partialize: (state) => ({ user: state.user, token: state.token }),
//       }
//     )
//   )
// )