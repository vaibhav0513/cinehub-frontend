import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
// import type { authService, LoginPayload, RegisterPayload } from '../services/auth.service'
import { authService } from '../services/auth.service'
import type { LoginPayload, RegisterPayload } from '../services/auth.service'

export function useAuth() {
  const { setAuth, logout: storeLogout, user, token, isLoggedIn, isAdmin } = useAuthStore()
  const { closeAuthModal, addToast } = useUIStore()

  // ── Login ──
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      closeAuthModal()
      addToast('success', `Welcome back, ${user.name.split(' ')[0]}! 🎬`)
    },
    onError: (err: any) => {
      addToast('error', err?.response?.data?.message || 'Login failed. Try again.')
    },
  })

  // ── Register ──
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      closeAuthModal()
      addToast('success', `Welcome to BookMyShow, ${user.name.split(' ')[0]}! 🎉`)
    },
    onError: (err: any) => {
      addToast('error', err?.response?.data?.message || 'Registration failed.')
    },
  })

  // ── Logout ──
  const handleLogout = async () => {
    try {
      await authService.logout()
    } finally {
      storeLogout()
      addToast('info', 'Logged out successfully.')
    }
  }

  return {
    user,
    token,
    isLoggedIn: isLoggedIn(),
    isAdmin: isAdmin(),
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegisterLoading: registerMutation.isPending,
    logout: handleLogout,
  }
}