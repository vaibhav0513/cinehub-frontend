import api from '@/lib/axios'
// import { User } from '@/store/authStore'
import type { User } from '@/store/authStore'

// ── Types ──
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
}

export interface OtpPayload {
  phone: string
  otp: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

// ── Service Functions ──
export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload)
    return data
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },

  sendOtp: async (phone: string): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/send-otp', { phone })
    return data
  },

  verifyOtp: async (payload: OtpPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/verify-otp', payload)
    return data
  },

  googleLogin: async (token: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/google', { token })
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me')
    return data.user
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}