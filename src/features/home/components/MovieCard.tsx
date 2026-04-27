import { useState } from 'react'
import { Link } from 'react-router-dom'

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

interface MovieCardProps {
  movie: Movie
  variant?: 'default' | 'upcoming'
  style?: React.CSSProperties
}

export function MovieCard({ movie, variant = 'default', style }: MovieCardProps) {
  const [wished, setWished] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="group relative shrink-0 cursor-pointer"
      style={{ width: 180, ...style }}
    >
      {/* Poster */}
      <div
        className="relative overflow-hidden rounded-2xl mb-3"
        style={{
          height: 270,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
        }}
      >
        <Link to={`/movies/${movie.id}`}>
          {imgError ? (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
            >
              🎬
            </div>
          ) : (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}
        </Link>

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.9) 0%, transparent 50%)' }}
        />

        {/* Tag badge */}
        {movie.tag && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-xs font-bold"
            style={{
              background: (movie.tagColor || '#E8172B') + '22',
              color: movie.tagColor || '#E8172B',
              border: `1px solid ${movie.tagColor || '#E8172B'}40`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {movie.tag}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished) }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24"
            fill={wished ? '#E8172B' : 'none'}
            stroke={wished ? '#E8172B' : 'white'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Book now button on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            to={`/movies/${movie.id}`}
            className="block w-full py-2 rounded-xl text-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {variant === 'upcoming' ? "I'm Interested" : 'Book Now'}
          </Link>
        </div>
      </div>

      {/* Info below poster */}
      <Link to={`/movies/${movie.id}`}>
        <h3
          className="text-sm font-bold text-white leading-tight mb-1.5 line-clamp-1
            group-hover:text-red-400 transition-colors"
        >
          {movie.title}
        </h3>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {movie.rating !== null ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xs font-bold text-amber-400">{movie.rating}</span>
              {movie.votes && <span className="text-xs text-gray-600">({movie.votes})</span>}
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="text-xs text-gray-500">{movie.interested} interested</span>
            </>
          )}
        </div>
        <span className="text-xs text-gray-600">{movie.releaseDate}</span>
      </div>

      {movie.genre && (
        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{movie.genre.join(' · ')}</p>
      )}
    </div>
  )
}