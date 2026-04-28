import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// ── Types ─────────────────────────────────────────────────────
interface StatCard {
  label: string
  value: string
  change: string
  positive: boolean
  icon: string
  color: string
  sub: string
}

interface Booking {
  id: string
  user: string
  movie: string
  venue: string
  seats: string[]
  amount: number
  status: 'confirmed' | 'cancelled' | 'pending'
  time: string
  format: string
}

interface Activity {
  id: string
  type: 'booking' | 'cancel' | 'user' | 'movie' | 'review'
  text: string
  time: string
  icon: string
  color: string
}

// ── Mock data ──────────────────────────────────────────────────
const STATS: StatCard[] = [
  {
    label: 'Total Revenue',
    value: '₹24,82,350',
    change: '+18.2%',
    positive: true,
    icon: '💰',
    color: '#00e5a0',
    sub: 'vs last month',
  },
  {
    label: 'Total Bookings',
    value: '8,431',
    change: '+12.5%',
    positive: true,
    icon: '🎟',
    color: '#4d9fff',
    sub: 'vs last month',
  },
  {
    label: 'Active Movies',
    value: '42',
    change: '+3',
    positive: true,
    icon: '🎬',
    color: '#a78bfa',
    sub: 'currently showing',
  },
  {
    label: 'Cancellation Rate',
    value: '4.2%',
    change: '-1.1%',
    positive: true,
    icon: '❌',
    color: '#ffd166',
    sub: 'vs last month',
  },
]

const RECENT_BOOKINGS: Booking[] = [
  { id: 'BK001', user: 'Rahul Sharma',    movie: 'Kalki 2898 AD',        venue: 'PVR ICON Versova',         seats: ['C3','C4'],         amount: 998,  status: 'confirmed', time: '2 min ago',   format: 'IMAX' },
  { id: 'BK002', user: 'Priya Mehta',     movie: 'Stree 2',              venue: 'INOX R-City',              seats: ['F5','F6','F7'],     amount: 1047, status: 'confirmed', time: '8 min ago',   format: '4DX'  },
  { id: 'BK003', user: 'Arjun Kapoor',    movie: 'Pushpa 2',             venue: 'Cinepolis Fun Republic',   seats: ['H2'],              amount: 349,  status: 'pending',   time: '15 min ago',  format: '2D'   },
  { id: 'BK004', user: 'Sneha Patil',     movie: 'Vettaiyan',            venue: 'PVR Phoenix Mills',        seats: ['A1','A2'],         amount: 1598, status: 'confirmed', time: '22 min ago',  format: 'IMAX' },
  { id: 'BK005', user: 'Karan Johar',     movie: 'Singham Again',        venue: 'INOX Megaplex',            seats: ['D8','D9','D10'],   amount: 1047, status: 'cancelled', time: '35 min ago',  format: '2D'   },
  { id: 'BK006', user: 'Deepa Nair',      movie: 'Lucky Baskhar',        venue: 'Cinepolis Viviana',        seats: ['G5','G6'],         amount: 598,  status: 'confirmed', time: '1 hr ago',    format: '2D'   },
  { id: 'BK007', user: 'Vikram Singh',    movie: 'Kalki 2898 AD',        venue: 'PVR ICON Versova',         seats: ['B4'],              amount: 799,  status: 'confirmed', time: '1 hr ago',    format: 'IMAX' },
]

