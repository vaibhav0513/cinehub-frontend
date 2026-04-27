import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ALL_MOVIES } from '@/features/movies/data/moviesData'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

function fmt(mins: number) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-3" style={{ color: '#555577' }}>
      {children}
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </h2>
  )
}

function RatingRing({ value }: { value: number }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const pct = (value / 10) * 100
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="64" height="64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none"
          stroke={value >= 8 ? '#00e5a0' : value >= 6 ? '#f59e0b' : '#ff3b5c'}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (pct / 100) * circ}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <span className="text-sm font-black text-white z-10">{value}</span>
    </div>
  )
}

// ── Mock data ────────────────────────────────────────────────
const DATES = ['Today', 'Tomorrow', 'Sat 25', 'Sun 26', 'Mon 27']

const VENUES = [
  {
    id: 'v1', name: 'PVR ICON Versova', area: 'Andheri West',
    shows: [
      { time: '09:45 AM', format: 'IMAX', lang: 'Telugu', price: 799, seats: 'fast' },
      { time: '01:15 PM', format: '3D',   lang: 'Hindi',  price: 449, seats: 'normal' },
      { time: '04:30 PM', format: '2D',   lang: 'Telugu', price: 349, seats: 'available' },
      { time: '09:00 PM', format: 'IMAX', lang: 'Telugu', price: 799, seats: 'fast' },
    ],
  },
  {
    id: 'v2', name: 'INOX Megaplex R-City', area: 'Ghatkopar',
    shows: [
      { time: '10:30 AM', format: '2D',  lang: 'Hindi',  price: 320, seats: 'available' },
      { time: '02:00 PM', format: '4DX', lang: 'Telugu', price: 650, seats: 'fast' },
      { time: '06:45 PM', format: '2D',  lang: 'Tamil',  price: 320, seats: 'normal' },
      { time: '10:15 PM', format: '3D',  lang: 'Telugu', price: 420, seats: 'available' },
    ],
  },
  {
    id: 'v3', name: 'Cinepolis Fun Republic', area: 'Andheri West',
    shows: [
      { time: '11:00 AM', format: '2D', lang: 'Telugu', price: 299, seats: 'available' },
      { time: '03:30 PM', format: '3D', lang: 'Hindi',  price: 399, seats: 'normal' },
      { time: '07:15 PM', format: '2D', lang: 'Telugu', price: 299, seats: 'fast' },
    ],
  },
]

const SEAT_COLOR: Record<string, string> = {
  fast: '#ff3b5c', normal: '#f59e0b', available: '#00e5a0',
}
const SEAT_LABEL: Record<string, string> = {
  fast: 'Filling Fast', normal: 'Available', available: 'Available',
}

const REVIEWS = [
  { id: 'r1', user: 'Aryan K.', avatar: 'A', rating: 9, text: 'Absolutely stunning visuals! A masterpiece that blends mythology with sci-fi seamlessly. IMAX is the only way to watch this.', date: '2 days ago', helpful: 142 },
  { id: 'r2', user: 'Priya M.', avatar: 'P', rating: 8, text: 'Incredible world-building. First half is a bit slow but the second half more than makes up for it.', date: '4 days ago', helpful: 98 },
  { id: 'r3', user: 'Rahul S.', avatar: 'R', rating: 7, text: 'Good movie overall. Some scenes dragged but the climax was epic. Supporting cast was superb.', date: '1 week ago', helpful: 67 },
]

