import { useState, useMemo } from 'react'
// import { ALL_MOVIES, FILTER_OPTIONS, Movie } from '@/features/movies/data/moviesData'
import { ALL_MOVIES, FILTER_OPTIONS } from '@/features/movies/data/moviesData'
import type { Movie } from '@/features/movies/data/moviesData'
// import { MovieFilters, FilterState } from '@/features/movies/components/MovieFilters'
import { MovieFilters } from '@/features/movies/components/MovieFilters'
import type { FilterState } from '@/features/movies/components/MovieFilters'
import { MovieGridCard } from '@/features/movies/components/MovieGridCard'
import { MovieListCard } from '@/features/movies/components/MovieListCard'

type ViewMode = 'grid' | 'list'

function TrendingStrip({ movies }: { movies: Movie[] }) {
  const trending = movies.filter((m) => m.isTrending)
  if (!trending.length) return null
  return (
    <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-2xl overflow-x-auto"
      style={{ background: 'rgba(232,23,43,0.06)', border: '1px solid rgba(232,23,43,0.15)' }}>
      <span className="text-xs font-bold text-red-400 uppercase tracking-widest shrink-0">🔥 Trending</span>
      <div className="w-px h-4 shrink-0" style={{ background: 'rgba(232,23,43,0.3)' }} />
      {trending.map((m) => (
        <span key={m.id} className="text-sm text-white font-medium shrink-0 hover:text-red-400 cursor-pointer transition-colors">
          {m.title}
        </span>
      ))}
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">🎬</div>
      <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
      <p className="text-sm mb-6" style={{ color: '#555577' }}>Try adjusting your filters or search query</p>
      <button onClick={onReset} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}>
        Clear Filters
      </button>
    </div>
  )
}

export default function MoviesPage() {
  const [filters, setFilters] = useState<FilterState>({ language: 'All', genre: 'All', format: 'All', sort: 'Popularity' })
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...ALL_MOVIES]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => c.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q)
      )
    }
    if (filters.language !== 'All') list = list.filter(m => m.language === filters.language)
    if (filters.genre !== 'All') list = list.filter(m => m.genre.includes(filters.genre as any))
    if (filters.format !== 'All') list = list.filter(m => m.format.includes(filters.format as any))
    switch (filters.sort) {
      case 'Rating': list.sort((a, b) => b.rating - a.rating); break
      case 'Name A-Z': list.sort((a, b) => a.title.localeCompare(b.title)); break
      default: list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0))
    }
    return list
  }, [filters, search])

  const resetFilters = () => { setFilters({ language: 'All', genre: 'All', format: 'All', sort: 'Popularity' }); setSearch('') }

  return (
    <div style={{ background: '#080810', minHeight: '100vh' }}>
      {/* Page header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg,rgba(232,23,43,0.08) 0%,transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Now Showing</p>
              <h1 className="text-white font-black leading-none" style={{ fontSize: 'clamp(28px,4vw,48px)', fontFamily: "'Bebas Neue','Impact',sans-serif", letterSpacing: '1px' }}>
                Movies
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: '#555577' }}>{filtered.length} movies in cinemas near you</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555577" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search movies, cast…"
                  className="pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', width: 220 }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Sort */}
              <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}
                className="px-3 py-2.5 rounded-xl text-sm text-white outline-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {FILTER_OPTIONS.sort.map(s => <option key={s} value={s} style={{ background: '#111' }}>{s}</option>)}
              </select>

              {/* View toggle */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                {(['grid','list'] as ViewMode[]).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className="w-10 h-10 flex items-center justify-center transition-all"
                    style={{ background: viewMode === mode ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.03)', color: viewMode === mode ? '#ff3b5c' : '#555577' }}>
                    {mode === 'grid'
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    }
                  </button>
                ))}
              </div>

              {/* Mobile filters */}
              <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: mobileFiltersOpen ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.05)', color: mobileFiltersOpen ? '#ff3b5c' : '#888', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <TrendingStrip movies={ALL_MOVIES} />
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <MovieFilters filters={filters} onChange={setFilters} totalCount={filtered.length} />
          </div>

          {/* Mobile filters drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex" onClick={() => setMobileFiltersOpen(false)}>
              <div className="flex-1" />
              <div className="w-72 h-full overflow-y-auto p-6" style={{ background: '#0e0e1c' }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-white">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <MovieFilters filters={filters} onChange={setFilters} totalCount={filtered.length} />
              </div>
            </div>
          )}

          {/* Grid / List */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0
              ? <EmptyState onReset={resetFilters} />
              : viewMode === 'grid'
              ? <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))' }}>
                  {filtered.map((m, i) => <MovieGridCard key={m.id} movie={m} index={i} />)}
                </div>
              : <div className="flex flex-col gap-3">
                  {filtered.map((m, i) => <MovieListCard key={m.id} movie={m} index={i} />)}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}