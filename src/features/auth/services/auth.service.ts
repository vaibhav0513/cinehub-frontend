// import api from '@/lib/axios'
// // import { User } from '@/store/authStore'
// import type { User } from '@/store/authStore'

// // ── Types ──
// export interface LoginPayload {
//   email: string
//   password: string
// }

// export interface RegisterPayload {
//   name: string
//   email: string
//   phone: string
//   password: string
// }

// export interface OtpPayload {
//   phone: string
//   otp: string
// }

// export interface AuthResponse {
//   user: User
//   token: string
//   message: string
// }

// // ── Service Functions ──
// export const authService = {
//   login: async (payload: LoginPayload): Promise<AuthResponse> => {
//     const { data } = await api.post('/auth/login', payload)
//     return data
//   },

//   register: async (payload: RegisterPayload): Promise<AuthResponse> => {
//     const { data } = await api.post('/auth/register', payload)
//     return data
//   },

//   sendOtp: async (phone: string): Promise<{ message: string }> => {
//     const { data } = await api.post('/auth/send-otp', { phone })
//     return data
//   },

//   verifyOtp: async (payload: OtpPayload): Promise<AuthResponse> => {
//     const { data } = await api.post('/auth/verify-otp', payload)
//     return data
//   },

//   googleLogin: async (token: string): Promise<AuthResponse> => {
//     const { data } = await api.post('/auth/google', { token })
//     return data
//   },

//   getMe: async (): Promise<User> => {
//     const { data } = await api.get('/auth/me')
//     return data.user
//   },

//   logout: async (): Promise<void> => {
//     await api.post('/auth/logout')
//   },
// }



import api from '@/lib/axios'
import type { User } from '@/store/authStore'

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

export interface AuthResponse {
  user: User
  token: string
  message: string
}

// ── normalise: map API shape → app shape ──
function normaliseUser(raw: any): User {
  return {
    id:            raw.id,
    name:          raw.name,
    email:         raw.email,
    phone:         raw.phone ?? undefined,
    avatar:        raw.avatar ?? undefined,
    role:          (raw.role as string).toLowerCase() as User['role'],  // ADMIN → admin
    loyaltyPoints: raw.loyaltyPoints ?? 0,
    city:          raw.city ?? undefined,
  }
}

function normaliseResponse(data: any): AuthResponse {
  // handles both:
  //   { success, data: { token, user } }   ← your backend
  //   { token, user, message }              ← direct shape
  const payload = data?.data ?? data
  return {
    token:   payload.token,
    user:    normaliseUser(payload.user),
    message: data?.message ?? payload.message ?? 'Success',
  }
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload)
    return normaliseResponse(data)
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', payload)
    return normaliseResponse(data)
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me')
    const payload = data?.data ?? data
    return normaliseUser(payload.user ?? payload)
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout').catch(() => {})
  },
}