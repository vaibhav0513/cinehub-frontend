import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// ── Types ────────────────────────────────────────────────────
type SeatStatus = 'available' | 'taken' | 'selected' | 'locked' | 'blocked'
type SeatCategory = 'recliner' | 'premium' | 'executive' | 'classic'

interface Seat {
  id: string
  row: string
  number: number
  status: SeatStatus
  category: SeatCategory
  price: number
}

// ── Config ───────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<SeatCategory, { label: string; color: string; glow: string; price: number }> = {
  recliner:  { label: 'Recliner',  color: '#a78bfa', glow: 'rgba(167,139,250,0.35)', price: 799 },
  premium:   { label: 'Premium',   color: '#ffd166', glow: 'rgba(255,209,102,0.35)', price: 499 },
  executive: { label: 'Executive', color: '#4d9fff', glow: 'rgba(77,159,255,0.35)',  price: 349 },
  classic:   { label: 'Classic',   color: '#00e5a0', glow: 'rgba(0,229,160,0.25)',   price: 249 },
}

const SEAT_LAYOUT: { row: string; category: SeatCategory; count: number; gap?: number[] }[] = [
  { row: 'A', category: 'recliner',  count: 8,  gap: [4] },
  { row: 'B', category: 'recliner',  count: 8,  gap: [4] },
  { row: 'C', category: 'premium',   count: 10, gap: [5] },
  { row: 'D', category: 'premium',   count: 10, gap: [5] },
  { row: 'E', category: 'premium',   count: 10, gap: [5] },
  { row: 'F', category: 'executive', count: 12, gap: [6] },
  { row: 'G', category: 'executive', count: 12, gap: [6] },
  { row: 'H', category: 'executive', count: 12, gap: [6] },
  { row: 'I', category: 'classic',   count: 14, gap: [7] },
  { row: 'J', category: 'classic',   count: 14, gap: [7] },
  { row: 'K', category: 'classic',   count: 14, gap: [7] },
]

// Randomly taken seats (simulating real DB)
const TAKEN_SEED = new Set([
  'A-2','A-5','A-7','B-1','B-4','B-6',
  'C-2','C-3','C-8','D-5','D-9','E-1','E-7',
  'F-3','F-7','F-11','G-2','G-5','G-9',
  'H-1','H-6','H-10','I-3','I-8','I-13',
  'J-2','J-6','J-11','K-4','K-9','K-13',
])

// Simulate "others viewing" seats with TTL
const LOCKED_SEED = new Set(['C-5','C-6','F-5','F-6','I-5','I-6','I-7'])

// ── Generate seats ───────────────────────────────────────────
function generateSeats(): Seat[] {
  const seats: Seat[] = []
  SEAT_LAYOUT.forEach(({ row, category, count }) => {
    for (let n = 1; n <= count; n++) {
      const id = `${row}-${n}`
      let status: SeatStatus = 'available'
      if (TAKEN_SEED.has(id))  status = 'taken'
      if (LOCKED_SEED.has(id)) status = 'locked'
      seats.push({ id, row, number: n, status, category, price: CATEGORY_CONFIG[category].price })
    }
  })
  return seats
}

// ── Countdown timer ──────────────────────────────────────────
function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    if (remaining <= 0) { setExpired(true); return }
    const t = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(t)
  }, [remaining])
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return { display: `${mm}:${ss}`, expired, remaining }
}

// ── Seat chip ────────────────────────────────────────────────
function SeatChip({
  seat,
  isSelected,
  onClick,
}: {
  seat: Seat
  isSelected: boolean
  onClick: () => void
}) {
  const cfg = CATEGORY_CONFIG[seat.category]
  const isAvailable = seat.status === 'available'
  const isTaken    = seat.status === 'taken'
  const isLocked   = seat.status === 'locked'
  const isBlocked  = seat.status === 'blocked'

  let bg = 'rgba(255,255,255,0.06)'
  let border = 'rgba(255,255,255,0.1)'
  let cursor = 'pointer'
  let opacity = 1

  if (isSelected) {
    bg = cfg.color
    border = cfg.color
  } else if (isTaken || isBlocked) {
    bg = 'rgba(255,255,255,0.04)'
    border = 'rgba(255,255,255,0.06)'
    opacity = 0.35
    cursor = 'not-allowed'
  } else if (isLocked) {
    bg = 'rgba(255,122,0,0.15)'
    border = 'rgba(255,122,0,0.4)'
    cursor = 'not-allowed'
  } else if (isAvailable) {
    bg = `${cfg.color}15`
    border = `${cfg.color}40`
  }

  return (
    <button
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      title={`${seat.row}${seat.number} · ₹${seat.price}${isTaken ? ' · Taken' : isLocked ? ' · Being viewed' : ''}`}
      className="relative flex items-center justify-center rounded-md transition-all duration-150 text-xs font-bold select-none"
      style={{
        width: 28, height: 26,
        background: bg,
        border: `1px solid ${border}`,
        opacity,
        cursor,
        color: isSelected ? '#fff' : isTaken || isBlocked ? 'transparent' : cfg.color,
        boxShadow: isSelected ? `0 0 12px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.4)` : 'none',
        transform: isSelected ? 'scale(1.12)' : 'scale(1)',
      }}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#ff7a00' }} />
        </div>
      )}
      {!isTaken && !isBlocked && !isLocked && (
        <span style={{ fontSize: 9 }}>{seat.number}</span>
      )}
      {(isTaken || isBlocked) && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
        </svg>
      )}
    </button>
  )
}