const ACTIVITY: Activity[] = [
  { id: 'a1', type: 'booking', text: 'New booking #BK008 — Kalki 2898 AD × 2 seats', time: '1 min ago',   icon: '🎟', color: '#00e5a0' },
  { id: 'a2', type: 'user',    text: 'New user registered — meera.k@gmail.com',        time: '5 min ago',   icon: '👤', color: '#4d9fff' },
  { id: 'a3', type: 'cancel',  text: 'Booking #BK005 cancelled — refund initiated',    time: '18 min ago',  icon: '❌', color: '#ff3b5c' },
  { id: 'a4', type: 'review',  text: 'New 9/10 review on Stree 2 by Priya M.',         time: '32 min ago',  icon: '⭐', color: '#ffd166' },
  { id: 'a5', type: 'movie',   text: 'New movie added — Devara Part 2',                time: '1 hr ago',    icon: '🎬', color: '#a78bfa' },
  { id: 'a6', type: 'booking', text: 'New booking #BK007 — IMAX Kalki × 1 seat',      time: '1 hr ago',    icon: '🎟', color: '#00e5a0' },
  { id: 'a7', type: 'user',    text: 'User vikram.s@gmail.com updated profile',        time: '2 hrs ago',   icon: '👤', color: '#4d9fff' },
]

// Revenue data for 7 days
const REVENUE_DATA = [
  { day: 'Mon', revenue: 142000, bookings: 312 },
  { day: 'Tue', revenue: 98000,  bookings: 198 },
  { day: 'Wed', revenue: 175000, bookings: 421 },
  { day: 'Thu', revenue: 132000, bookings: 287 },
  { day: 'Fri', revenue: 289000, bookings: 634 },
  { day: 'Sat', revenue: 342000, bookings: 812 },
  { day: 'Sun', revenue: 298000, bookings: 701 },
]

const TOP_MOVIES = [
  { title: 'Kalki 2898 AD',   bookings: 2341, revenue: '₹8,42,350', occupancy: 92, color: '#ff3b5c' },
  { title: 'Stree 2',         bookings: 1892, revenue: '₹6,21,400', occupancy: 88, color: '#ffd166' },
  { title: 'Pushpa 2',        bookings: 1453, revenue: '₹4,98,200', occupancy: 76, color: '#4d9fff' },
  { title: 'Vettaiyan',       bookings: 987,  revenue: '₹3,12,800', occupancy: 68, color: '#a78bfa' },
  { title: 'Lucky Baskhar',   bookings: 743,  revenue: '₹2,18,600', occupancy: 61, color: '#00e5a0' },
]

// ── Status badge ───────────────────────────────────────────────
function StatusBadge({ status }: { status: Booking['status'] }) {
  const map = {
    confirmed: { bg: 'rgba(0,229,160,0.12)', color: '#00e5a0', label: 'Confirmed' },
    pending:   { bg: 'rgba(255,209,102,0.12)', color: '#ffd166', label: 'Pending' },
    cancelled: { bg: 'rgba(232,23,43,0.12)', color: '#ff3b5c', label: 'Cancelled' },
  }
  const s = map[status]
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

// ── Mini bar chart ─────────────────────────────────────────────
function RevenueChart() {
  const max = Math.max(...REVENUE_DATA.map(d => d.revenue))
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-end gap-2 h-36 pt-4">
      {REVENUE_DATA.map((d, i) => {
        const pct = (d.revenue / max) * 100
        const isHov = hovered === i
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {/* Tooltip */}
            <div className="relative">
              {isHov && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap z-10"
                  style={{ background: 'rgba(14,14,28,0.97)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  ₹{(d.revenue / 1000).toFixed(0)}K
                  <div className="text-xs font-normal" style={{ color: '#555577' }}>{d.bookings} bookings</div>
                </div>
              )}
            </div>
            {/* Bar */}
            <div className="w-full rounded-t-lg transition-all duration-300 relative overflow-hidden"
              style={{
                height: `${pct}%`,
                minHeight: 8,
                background: isHov
                  ? 'linear-gradient(to top,#E8172B,#ff6b6b)'
                  : 'linear-gradient(to top,rgba(232,23,43,0.8),rgba(232,23,43,0.3))',
                boxShadow: isHov ? '0 0 16px rgba(232,23,43,0.4)' : 'none',
              }}>
              {/* Shimmer */}
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', animation: 'shimmer 2s infinite' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: isHov ? '#fff' : '#444466' }}>{d.day}</span>
          </div>
        )
      })}
      <style>{`
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
      `}</style>
    </div>
  )
}

