import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/features/auth'

const NAV_LINKS = [
  { label: 'Movies', href: '/movies' },
  { label: 'Events', href: '/events' },
  { label: 'Sports', href: '/sports' },
  { label: 'Plays', href: '/plays' },
]

export function Navbar() {
  const { user, isLoggedIn, isAdmin } = useAuthStore()
  const { openAuthModal, openCityModal, setMobileNav, mobileNavOpen } = useUIStore()
  const { logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Call them as functions
const loggedIn = isLoggedIn()
const admin = isAdmin()
  const navigate = useNavigate()

  // Scroll detection for glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm
                shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #E8172B, #c4111f)' }}
            >
              C
            </div>
            <span className="font-bold text-white tracking-tight hidden sm:block">
              Cine<span className="text-red-500">Hub</span>Show
            </span>
          </Link>

          {/* ── City selector ── */}
          <button
            onClick={openCityModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <span>Mumbai</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* ── Search ── */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, events…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-500
                  bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50
                  focus:bg-white/8 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
            </div>
          </form>

          {/* ── Nav links ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400
                  hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 ml-auto">
            {loggedIn  ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                    hover:bg-white/5 transition-all group"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500
                    flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden sm:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <svg
                    className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden
                      shadow-2xl shadow-black/50"
                    style={{
                      background: 'linear-gradient(145deg,#1a1a2e,#141428)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      animation: 'dropIn 0.15s ease',
                    }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                          🌟 {user?.loyaltyPoints ?? 0} pts
                        </span>
                        {user?.role !== 'user' && (
                          <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-medium capitalize">
                            {user?.role}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="p-1.5">
                      {[
                        { icon: '🎟', label: 'My Bookings', href: '/profile/bookings' },
                        { icon: '❤️', label: 'Wishlist', href: '/profile/wishlist' },
                        { icon: '👤', label: 'Profile', href: '/profile' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                            text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      {admin  && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                            text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                        >
                          <span>⚙️</span>
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    <div className="p-1.5 border-t border-white/5">
                      <button
                        onClick={() => { logout(); setDropdownOpen(false) }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                          text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold
                  transition-all shadow-lg shadow-red-600/25 hover:shadow-red-500/35 active:scale-[0.97]"
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNav(!mobileNavOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl
                text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileNavOpen
                  ? <path d="M18 6L6 18M6 6l12 12"/>
                  : <><path d="M3 12h18M3 6h18M3 18h18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile nav ── */}
        {mobileNavOpen && (
          <div
            className="lg:hidden border-t border-white/5 py-4"
            style={{ animation: 'slideDown 0.2s ease' }}
          >
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, events…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500
                    bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-all"
                />
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileNav(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300
                    hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}