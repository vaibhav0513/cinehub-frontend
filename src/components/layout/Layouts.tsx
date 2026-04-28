// import { Outlet } from 'react-router-dom'
// import { Navbar } from './Navbar'
// import { Footer } from './Footer'

// // ─────────────────────────────────────────────
// // PageLayout — standard pages (home, movies…)
// // ─────────────────────────────────────────────
// export function PageLayout() {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>
//       <Navbar />
//       <main className="flex-1 pt-16">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   )
// }

// // ─────────────────────────────────────────────
// // BookingLayout — minimal, no footer, progress bar
// // ─────────────────────────────────────────────
// export function BookingLayout() {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>
//       {/* Minimal booking header */}
//       <header
//         className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-6
//           border-b"
//         style={{
//           background: 'rgba(8,8,16,0.95)',
//           backdropFilter: 'blur(16px)',
//           borderColor: 'rgba(255,255,255,0.06)',
//         }}
//       >
//         <div className="flex items-center gap-2">
//           <div
//             className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
//             style={{ background: '#E8172B' }}
//           >
//             B
//           </div>
//           <span className="font-bold text-white text-sm">BookMyShow</span>
//         </div>

//         <div className="flex items-center gap-2 text-xs text-gray-400">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="12" cy="12" r="10"/>
//             <polyline points="12 6 12 12 16 14"/>
//           </svg>
//           <span id="seat-timer">Seats held for 10:00</span>
//         </div>
//       </header>

//       <main className="flex-1 pt-14">
//         <Outlet />
//       </main>
//     </div>
//   )
// }

// // ─────────────────────────────────────────────
// // AdminLayout — sidebar + content
// // ─────────────────────────────────────────────
// const ADMIN_NAV = [
//   { icon: '📊', label: 'Dashboard', href: '/admin' },
//   { icon: '🎬', label: 'Movies', href: '/admin/movies' },
//   { icon: '🏛', label: 'Venues', href: '/admin/venues' },
//   { icon: '🎭', label: 'Shows', href: '/admin/shows' },
//   { icon: '🎟', label: 'Bookings', href: '/admin/bookings' },
//   { icon: '💳', label: 'Payments', href: '/admin/payments' },
//   { icon: '👥', label: 'Users', href: '/admin/users' },
//   { icon: '⭐', label: 'Reviews', href: '/admin/reviews' },
// ]

// export function AdminLayout() {
//   return (
//     <div
//       className="min-h-screen flex"
//       style={{ background: '#08080f' }}
//     >
//       {/* Sidebar */}
//       <aside
//         className="w-60 shrink-0 border-r fixed top-0 bottom-0 left-0 z-30 flex flex-col"
//         style={{
//           background: 'linear-gradient(180deg,#0e0e1c 0%,#0a0a14 100%)',
//           borderColor: 'rgba(255,255,255,0.06)',
//         }}
//       >
//         {/* Sidebar logo */}
//         <div className="flex items-center gap-2.5 px-5 h-16 border-b"
//           style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
//           <div
//             className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
//             style={{ background: '#E8172B' }}
//           >
//             B
//           </div>
//           <div>
//             <p className="text-xs font-bold text-white leading-tight">BookMyShow</p>
//             <p className="text-[10px] text-red-400 font-medium tracking-wider">ADMIN</p>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 p-3 overflow-y-auto">
//           <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest px-2 mb-3 mt-2">
//             Management
//           </p>
//           {ADMIN_NAV.map((item) => (
//             <a
//               key={item.href}
//               href={item.href}
//               className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5
//                 text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
//             >
//               <span className="text-base">{item.icon}</span>
//               <span className="font-medium">{item.label}</span>
//             </a>
//           ))}
//         </nav>

//         {/* Bottom user */}
//         <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
//           <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/3">
//             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500
//               flex items-center justify-center text-white text-xs font-bold shrink-0">
//               A
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-semibold text-white truncate">Admin User</p>
//               <p className="text-[10px] text-gray-500">Super Admin</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Content */}
//       <div className="flex-1 ml-60 flex flex-col min-h-screen">
//         {/* Top bar */}
//         <header
//           className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-20"
//           style={{
//             background: 'rgba(8,8,15,0.9)',
//             backdropFilter: 'blur(16px)',
//             borderColor: 'rgba(255,255,255,0.06)',
//           }}
//         >
//           <div>
//             {/* Breadcrumb injected by individual page */}
//             <div id="admin-breadcrumb" />
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400
//               hover:text-white hover:bg-white/5 transition-all">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
//               </svg>
//             </button>
//           </div>
//         </header>

