import { Navigate, Outlet } from 'react-router-dom'
// import type  { useAuthStore, UserRole } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/store/authStore'

// ── PrivateRoute: must be logged in ──
export function PrivateRoute() {
  const { token, user } = useAuthStore()
  const { openAuthModal } = useUIStore()

  if (!token || !user) {
    openAuthModal('login')
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

// ── RoleRoute: must have specific role ──
interface RoleRouteProps {
  role: UserRole | UserRole[]
  redirectTo?: string
}

export function RoleRoute({ role, redirectTo = '/' }: RoleRouteProps) {
  const { user, token } = useAuthStore()

  if (!token || !user) return <Navigate to="/" replace />

  const allowed = Array.isArray(role) ? role : [role]
  if (!allowed.includes(user.role)) return <Navigate to={redirectTo} replace />

  return <Outlet />
}