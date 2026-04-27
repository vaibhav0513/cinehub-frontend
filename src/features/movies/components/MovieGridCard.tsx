import { useState } from 'react'
import { Link } from 'react-router-dom'
// import { Movie } from '../data/moviesData'
import type { Movie } from '@/features/movies/data/moviesData'

function formatDuration(mins: number) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

interface MovieGridCardProps {
  movie: Movie
  index: number
}

export function MovieGridCard({ movie, index }: MovieGridCardProps) {
  const [wished, setWished] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <div
      className="group relative"
      style={{
        animation: `gridCardIn 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 0.05}s both`,
      }}
    >
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Poster */}
        <div className="relative overflow-hidden" style={{ paddingTop: '140%' }}>
          <div className="absolute inset-0">
            {imgErr ? (
              <div
                className="w-full h-full flex items-center justify-center text-5xl"
                style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}
              >
                🎬
              </div>
            ) : (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgErr(true)}
              />
            )}

            {/* Gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(8,8,16,0.95) 0%, rgba(8,8,16,0.3) 40%, transparent 70%)',
              }}
            />

            {/* Top row: tag + wishlist */}
            <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3">
              {movie.tag ? (
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{
                    background: (movie.tagColor || '#E8172B') + '22',
                    color: movie.tagColor || '#E8172B',
                    border: `1px solid ${movie.tagColor || '#E8172B'}40`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {movie.tag}
                </span>
              ) : (
                <span />
              )}

              <button
                onClick={(e) => {
                  e.preventDefault()
                  setWished(!wished)
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all
                  opacity-0 group-hover:opacity-100 hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={wished ? '#E8172B' : 'none'}
                  stroke={wished ? '#E8172B' : 'white'}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Certificate badge */}
            <div className="absolute bottom-3 left-3">
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  color: '#aaa',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {movie.certificate}
              </span>
            </div>

            {/* Book now on hover */}
            <div
              className="absolute bottom-0 left-0 right-0 p-3 translate-y-full
                group-hover:translate-y-0 transition-transform duration-300"
            >
              <Link
                to={`/movies/${movie.id}`}
                className="block w-full py-2.5 rounded-xl text-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}
              >
                Book Tickets
              </Link>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <Link to={`/movies/${movie.id}`}>
            <h3
              className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2
                group-hover:text-red-400 transition-colors"
            >
              {movie.title}
            </h3>
          </Link>

          {/* Rating row */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-bold text-amber-400">{movie.rating}</span>
            </div>
            <span className="text-xs" style={{ color: '#44445a' }}>
              {movie.votes}
            </span>
            <span className="w-0.5 h-0.5 rounded-full" style={{ background: '#333' }} />
            <span className="text-xs" style={{ color: '#555577' }}>
              {formatDuration(movie.duration)}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {movie.genre.slice(0, 2).map((g) => (
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

          {/* Formats */}
          <div className="flex flex-wrap gap-1 mt-auto">
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
        </div>
      </div>

      <style>{`
        @keyframes gridCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}