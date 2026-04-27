import { useState } from 'react'
import { Link } from 'react-router-dom'
// import { Movie } from '../data/moviesData'
import type { Movie } from '@/features/movies/data/moviesData'

function formatDuration(mins: number) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

interface MovieListCardProps {
  movie: Movie
  index: number
}

export function MovieListCard({ movie, index }: MovieListCardProps) {
  const [wished, setWished] = useState(false)

  return (
    <div
      className="group flex gap-4 rounded-2xl p-4 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        animation: `listCardIn 0.35s ease ${index * 0.04}s both`,
      }}
    >
      {/* Poster */}
      <Link to={`/movies/${movie.id}`} className="shrink-0">
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ width: 80, height: 120 }}
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {movie.tag && (
            <div
              className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-bold"
              style={{
                background: (movie.tagColor || '#E8172B') + '22',
                color: movie.tagColor || '#E8172B',
                fontSize: 9,
              }}
            >
              {movie.tag}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link to={`/movies/${movie.id}`}>
            <h3
              className="font-bold text-white leading-snug line-clamp-1 group-hover:text-red-400 transition-colors"
              style={{ fontSize: 15 }}
            >
              {movie.title}
            </h3>
          </Link>
          <button
            onClick={() => setWished(!wished)}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={wished ? '#E8172B' : 'none'}
              stroke={wished ? '#E8172B' : '#888'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Rating + duration */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-bold text-amber-400">{movie.rating}</span>
            <span className="text-xs" style={{ color: '#44445a' }}>
              ({movie.votes})
            </span>
          </div>
          <span className="text-xs" style={{ color: '#555577' }}>
            {formatDuration(movie.duration)}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-bold"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#888' }}
          >
            {movie.certificate}
          </span>
        </div>

        {/* Genres + language */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {movie.genre.map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-0.5 rounded-md"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#666688',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {g}
            </span>
          ))}
          <span
            className="text-xs px-2 py-0.5 rounded-md"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#666688',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {movie.language}
          </span>
        </div>

        {/* Formats + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {movie.format.map((f) => (
              <span
                key={f}
                className="text-xs px-2 py-0.5 rounded font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  color: '#999',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {f}
              </span>
            ))}
          </div>
          <Link
            to={`/movies/${movie.id}`}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all
              hover:brightness-110 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}
          >
            Book
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes listCardIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}