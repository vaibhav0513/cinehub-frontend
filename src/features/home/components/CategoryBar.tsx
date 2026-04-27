import { useState } from 'react'
import { CATEGORIES } from '../data/mockData'

export function CategoryBar() {
  const [active, setActive] = useState('movies')

  return (
    <div
      className="sticky top-16 z-30 border-b"
      style={{
        background: 'rgba(8,8,16,0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all shrink-0 font-medium text-sm"
              style={
                active === cat.id
                  ? {
                      background: 'rgba(232,23,43,0.15)',
                      color: '#ff3b5c',
                      border: '1px solid rgba(232,23,43,0.3)',
                    }
                  : {
                      background: 'transparent',
                      color: '#888',
                      border: '1px solid transparent',
                    }
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                style={{
                  background: active === cat.id ? 'rgba(232,23,43,0.2)' : 'rgba(255,255,255,0.06)',
                  color: active === cat.id ? '#ff3b5c' : '#666',
                }}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}