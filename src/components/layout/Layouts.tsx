import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

// ─────────────────────────────────────────────
// PageLayout — standard pages (home, movies…)
// ─────────────────────────────────────────────
export function PageLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// ─────────────────────────────────────────────
// BookingLayout — minimal, no footer, progress bar
// ─────────────────────────────────────────────
export function BookingLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>
      {/* Minimal booking header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-6
          border-b"
        style={{
          background: 'rgba(8,8,16,0.95)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ background: '#E8172B' }}
          >
            B
          </div>
          <span className="font-bold text-white text-sm">BookMyShow</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span id="seat-timer">Seats held for 10:00</span>
        </div>
      </header>

      <main className="flex-1 pt-14">
        <Outlet />
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────
// AdminLayout — sidebar + content
// ─────────────────────────────────────────────
const ADMIN_NAV = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '🎬', label: 'Movies', href: '/admin/movies' },
  { icon: '🏛', label: 'Venues', href: '/admin/venues' },
  { icon: '🎭', label: 'Shows', href: '/admin/shows' },
  { icon: '🎟', label: 'Bookings', href: '/admin/bookings' },
  { icon: '💳', label: 'Payments', href: '/admin/payments' },
  { icon: '👥', label: 'Users', href: '/admin/users' },
  { icon: '⭐', label: 'Reviews', href: '/admin/reviews' },
]

export function AdminLayout() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#08080f' }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 border-r fixed top-0 bottom-0 left-0 z-30 flex flex-col"
        style={{
          background: 'linear-gradient(180deg,#0e0e1c 0%,#0a0a14 100%)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Sidebar logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ background: '#E8172B' }}
          >
            B
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">BookMyShow</p>
            <p className="text-[10px] text-red-400 font-medium tracking-wider">ADMIN</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest px-2 mb-3 mt-2">
            Management
          </p>
          {ADMIN_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5
                text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom user */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500
              flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin User</p>
              <p className="text-[10px] text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-20"
          style={{
            background: 'rgba(8,8,15,0.9)',
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <div>
            {/* Breadcrumb injected by individual page */}
            <div id="admin-breadcrumb" />
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400
              hover:text-white hover:bg-white/5 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}