// ── Donut chart ────────────────────────────────────────────────
function DonutChart() {
  const data = [
    { label: 'UPI',         value: 48, color: '#4d9fff' },
    { label: 'Card',        value: 31, color: '#a78bfa' },
    { label: 'Wallet',      value: 13, color: '#ffd166' },
    { label: 'Net Banking', value: 8,  color: '#00e5a0' },
  ]
  const r = 48
  const circ = 2 * Math.PI * r
  let cumulative = 0

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
        {data.map((seg, i) => {
          const dash = (seg.value / 100) * circ
          const offset = circ - cumulative * circ / 100
          cumulative += seg.value
          return (
            <circle key={i} cx="60" cy="60" r={r} fill="none"
              stroke={seg.color} strokeWidth="16"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'all 1s ease' }}
            />
          )
        })}
        <text x="60" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">₹</text>
        <text x="60" y="70" textAnchor="middle" fill="#555577" fontSize="9">payments</text>
      </svg>
      <div className="space-y-2.5">
        {data.map(seg => (
          <div key={seg.label} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
            <span className="text-xs" style={{ color: '#666688' }}>{seg.label}</span>
            <span className="text-xs font-bold text-white ml-auto pl-4">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'pending'>('all')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [searchBooking, setSearchBooking] = useState('')

  const filteredBookings = RECENT_BOOKINGS.filter(b => {
    const matchStatus = bookingFilter === 'all' || b.status === bookingFilter
    const matchSearch = !searchBooking ||
      b.user.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.movie.toLowerCase().includes(searchBooking.toLowerCase()) ||
      b.id.toLowerCase().includes(searchBooking.toLowerCase())
    return matchStatus && matchSearch
  })

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div style={{ color: '#e2e2f0' }}>

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555577' }}>
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </p>
          <h1 className="font-black text-white" style={{ fontSize: 'clamp(22px,3vw,32px)', fontFamily: "'Bebas Neue','Impact',sans-serif", letterSpacing: '0.5px' }}>
            Dashboard
          </h1>
          <p className="text-xs mt-1" style={{ color: '#444466' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['7d','30d','90d'] as const).map(r => (
              <button key={r} onClick={() => setTimeRange(r)}
                className="px-3 py-2 text-xs font-bold transition-all"
                style={{
                  background: timeRange === r ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.03)',
                  color: timeRange === r ? '#ff3b5c' : '#555577',
                }}>
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 4px 16px rgba(232,23,43,0.3)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* ── Stat cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <div key={stat.label}
            className="rounded-2xl p-5 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              animation: `cardIn 0.4s ease ${i * 0.08}s both`,
            }}>
            {/* Glow */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle,${stat.color},transparent)` }} />

            <div className="flex items-start justify-between mb-3">
              <div className="text-xl">{stat.icon}</div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: stat.positive ? 'rgba(0,229,160,0.1)' : 'rgba(232,23,43,0.1)', color: stat.positive ? '#00e5a0' : '#ff3b5c' }}>
                {stat.change}
              </span>
            </div>
            <p className="font-black text-white mb-1" style={{ fontSize: 'clamp(18px,2vw,26px)', fontFamily: "'Bebas Neue',sans-serif" }}>
              {stat.value}
            </p>
            <p className="text-xs font-semibold" style={{ color: '#555577' }}>{stat.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#333355' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-white text-sm">Revenue Overview</h3>
              <p className="text-xs mt-0.5" style={{ color: '#444466' }}>Last 7 days · ₹14.76L total</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#E8172B' }} />
              <span className="text-xs" style={{ color: '#555577' }}>Revenue</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Payment split */}
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="font-bold text-white text-sm mb-1">Payment Methods</h3>
          <p className="text-xs mb-5" style={{ color: '#444466' }}>Split this month</p>
          <DonutChart />
        </div>
      </div>

      {/* ── Top movies + Activity ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

        {/* Top movies */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="font-bold text-white text-sm">Top Performing Movies</h3>
            <Link to="/admin/movies" className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {TOP_MOVIES.map((movie, i) => (
              <div key={movie.title} className="flex items-center gap-4"
                style={{ animation: `cardIn 0.4s ease ${i * 0.07}s both` }}>
                <span className="text-xs font-black w-4 shrink-0" style={{ color: '#333355' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                    <span className="text-xs font-bold shrink-0 ml-3" style={{ color: movie.color }}>
                      {movie.occupancy}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${movie.occupancy}%`, background: movie.color }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs" style={{ color: '#444466' }}>{movie.bookings.toLocaleString()} bookings</span>
                    <span className="text-xs font-medium text-white">{movie.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="font-bold text-white text-sm">Live Activity</h3>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#00e5a0' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
            {ACTIVITY.map((item, i) => (
              <div key={item.id} className="flex items-start gap-3 px-2 py-2.5 rounded-xl transition-all hover:bg-white/3"
                style={{ animation: `cardIn 0.3s ease ${i * 0.05}s both` }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0"
                  style={{ background: item.color + '15', border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed text-white">{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#444466' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent bookings table ─────────────────────── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Table header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="font-bold text-white text-sm">Recent Bookings</h3>
            <p className="text-xs mt-0.5" style={{ color: '#444466' }}>{filteredBookings.length} results</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12"
                viewBox="0 0 24 24" fill="none" stroke="#555577" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={searchBooking} onChange={e => setSearchBooking(e.target.value)}
                placeholder="Search bookings…"
                className="pl-8 pr-3 py-2 rounded-xl text-xs text-white placeholder-gray-600 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', width: 180 }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Filter tabs */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['all','confirmed','pending','cancelled'] as const).map(f => (
                <button key={f} onClick={() => setBookingFilter(f)}
                  className="px-3 py-2 text-xs font-bold capitalize transition-all"
                  style={{
                    background: bookingFilter === f ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.03)',
                    color: bookingFilter === f ? '#ff3b5c' : '#555577',
                  }}>
                  {f}
                </button>
              ))}
            </div>

            <Link to="/admin/bookings" className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
              View all →
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Booking ID','Customer','Movie','Venue','Seats','Amount','Format','Status','Time'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#333355' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, i) => (
                <tr key={booking.id}
                  className="transition-colors hover:bg-white/2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', animation: `cardIn 0.3s ease ${i * 0.04}s both` }}>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono font-bold" style={{ color: '#4d9fff' }}>
                      #{booking.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg,#E8172B,#ff7a00)' }}>
                        {booking.user[0]}
                      </div>
                      <span className="text-xs font-medium text-white whitespace-nowrap">{booking.user}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-white whitespace-nowrap">{booking.movie}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs whitespace-nowrap" style={{ color: '#666688' }}>{booking.venue}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {booking.seats.map(s => (
                        <span key={s} className="text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: 'rgba(255,255,255,0.07)', color: '#aaa' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-white">₹{booking.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(255,255,255,0.07)', color: '#ccc' }}>
                      {booking.format}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs whitespace-nowrap" style={{ color: '#444466' }}>{booking.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm font-semibold text-white mb-1">No bookings found</p>
              <p className="text-xs" style={{ color: '#444466' }}>Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Add Movie',    icon: '🎬', href: '/admin/movies',   color: '#a78bfa' },
          { label: 'Add Venue',    icon: '🏛',  href: '/admin/venues',   color: '#4d9fff' },
          { label: 'Schedule Show',icon: '🎭',  href: '/admin/shows',    color: '#ffd166' },
          { label: 'View Reports', icon: '📊',  href: '/admin/analytics',color: '#00e5a0' },
        ].map(item => (
          <Link key={item.label} to={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:translate-y-[-2px] hover:border-white/15"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
              style={{ background: item.color + '15', border: `1px solid ${item.color}25` }}>
              {item.icon}
            </div>
            <span className="text-xs font-bold text-white">{item.label}</span>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}