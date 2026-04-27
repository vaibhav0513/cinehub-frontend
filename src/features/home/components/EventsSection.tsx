import { Link } from 'react-router-dom'
import { EVENTS } from '../data/mockData'

export function EventsSection() {
  return (
    <section className="mb-16 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2
            className="font-black text-white"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              letterSpacing: '0.5px',
            }}
          >
            Events & Experiences
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Concerts, sports, comedy shows & more near you</p>
        </div>
        <Link
          to="/events"
          className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
        >
          See All
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EVENTS.map((event, i) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group block rounded-2xl overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              animation: `cardIn 0.4s ease ${i * 0.1}s both`,
              transition: 'transform 0.3s ease, border-color 0.3s ease',
            }}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: 200 }}>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'brightness(0.75)' }}
              />
              {/* Tag */}
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{
                  background: event.tagColor + '22',
                  color: event.tagColor,
                  border: `1px solid ${event.tagColor}40`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {event.tag}
              </div>
              {/* Category */}
              <div
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-300"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              >
                {event.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3
                className="font-bold text-white text-base mb-2 group-hover:text-red-400 transition-colors line-clamp-1"
              >
                {event.title}
              </h3>

              <div className="flex items-center gap-1.5 mb-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <span className="text-xs text-gray-500 line-clamp-1">{event.venue}</span>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span className="text-xs text-gray-500">{event.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{event.price}</span>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all
                    group-hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg,#E8172B,#c4111f)',
                    boxShadow: '0 4px 16px rgba(232,23,43,0.3)',
                  }}
                >
                  Book
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}