// ── Show info mock ───────────────────────────────────────────
const SHOW_INFO = {
  movie: 'Kalki 2898 AD',
  venue: 'PVR ICON Versova',
  screen: 'Screen 3 — IMAX',
  date: 'Today, Dec 21',
  time: '09:45 AM',
  format: 'IMAX',
  lang: 'Telugu',
}

const MAX_SEATS = 8

// ── Main component ───────────────────────────────────────────
export default function SeatPickerPage() {
  const { showId } = useParams<{ showId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [seats, setSeats] = useState<Seat[]>(generateSeats)
  const [selected, setSelected] = useState<Seat[]>([])
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [showConfirm, setShowConfirm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { display: timerDisplay, expired, remaining } = useCountdown(10 * 60)
  const timerUrgent = remaining <= 120

  // Simulate real-time: randomly lock a seat every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      setSeats(prev => {
        const available = prev.filter(s => s.status === 'available' && !selected.find(sel => sel.id === s.id))
        if (!available.length) return prev
        const pick = available[Math.floor(Math.random() * available.length)]
        return prev.map(s => s.id === pick.id ? { ...s, status: 'locked' } : s)
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [selected])

  const toggleSeat = useCallback((seat: Seat) => {
    if (seat.status !== 'available') return
    setSelected(prev => {
      const already = prev.find(s => s.id === seat.id)
      if (already) return prev.filter(s => s.id !== seat.id)
      if (prev.length >= MAX_SEATS) return prev
      return [...prev, seat]
    })
  }, [])

  const subtotal = selected.reduce((sum, s) => sum + s.price, 0)
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0
  const convenience = selected.length > 0 ? selected.length * 29 : 0
  const total = subtotal - discount + convenience

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'BMS10') {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setCouponApplied(false)
    }
  }

  const handleProceed = () => {
    if (!selected.length) return
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    navigate(`/book/${showId}/checkout`, {
      state: { seats: selected, total, showInfo: SHOW_INFO }
    })
  }

  // Group seats by row
  const seatsByRow = SEAT_LAYOUT.map(layout => ({
    ...layout,
    seats: seats.filter(s => s.row === layout.row),
  }))

  return (
    <div style={{ background: '#07070e', minHeight: '100vh', color: '#e2e2f0' }}>

      {/* ── TOP BAR ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 h-14 border-b"
        style={{ background: 'rgba(7,7,14,0.98)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 40 }}>

        <div className="flex items-center gap-4">
          <Link to={`/movies/1`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </Link>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <p className="text-sm font-bold text-white leading-none">{SHOW_INFO.movie}</p>
            <p className="text-xs mt-0.5" style={{ color: '#555577' }}>
              {SHOW_INFO.venue} · {SHOW_INFO.date} · {SHOW_INFO.time} · {SHOW_INFO.format}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${timerUrgent ? 'animate-pulse' : ''}`}
          style={{
            background: timerUrgent ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${timerUrgent ? 'rgba(232,23,43,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: timerUrgent ? '#ff3b5c' : '#aaa',
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {timerDisplay}
        </div>
      </div>

      {/* ── STEPS ───────────────────────────────────── */}
      <div className="flex items-center justify-center gap-0 px-6 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {[
          { n: 1, label: 'Select Seats', active: true, done: false },
          { n: 2, label: 'Checkout', active: false, done: false },
          { n: 3, label: 'Payment', active: false, done: false },
        ].map((step, i) => (
          <div key={step.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: step.active ? '#E8172B' : 'rgba(255,255,255,0.06)',
                  color: step.active ? '#fff' : '#444466',
                }}>
                {step.n}
              </div>
              <span className="text-xs font-semibold hidden sm:block" style={{ color: step.active ? '#fff' : '#444466' }}>
                {step.label}
              </span>
            </div>
            {i < 2 && (
              <div className="w-12 sm:w-20 h-px mx-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── MAIN ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">

        {/* ── SEAT MAP ────────────────────────────── */}
        <div className="flex-1 min-w-0" ref={containerRef}>

          {/* Screen */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-full max-w-lg">
              <div
                className="h-2 rounded-b-full mx-auto"
                style={{
                  width: '90%',
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)',
                  boxShadow: '0 4px 32px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.06)',
                }}
              />
              <div
                className="h-8 rounded-b-full mx-auto opacity-20"
                style={{
                  width: '80%',
                  background: 'linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)',
                  marginTop: -2,
                }}
              />
            </div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mt-3" style={{ color: '#333355' }}>
              Screen · All eyes here
            </p>
          </div>

          {/* Category legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(Object.entries(CATEGORY_CONFIG) as [SeatCategory, typeof CATEGORY_CONFIG[SeatCategory]][]).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-5 h-4 rounded-sm" style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}50` }} />
                <span className="text-xs font-medium" style={{ color: '#666688' }}>
                  {cfg.label} <span className="font-bold" style={{ color: cfg.color }}>₹{cfg.price}</span>
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 rounded-sm" style={{ background: 'rgba(255,122,0,0.15)', border: '1px solid rgba(255,122,0,0.4)' }} />
              <span className="text-xs font-medium" style={{ color: '#666688' }}>Being viewed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 rounded-sm opacity-40" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
              <span className="text-xs font-medium" style={{ color: '#666688' }}>Taken</span>
            </div>
          </div>

          {/* Seat rows */}
          <div className="overflow-x-auto pb-4">
            <div className="inline-block min-w-full">
              {seatsByRow.map(({ row, category, seats: rowSeats, gap }) => {
                const cfg = CATEGORY_CONFIG[category]
                return (
                  <div key={row} className="flex items-center gap-2 mb-2" style={{ minWidth: 'max-content' }}>
                    {/* Row label */}
                    <span className="text-xs font-bold w-5 text-center shrink-0" style={{ color: '#333355' }}>
                      {row}
                    </span>

                    {/* Seats with aisle gap */}
                    <div className="flex items-center gap-1.5">
                      {rowSeats.map((seat, i) => {
                        const isAfterGap = gap?.includes(i)
                        return (
                          <div key={seat.id} className="flex items-center gap-1.5">
                            {isAfterGap && (
                              <div className="w-4 shrink-0" />
                            )}
                            <div
                              onMouseEnter={(e) => {
                                if (seat.status === 'available' || seat.status === 'selected') {
                                  setHoveredSeat(seat)
                                  const rect = (e.target as HTMLElement).getBoundingClientRect()
                                  setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 })
                                }
                              }}
                              onMouseLeave={() => setHoveredSeat(null)}
                            >
                              <SeatChip
                                seat={{ ...seat, status: selected.find(s => s.id === seat.id) ? 'selected' : seat.status }}
                                isSelected={!!selected.find(s => s.id === seat.id)}
                                onClick={() => toggleSeat(seat)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Row label right */}
                    <span className="text-xs font-bold w-5 text-center shrink-0" style={{ color: '#333355' }}>
                      {row}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Seat tooltip */}
          {hoveredSeat && (
            <div
              className="fixed z-50 px-3 py-2 rounded-xl text-xs font-semibold pointer-events-none"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
                transform: 'translate(-50%, -100%)',
                background: 'rgba(14,14,28,0.97)',
                border: `1px solid ${CATEGORY_CONFIG[hoveredSeat.category].color}40`,
                color: CATEGORY_CONFIG[hoveredSeat.category].color,
                backdropFilter: 'blur(12px)',
                boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${CATEGORY_CONFIG[hoveredSeat.category].color}20`,
              }}
            >
              {hoveredSeat.row}{hoveredSeat.number} · {CATEGORY_CONFIG[hoveredSeat.category].label} · ₹{hoveredSeat.price}
            </div>
          )}

          {/* Selection limit warning */}
          {selected.length >= MAX_SEATS && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Maximum {MAX_SEATS} seats per booking
            </div>
          )}
        </div>

        {/* ── BOOKING SUMMARY ─────────────────────── */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-4">

            {/* Selected seats display */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Selected Seats</h3>
                  {selected.length > 0 && (
                    <button onClick={() => setSelected([])} className="text-xs font-semibold transition-colors hover:text-red-400" style={{ color: '#555577' }}>
                      Clear all
                    </button>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#444466' }}>
                  {selected.length} of {MAX_SEATS} max selected
                </p>
              </div>

              <div className="p-5">
                {selected.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">💺</div>
                    <p className="text-xs" style={{ color: '#444466' }}>Click seats on the map to select</p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {selected.map(seat => {
                      const cfg = CATEGORY_CONFIG[seat.category]
                      return (
                        <div key={seat.id} className="flex items-center justify-between py-2 px-3 rounded-xl"
                          style={{ background: `${cfg.color}0d`, border: `1px solid ${cfg.color}25` }}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                              style={{ background: cfg.color, color: '#fff' }}>
                              {seat.row}{seat.number}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{cfg.label}</p>
                              <p className="text-xs" style={{ color: '#444466' }}>Row {seat.row}, Seat {seat.number}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">₹{seat.price}</span>
                            <button onClick={() => toggleSeat(seat)}
                              className="w-5 h-5 rounded-full flex items-center justify-center transition-all hover:bg-red-500/20"
                              style={{ color: '#555577' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Price breakdown */}
                {selected.length > 0 && (
                  <div className="space-y-2 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#666688' }}>Subtotal ({selected.length} tickets)</span>
                      <span className="text-white font-medium">₹{subtotal}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#00e5a0' }}>Coupon BMS10 (-10%)</span>
                        <span style={{ color: '#00e5a0' }} className="font-medium">−₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#666688' }}>Convenience fee</span>
                      <span className="text-white font-medium">₹{convenience}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-white">Total</span>
                      <span className="text-white">₹{total}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coupon */}
            {selected.length > 0 && (
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#555577' }}>Coupon Code</p>
                {couponApplied ? (
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-xs font-bold" style={{ color: '#00e5a0' }}>BMS10 applied! You save ₹{discount}</span>
                    </div>
                    <button onClick={() => { setCouponApplied(false); setCoupon('') }}
                      className="text-xs" style={{ color: '#555577' }}>Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={coupon} onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError('') }}
                      placeholder="Enter code (try BMS10)"
                      className="flex-1 px-3 py-2.5 rounded-xl text-xs text-white placeholder-gray-600 outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${couponError ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    />
                    <button onClick={applyCoupon}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold text-white shrink-0"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs mt-1.5" style={{ color: '#ff3b5c' }}>{couponError}</p>
                )}
              </div>
            )}

            {/* Proceed button */}
            <button
              onClick={handleProceed}
              disabled={selected.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: selected.length > 0
                  ? 'linear-gradient(135deg,#E8172B,#c4111f)'
                  : 'rgba(255,255,255,0.05)',
                boxShadow: selected.length > 0 ? '0 8px 32px rgba(232,23,43,0.35)' : 'none',
              }}
            >
              {selected.length === 0
                ? 'Select seats to continue'
                : `Proceed to Pay · ₹${total}`}
            </button>

            {/* Info note */}
            <p className="text-center text-xs" style={{ color: '#333355' }}>
              🔒 Seats reserved for {timerDisplay} · Powered by secure checkout
            </p>
          </div>
        </div>
      </div>

      {/* ── CONFIRM MODAL ───────────────────────────── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg,#0e0e1c,#0a0a14)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#E8172B,transparent)' }} />

            <div className="p-6">
              <h3 className="font-black text-white text-lg mb-1">Confirm Booking</h3>
              <p className="text-xs mb-5" style={{ color: '#555577' }}>Review your selection before proceeding</p>

              {/* Show details */}
              <div className="rounded-xl p-4 mb-4 space-y-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-bold text-white text-sm">{SHOW_INFO.movie}</p>
                <p className="text-xs" style={{ color: '#666688' }}>{SHOW_INFO.venue} · {SHOW_INFO.screen}</p>
                <p className="text-xs" style={{ color: '#666688' }}>{SHOW_INFO.date} · {SHOW_INFO.time} · {SHOW_INFO.format}</p>
              </div>

              {/* Selected seats */}
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.map(seat => {
                  const cfg = CATEGORY_CONFIG[seat.category]
                  return (
                    <span key={seat.id} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                      {seat.row}{seat.number}
                    </span>
                  )
                })}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-3 border-y mb-5"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-semibold text-white">Total Amount</span>
                <span className="text-xl font-black text-white">₹{total}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Change Seats
                </button>
                <button onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 6px 24px rgba(232,23,43,0.4)' }}>
                  Pay ₹{total}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.92) translateY(12px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}