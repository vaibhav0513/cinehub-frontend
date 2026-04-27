import { FILTER_OPTIONS } from '../data/moviesData'

export interface FilterState {
  language: string
  genre: string
  format: string
  sort: string
}

interface MovieFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  totalCount: number
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-6">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: '#555577' }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={
              value === opt
                ? {
                    background: 'rgba(232,23,43,0.15)',
                    color: '#ff3b5c',
                    border: '1px solid rgba(232,23,43,0.35)',
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    color: '#777799',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export function MovieFilters({ filters, onChange, totalCount }: MovieFiltersProps) {
  const set = (key: keyof FilterState) => (val: string) =>
    onChange({ ...filters, [key]: val })

  const hasActive =
    filters.language !== 'All' ||
    filters.genre !== 'All' ||
    filters.format !== 'All'

  return (
    <aside
      className="rounded-2xl p-5 sticky top-24"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        minWidth: 220,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-white text-sm">Filters</h3>
          <p className="text-xs mt-0.5" style={{ color: '#555577' }}>
            {totalCount} movies
          </p>
        </div>
        {hasActive && (
          <button
            onClick={() =>
              onChange({ language: 'All', genre: 'All', format: 'All', sort: filters.sort })
            }
            className="text-xs font-semibold transition-colors"
            style={{ color: '#ff3b5c' }}
          >
            Clear all
          </button>
        )}
      </div>

      <div
        className="h-px mb-6"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />

      <FilterGroup
        label="Language"
        options={FILTER_OPTIONS.languages}
        value={filters.language}
        onChange={set('language')}
      />

      <FilterGroup
        label="Genre"
        options={FILTER_OPTIONS.genres}
        value={filters.genre}
        onChange={set('genre')}
      />

      <FilterGroup
        label="Format"
        options={FILTER_OPTIONS.formats}
        value={filters.format}
        onChange={set('format')}
      />
    </aside>
  )
}