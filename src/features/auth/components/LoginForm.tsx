import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { useUIStore } from '@/store/uiStore'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoginLoading } = useAuth()
  const { openAuthModal } = useUIStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Email 
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all
            ${errors.email ? 'border-red-500/60' : 'border-white/10'}`}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <button type="button" className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Forgot password?
          </button>
        </div>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all
            ${errors.password ? 'border-red-500/60' : 'border-white/10'}`}
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoginLoading}
        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg shadow-red-600/20 hover:shadow-red-500/30 active:scale-[0.98]"
      >
        {isLoginLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Signing in…
          </span>
        ) : 'Sign In'}
      </button>

      {/* Divider */}
      {/* <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-gray-500">or continue with</span>
        <div className="flex-1 h-px bg-white/8" />
      </div> */}

      {/* Google */}
      {/* <button
        type="button"
        className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10
          text-white font-medium transition-all flex items-center justify-center gap-2.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button> */}

      {/* Switch to register */}
      <p className="text-center text-sm text-gray-500">
        New to BookMyShow?{' '}
        <button
          type="button"
          onClick={() => openAuthModal('register')}
          className="text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          Create account
        </button>
      </p>
    </form>
  )
}