//         <main className="flex-1 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }



import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/features/auth'

// ─────────────────────────────────────────────
// PageLayout
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
// BookingLayout
// ─────────────────────────────────────────────
export function BookingLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>
      <header
        className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-6 border-b"
        style={{ background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ background: '#E8172B' }}>
            C
          </div>
          <span className="font-bold text-white text-sm">CineHubShow</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Seats held for 10:00</span>
        </div>
      </header>
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────
// AdminLayout
// ─────────────────────────────────────────────
const ADMIN_NAV = [
  { icon: '📊', label: 'Dashboard',  href: '/admin' },
  { icon: '🎬', label: 'Movies',     href: '/admin/movies' },
  { icon: '🏛',  label: 'Venues',    href: '/admin/venues' },
  { icon: '🎭', label: 'Shows',      href: '/admin/shows' },
  { icon: '🎟', label: 'Bookings',   href: '/admin/bookings' },
  { icon: '💳', label: 'Payments',   href: '/admin/payments' },
  { icon: '👥', label: 'Users',      href: '/admin/users' },
  { icon: '⭐', label: 'Reviews',    href: '/admin/reviews' },
  { icon: '📈', label: 'Analytics',  href: '/admin/analytics' },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (href: string) =>
    href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(href)

  return (
    <div className="flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg,#0d0d1b 0%,#09090f 100%)' }}>

      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
            style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 4px 12px rgba(232,23,43,0.35)' }}>
            C
          </div>
          <div>
            <p className="text-xs font-black text-white leading-tight tracking-tight">CineHubShow</p>
            <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: 9, color: '#ff3b5c' }}>Admin Panel</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pt-2 pb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#2a2a44' }}>
          Management
        </p>

        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} to={item.href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 relative"
              style={{
                background: active ? 'rgba(232,23,43,0.1)' : 'transparent',
                color: active ? '#fff' : '#555577',
                border: active ? '1px solid rgba(232,23,43,0.18)' : '1px solid transparent',
              }}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: '#E8172B' }} />
              )}
              <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#E8172B' }} />
              )}
            </Link>
          )
        })}

        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#2a2a44' }}>
            General
          </p>
          <Link to="/" onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/4 hover:text-white"
            style={{ color: '#555577' }}>
            <span className="text-base w-5 text-center">🌐</span>
            <span>View Site</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </Link>
        </div>
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#E8172B,#ff7a00)' }}>
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">{user?.name ?? 'Admin'}</p>
            <p className="truncate leading-tight mt-0.5" style={{ fontSize: 10, color: '#444466' }}>
              {user?.email ?? ''}
            </p>
          </div>
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-md capitalize shrink-0"
            style={{ background: 'rgba(232,23,43,0.12)', color: '#ff3b5c', fontSize: 9 }}>
            {user?.role ?? 'admin'}
          </span>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/5 hover:text-white"
          style={{ color: '#444466' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentNav = ADMIN_NAV.find(n =>
    n.href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(n.href)
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#08080f' }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 fixed top-0 bottom-0 left-0 z-30 border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full border-r z-10"
            style={{ borderColor: 'rgba(255,255,255,0.07)', animation: 'slideRight 0.22s cubic-bezier(0.22,1,0.36,1)' }}>
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60 min-w-0">

        {/* Top bar */}
        <header className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 border-b sticky top-0 z-20 shrink-0"
          style={{ background: 'rgba(8,8,15,0.97)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
              style={{ color: '#888' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <Link to="/admin" className="text-xs font-medium transition-colors hover:text-white hidden sm:block"
                style={{ color: '#333355' }}>
                Admin
              </Link>
              {currentNav && currentNav.href !== '/admin' && (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2a2a44" strokeWidth="2.5" className="hidden sm:block shrink-0">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  <span className="text-sm font-bold text-white truncate">{currentNav.label}</span>
                </>
              )}
              {(!currentNav || currentNav.href === '/admin') && (
                <span className="text-sm font-bold text-white">Dashboard</span>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick search — md+ */}
            <div className="relative hidden md:block">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="12" height="12"
                viewBox="0 0 24 24" fill="none" stroke="#444466" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Quick search…"
                className="pl-7 pr-3 py-1.5 rounded-lg text-xs text-white placeholder-gray-600 outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', width: 160 }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
            </div>

            {/* Notifications */}
            <button className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
              style={{ color: '#555577' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#E8172B' }} />
            </button>

            {/* Avatar (mobile — shows user initial) */}
            <div className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#E8172B,#ff7a00)' }}>
              {useAuthStore.getState().user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}