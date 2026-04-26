// import type { useUIStore, Toast, ToastType } from '@/store/uiStore'
import { useUIStore } from '@/store/uiStore'
import type { Toast, ToastType } from '@/store/uiStore'
// import { useUIStore } from "@/store/uiStore";

const TOAST_STYLES: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: { bg: 'rgba(16,185,129,0.12)', icon: '✓', bar: '#10b981' },
  error:   { bg: 'rgba(239,68,68,0.12)',  icon: '✕', bar: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.12)', icon: '!', bar: '#f59e0b' },
  info:    { bg: 'rgba(59,130,246,0.12)', icon: 'i', bar: '#3b82f6' },
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useUIStore()
  const style = TOAST_STYLES[toast.type]

  return (
    <div
      className="relative flex items-start gap-3 px-4 py-3.5 rounded-2xl overflow-hidden max-w-sm w-full"
      style={{
        background: style.bg,
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Left bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: style.bar }}
      />

      {/* Icon */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: style.bar + '30', color: style.bar }}
      >
        {style.icon}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm text-white leading-snug pt-0.5">{toast.message}</p>

      {/* Close */}
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-gray-500 hover:text-white transition-colors mt-0.5"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useUIStore()
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}