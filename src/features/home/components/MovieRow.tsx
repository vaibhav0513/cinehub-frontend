import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MovieCard } from './MovieCard'

interface Movie {
  id: string
  title: string
  genre: string[]
  language?: string
  rating: number | null
  votes?: string
  poster: string
  releaseDate: string
  tag?: string
  tagColor?: string
  interested?: string
  format?: string[]
}

interface MovieRowProps {
  title: string
  subtitle?: string
  movies: Movie[]
  viewAllHref?: string
  variant?: 'default' | 'upcoming'
}

export function MovieRow({ title, subtitle, movies, viewAllHref = '/movies', variant = 'default' }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 600 : -600, behavior: 'smooth' })
  }

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 px-6 max-w-7xl mx-auto">
        <div>
          <h2
            className="font-black text-white leading-tight"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </h2>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {/* Scroll arrows */}
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400
              hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400
              hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
          <Link
            to={viewAllHref}
            className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors ml-2
              flex items-center gap-1"
          >
            See All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #080810, transparent)' }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #080810, transparent)' }}
        />

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              variant={variant}
              style={{ animation: `cardIn 0.4s ease ${i * 0.06}s both` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}