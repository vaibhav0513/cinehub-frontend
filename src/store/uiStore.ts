import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface UIState {
  // Modals
  authModalOpen: boolean
  cityModalOpen: boolean
  activeAuthTab: 'login' | 'register'

  // Toast
  toasts: Toast[]

  // Mobile nav
  mobileNavOpen: boolean

  // Actions
  openAuthModal: (tab?: 'login' | 'register') => void
  closeAuthModal: () => void
  openCityModal: () => void
  closeCityModal: () => void
  setMobileNav: (open: boolean) => void
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      authModalOpen: false,
      cityModalOpen: false,
      activeAuthTab: 'login',
      toasts: [],
      mobileNavOpen: false,

      openAuthModal: (tab = 'login') =>
        set({ authModalOpen: true, activeAuthTab: tab }),
      closeAuthModal: () => set({ authModalOpen: false }),

      openCityModal: () => set({ cityModalOpen: true }),
      closeCityModal: () => set({ cityModalOpen: false }),

      setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),

      addToast: (type, message, duration = 4000) => {
        const id = Math.random().toString(36).slice(2)
        set((state) => ({ toasts: [...state.toasts, { id, type, message, duration }] }))
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, duration)
      },

      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    { name: 'UIStore' }
  )
)