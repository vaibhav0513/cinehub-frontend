import { useState, useEffect } from 'react'
import { LANGUAGES, GENRES } from '../data/mockData'

interface QuickFilterProps {
  onFilterChange?: (lang: string, genre: string) => void
}

export function QuickFilter({ onFilterChange }: QuickFilterProps) {
  const [lang, setLang] = useState('All')
  const [genre, setGenre] = useState('All')

  // ✅ Sync filter changes properly
  useEffect(() => {
    onFilterChange?.(lang, genre)
  }, [lang, genre, onFilterChange])

  return (
    <div className="max-w-7xl mx-auto px-6 mb-8">
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex flex-wrap gap-4">
          
          {/* Language */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2.5 font-semibold">
              Language
            </p>
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={
                    lang === l
                      ? {
                          background: 'rgba(232,23,43,0.15)',
                          color: '#ff3b5c',
                          border: '1px solid rgba(232,23,43,0.3)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          color: '#888',
                          border: '1px solid transparent',
                        }
                  }
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-px self-stretch"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />

          {/* Genre */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2.5 font-semibold">
              Genre
            </p>
            <div className="flex gap-2 flex-wrap">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={
                    genre === g
                      ? {
                          background: 'rgba(232,23,43,0.15)',
                          color: '#ff3b5c',
                          border: '1px solid rgba(232,23,43,0.3)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          color: '#888',
                          border: '1px solid transparent',
                        }
                  }
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}