import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FEATURED_MOVIES } from '../data/mockData'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <span className="text-sm font-bold text-amber-400">{rating}</span>
    </div>
  )
}

export function HeroBanner() {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((idx: number) => {
    setPrev(active)
    setActive(idx)
  }, [active])

  const next = useCallback(() => {
    goTo((active + 1) % FEATURED_MOVIES.length)
  }, [active, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, paused])

  const movie = FEATURED_MOVIES[active]

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: 'min(90vh, 680px)', minHeight: 480 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop images */}
      {FEATURED_MOVIES.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <img
            src={m.backdrop}
            alt={m.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(1.2)' }}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(8,8,16,0.98) 0%, rgba(8,8,16,0.7) 50%, rgba(8,8,16,0.2) 100%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(8,8,16,1) 0%, transparent 40%)'
      }} />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* Left — text */}
          <div key={active} style={{ animation: 'heroIn 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
            {/* Tag */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                style={{ background: movie.tagColor + '20', color: movie.tagColor, border: `1px solid ${movie.tagColor}40` }}
              >
                {movie.tag}
              </span>
              <span className="text-gray-500 text-xs">{movie.releaseDate}</span>
            </div>

            {/* Title */}
            <h1
              className="font-black text-white leading-none mb-4 tracking-tight"
              style={{
                fontSize: 'clamp(36px, 5.5vw, 72px)',
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                textShadow: '0 4px 40px rgba(0,0,0,0.5)',
              }}
            >
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <StarRating rating={movie.rating} />
              <span className="text-gray-500 text-xs">{movie.votes} ratings</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              {movie.genre.map(g => (
                <span key={g} className="text-xs text-gray-400 px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {g}
                </span>
              ))}
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="text-xs text-gray-400">{movie.language}</span>
            </div>

            {/* Formats */}
            <div className="flex gap-2 mb-8">
              {movie.format.map(f => (
                <span key={f}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link
                to={`/movies/${movie.id}`}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all
                  active:scale-[0.97] hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #E8172B, #c4111f)',
                  boxShadow: '0 8px 32px rgba(232,23,43,0.4)',
                }}
              >
                Book Tickets
              </Link>
              <button
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all
                  hover:bg-white/10 active:scale-[0.97] flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Trailer
              </button>
            </div>
          </div>

          {/* Right — poster stack */}
          <div className="hidden lg:flex items-center justify-center relative" style={{ height: 420 }}>
            {FEATURED_MOVIES.map((m, i) => {
              const offset = (i - active + FEATURED_MOVIES.length) % FEATURED_MOVIES.length
              const isActive = offset === 0
              const isPrev = offset === FEATURED_MOVIES.length - 1
              const isNext = offset === 1
              const isNext2 = offset === 2

              if (!isActive && !isPrev && !isNext && !isNext2) return null

              let transform = 'translateX(200px) scale(0.6)'
              let zIndex = 0
              let opacity = 0

              if (isActive) { transform = 'translateX(0) scale(1) rotate(-1deg)'; zIndex = 10; opacity = 1 }
              else if (isNext) { transform = 'translateX(80px) scale(0.82) rotate(4deg)'; zIndex = 8; opacity = 0.85 }
              else if (isNext2) { transform = 'translateX(140px) scale(0.68) rotate(7deg)'; zIndex = 6; opacity = 0.5 }
              else if (isPrev) { transform = 'translateX(-80px) scale(0.82) rotate(-5deg)'; zIndex = 8; opacity = 0.5 }

              return (
                <div
                  key={m.id}
                  onClick={() => goTo(i)}
                  className="absolute cursor-pointer"
                  style={{
                    transform, zIndex, opacity,
                    transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                    width: 240, height: 360,
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: isActive
                      ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 16px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                  {!isActive && (
                    <div className="absolute inset-0" style={{ background: 'rgba(8,8,16,0.4)' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {FEATURED_MOVIES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === active ? 24 : 6,
              height: 6,
              background: i === active ? '#E8172B' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}