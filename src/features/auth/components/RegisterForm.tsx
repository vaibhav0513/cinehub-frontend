import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useUIStore } from "@/store/uiStore";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
  </div>
);

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500
   focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all
   ${hasError ? "border-red-500/60" : "border-white/10"}`;

export function RegisterForm() {
  const { register: registerUser, isRegisterLoading } = useAuth();
  const { openAuthModal } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterForm) => {
    const { confirmPassword, ...payload } = data;
    registerUser(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Full name" error={errors.name?.message}>
        <input
          {...register("name")}
          placeholder="Rahul Sharma"
          className={inputClass(!!errors.name)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Email address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label="Mobile number" error={errors.phone?.message}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              +91
            </span>
            <input
              {...register("phone")}
              type="tel"
              placeholder="98765 43210"
              className={`${inputClass(!!errors.phone)} pl-12`}
            />
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Password" error={errors.password?.message}>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className={inputClass(!!errors.password)}
          />
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className={inputClass(!!errors.confirmPassword)}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isRegisterLoading}
        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg shadow-red-600/20 hover:shadow-red-500/30 active:scale-[0.98]"
      >
        {isRegisterLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Creating account…
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-xs text-gray-500 leading-relaxed">
        By signing up you agree to our{" "}
        <a href="/terms" className="text-red-400 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-red-400 hover:underline">
          Privacy Policy
        </a>
      </p>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