// ── Main component ───────────────────────────────────────────
export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { openAuthModal } = useUIStore()
  const { isLoggedIn } = useAuthStore()

  const movie = ALL_MOVIES.find((m) => m.id === id)
  const loggedIn = isLoggedIn()

  const [activeDate, setActiveDate]   = useState(0)
  const [activeFormat, setActiveFormat] = useState('All')
  const [wished, setWished]           = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [activeTab, setActiveTab]     = useState<'about' | 'showtimes' | 'reviews'>('about')
  const [reviewText, setReviewText]   = useState('')
  const [userRating, setUserRating]   = useState(0)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    window.scrollTo(0, 0)
    const handler = () => setScrolled(window.scrollY > 340)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [id])

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#080810' }}>
        <div className="text-6xl">🎬</div>
        <h2 className="text-2xl font-bold text-white">Movie not found</h2>
        <Link to="/movies" className="text-red-400 hover:text-red-300 text-sm font-semibold">← Back to Movies</Link>
      </div>
    )
  }

  const handleBook = (showId?: string) => {
    if (!loggedIn) { openAuthModal('login'); return }
    navigate(`/book/${showId || 'show-1'}/seats`)
  }

  const formats = ['All', ...movie.format]

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#080810', minHeight: '100vh', paddingBottom: 100 }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 'min(65vh, 520px)' }}>
        <img src={movie.backdrop} alt={movie.title}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.28) saturate(1.4)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,rgba(8,8,16,0.98) 0%,rgba(8,8,16,0.6) 55%,rgba(8,8,16,0.15) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,#080810 0%,transparent 55%)' }} />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6">
          <Link to="/movies" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            Movies
          </Link>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-10 w-full">
            <div className="flex gap-8 items-end">

              {/* Poster */}
              <div className="hidden sm:block shrink-0 rounded-2xl overflow-hidden"
                style={{ width: 160, height: 240, boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)' }}>
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div style={{ animation: 'heroIn 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
                {movie.tag && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                    style={{ background: (movie.tagColor || '#E8172B') + '22', color: movie.tagColor || '#E8172B', border: `1px solid ${movie.tagColor || '#E8172B'}40` }}>
                    {movie.tag}
                  </span>
                )}

                <h1 className="font-black text-white leading-none mb-3"
                  style={{ fontSize: 'clamp(28px,4.5vw,58px)', fontFamily: "'Bebas Neue','Impact',sans-serif", letterSpacing: '0.5px' }}>
                  {movie.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4">
                  <RatingRing value={movie.rating} />
                  <span className="text-sm font-bold" style={{ color: movie.rating >= 8 ? '#00e5a0' : '#f59e0b' }}>
                    {movie.rating}/10
                  </span>
                  <span className="text-xs" style={{ color: '#444466' }}>({movie.votes})</span>
                  <Dot /><span className="text-sm text-gray-400">{fmt(movie.duration)}</span>
                  <Dot />
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#aaa', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {movie.certificate}
                  </span>
                  <Dot /><span className="text-sm text-gray-400">{movie.language}</span>
                  <Dot /><span className="text-sm text-gray-400">{movie.releaseDate}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {movie.genre.map((g) => (
                    <span key={g} className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(255,255,255,0.07)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {g}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => handleBook()}
                    className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 8px 32px rgba(232,23,43,0.4)' }}>
                    Book Tickets
                  </button>
                  <button className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:bg-white/10 flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Trailer
                  </button>
                  <button onClick={() => setWished(!wished)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: wished ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.07)', border: `1px solid ${wished ? 'rgba(232,23,43,0.3)' : 'rgba(255,255,255,0.12)'}` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24"
                      fill={wished ? '#E8172B' : 'none'} stroke={wished ? '#E8172B' : 'white'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b"
        style={{ background: 'rgba(8,8,16,0.96)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {(['about','showtimes','reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-6 py-4 text-sm font-semibold capitalize transition-all relative"
                style={{ color: activeTab === tab ? '#fff' : '#555577' }}>
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: '#E8172B' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-2">

            {/* ABOUT */}
            {activeTab === 'about' && (
              <div style={{ animation: 'tabIn 0.25s ease' }} className="space-y-10">
                <section>
                  <SectionTitle>Synopsis</SectionTitle>
                  <p className="text-gray-400 leading-relaxed text-sm">{movie.description}</p>
                </section>

                <section>
                  <SectionTitle>Cast & Crew</SectionTitle>
                  <div className="flex flex-wrap gap-3">
                    {movie.cast.map((name) => (
                      <div key={name} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg,#E8172B,#ff7a00)' }}>
                          {name[0]}
                        </div>
                        <span className="text-sm font-medium text-white">{name}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg,#4d9fff,#a78bfa)' }}>
                        {movie.director[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{movie.director}</p>
                        <p className="text-xs" style={{ color: '#555577' }}>Director</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <SectionTitle>Movie Details</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Language',     value: movie.language },
                      { label: 'Duration',     value: fmt(movie.duration) },
                      { label: 'Certificate',  value: movie.certificate },
                      { label: 'Release Date', value: movie.releaseDate },
                      { label: 'Director',     value: movie.director },
                      { label: 'Genre',        value: movie.genre.join(', ') },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#444466' }}>{label}</p>
                        <p className="text-sm font-medium text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* SHOWTIMES */}
            {activeTab === 'showtimes' && (
              <div style={{ animation: 'tabIn 0.25s ease' }}>
                {/* Dates */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                  {DATES.map((d, i) => (
                    <button key={d} onClick={() => setActiveDate(i)}
                      className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={activeDate === i
                        ? { background: 'rgba(232,23,43,0.15)', color: '#ff3b5c', border: '1px solid rgba(232,23,43,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#777', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {d}
                    </button>
                  ))}
                </div>

                {/* Format filter */}
                <div className="flex gap-2 mb-8 flex-wrap">
                  {formats.map((f) => (
                    <button key={f} onClick={() => setActiveFormat(f)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={activeFormat === f
                        ? { background: 'rgba(232,23,43,0.15)', color: '#ff3b5c', border: '1px solid rgba(232,23,43,0.3)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#666', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {f}
                    </button>
                  ))}
                </div>

                {/* Venues */}
                <div className="space-y-4">
                  {VENUES.map((venue) => {
                    const shows = venue.shows.filter(s => activeFormat === 'All' || s.format === activeFormat)
                    if (!shows.length) return null
                    return (
                      <div key={venue.id} className="rounded-2xl overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {/* Venue header */}
                        <div className="flex items-center justify-between px-5 py-4"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div>
                            <h3 className="font-bold text-white text-sm">{venue.name}</h3>
                            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#555577' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                              </svg>
                              {venue.area}, Mumbai
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555577' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Cancellation available
                          </div>
                        </div>

                        {/* Show slots */}
                        <div className="px-5 py-4 flex flex-wrap gap-3">
                          {shows.map((show, si) => (
                            <button key={si} onClick={() => handleBook(`${venue.id}-show-${si}`)}
                              className="group flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${SEAT_COLOR[show.seats]}25`, minWidth: 108 }}>
                              <span className="font-bold text-white text-sm">{show.time}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: '#aaa' }}>
                                  {show.format}
                                </span>
                                <span className="text-xs" style={{ color: '#555577' }}>{show.lang}</span>
                              </div>
                              <span className="text-xs font-bold text-white">₹{show.price}</span>
                              <span className="text-xs font-semibold" style={{ color: SEAT_COLOR[show.seats] }}>
                                {SEAT_LABEL[show.seats]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {Object.entries(SEAT_COLOR).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                      <span className="text-xs" style={{ color: '#555577' }}>{SEAT_LABEL[key]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div style={{ animation: 'tabIn 0.25s ease' }}>
                {/* Rating summary */}
                <div className="flex items-center gap-8 p-6 rounded-2xl mb-8"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-center shrink-0">
                    <p className="font-black text-white" style={{ fontSize: 52, lineHeight: 1, fontFamily: "'Bebas Neue',sans-serif" }}>
                      {movie.rating}
                    </p>
                    <div className="flex justify-center gap-0.5 my-2">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                          fill={s <= Math.round(movie.rating / 2) ? '#f59e0b' : 'rgba(255,255,255,0.1)'}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: '#555577' }}>{movie.votes} ratings</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[10,8,6,4,2].map((score, i) => {
                      const widths = [72, 58, 35, 18, 8]
                      return (
                        <div key={score} className="flex items-center gap-3">
                          <span className="text-xs w-3 text-right shrink-0" style={{ color: '#555577' }}>{score}</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full transition-all duration-1000" style={{
                              width: `${widths[i]}%`,
                              background: score >= 8 ? '#00e5a0' : score >= 6 ? '#f59e0b' : '#ff3b5c',
                            }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Write review */}
                {loggedIn ? (
                  <div className="p-5 rounded-2xl mb-8"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-sm font-bold text-white mb-4">Write a Review</p>
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5,6,7,8,9,10].map(s => (
                        <button key={s} onClick={() => setUserRating(s)}
                          className="text-base transition-transform hover:scale-125 active:scale-110"
                          style={{ color: s <= userRating ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}>
                          ★
                        </button>
                      ))}
                      {userRating > 0 && (
                        <span className="text-xs font-bold ml-2 self-center" style={{ color: '#f59e0b' }}>{userRating}/10</span>
                      )}
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                      placeholder="Share your experience with this movie…"
                      rows={3} className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs" style={{ color: '#444466' }}>{reviewText.length}/500</span>
                      <button className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}>
                        Submit Review
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl mb-8 text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-sm text-gray-400 mb-3">Sign in to write a review</p>
                    <button onClick={() => openAuthModal('login')}
                      className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}>
                      Sign In
                    </button>
                  </div>
                )}

                {/* Review cards */}
                <div className="space-y-4">
                  {REVIEWS.map((review) => (
                    <div key={review.id} className="p-5 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#E8172B,#ff7a00)' }}>
                            {review.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{review.user}</p>
                            <p className="text-xs" style={{ color: '#444466' }}>{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span className="text-xs font-bold text-amber-400">{review.rating}/10</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
                      <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          onClick={() => setHelpfulVotes(v => ({ ...v, [review.id]: !v[review.id] }))}
                          className="flex items-center gap-1.5 text-xs transition-colors"
                          style={{ color: helpfulVotes[review.id] ? '#ff3b5c' : '#555577' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                          </svg>
                          Helpful ({helpfulVotes[review.id] ? review.helpful + 1 : review.helpful})
                        </button>
                        <button className="text-xs transition-colors hover:text-red-400" style={{ color: '#555577' }}>
                          Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="space-y-5">

            {/* Book card */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#555577' }}>Quick Book</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.format.map(f => (
                    <span key={f} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(255,255,255,0.07)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {f}
                    </span>
                  ))}
                </div>
                <button onClick={() => handleBook()}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 8px 24px rgba(232,23,43,0.35)' }}>
                  Book Tickets
                </button>
                <button onClick={() => setWished(!wished)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all mt-2.5 flex items-center justify-center gap-2"
                  style={{ background: wished ? 'rgba(232,23,43,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${wished ? 'rgba(232,23,43,0.25)' : 'rgba(255,255,255,0.08)'}`, color: wished ? '#ff3b5c' : '#888' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? '#E8172B' : 'none'} stroke={wished ? '#E8172B' : 'currentColor'} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {wished ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#555577' }}>Info</p>
              {[
                { icon: '🗓', label: 'Released',    value: movie.releaseDate },
                { icon: '⏱', label: 'Duration',    value: fmt(movie.duration) },
                { icon: '🎭', label: 'Genre',       value: movie.genre.join(', ') },
                { icon: '🌐', label: 'Language',    value: movie.language },
                { icon: '🎬', label: 'Director',    value: movie.director },
                { icon: '🔞', label: 'Certificate', value: movie.certificate },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 py-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-sm shrink-0">{icon}</span>
                  <span className="text-xs shrink-0 w-20" style={{ color: '#555577' }}>{label}</span>
                  <span className="text-xs text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#555577' }}>Share</p>
              <div className="flex gap-2">
                {[{ label: 'WhatsApp', icon: '📱' }, { label: 'Twitter', icon: '𝕏' }, { label: 'Copy Link', icon: '🔗' }]
                  .map(({ label, icon }) => (
                    <button key={label} className="flex-1 py-2.5 rounded-xl text-sm transition-all hover:bg-white/10"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {icon}
                    </button>
                  ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── STICKY BAR ───────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(8,8,16,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          transform: scrolled ? 'translateY(0)' : 'translateY(100%)',
        }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">{movie.title}</p>
              <p className="text-xs" style={{ color: '#555577' }}>⭐ {movie.rating} · {fmt(movie.duration)} · {movie.certificate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setWished(!wished)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: wished ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? '#E8172B' : 'none'} stroke={wished ? '#E8172B' : '#999'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button onClick={() => handleBook()}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 4px 20px rgba(232,23,43,0.4)' }}>
              Book Tickets
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroIn {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes tabIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}

function Dot() {
  return <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#333' }} />
}