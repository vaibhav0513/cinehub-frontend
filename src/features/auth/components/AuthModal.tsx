import { useEffect, useRef } from "react";
import  { useUIStore } from "@/store/uiStore";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
  const { authModalOpen, closeAuthModal, activeAuthTab, openAuthModal } =
    useUIStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      e.key === "Escape" && closeAuthModal();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeAuthModal]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = authModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && closeAuthModal()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #141422 0%, #0e0e1a 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,59,92,0.1)",
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #ff3b5c80, transparent)",
          }}
        />

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center
            text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-7">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: "#E8172B" }}
            >
              C
            </div>
            <span className="font-bold text-white tracking-tight">
              CineHub
            </span>
          </div>

          {/* Tab switcher */}
          {/* <div
            className="flex rounded-xl p-1 mb-7"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => openAuthModal(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeAuthTab === tab
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div> */}

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white leading-tight">
              {activeAuthTab === "login"
                ? "Welcome back 👋"
                : "Join the show 🎬"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeAuthTab === "login"
                ? "Sign in to book tickets, view history & more."
                : "Create your account and start booking in seconds."}
            </p>
          </div>

          {/* Form */}
          <div style={{ animation: "fadeIn 0.2s ease" }} key={activeAuthTab}>
            {activeAuthTab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
