import { useState, useMemo } from 'react'

// ── Types ─────────────────────────────────────────────────────
interface Movie {
  id: string
  title: string
  genre: string[]
  language: string
  duration: number
  releaseDate: string
  certificate: 'U' | 'UA' | 'A'
  format: string[]
  status: 'active' | 'upcoming' | 'inactive'
  rating: number
  totalBookings: number
  revenue: number
  director: string
  cast: string
  description: string
  poster: string
}

// ── Mock data ─────────────────────────────────────────────────
const INITIAL_MOVIES: Movie[] = [
  {
    id: '1', title: 'Kalki 2898 AD', genre: ['Sci-Fi', 'Action'],
    language: 'Telugu', duration: 181, releaseDate: '2024-06-27',
    certificate: 'UA', format: ['2D', '3D', 'IMAX'],
    status: 'active', rating: 8.4, totalBookings: 2341, revenue: 842350,
    director: 'Nag Ashwin', cast: 'Prabhas, Deepika Padukone, Amitabh Bachchan',
    description: 'A mythological sci-fi epic set in the dystopian city of Kasi.',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=80&h=120&fit=crop',
  },
  {
    id: '2', title: 'Stree 2', genre: ['Horror', 'Comedy'],
    language: 'Hindi', duration: 145, releaseDate: '2024-08-15',
    certificate: 'UA', format: ['2D', '4DX'],
    status: 'active', rating: 8.9, totalBookings: 1892, revenue: 621400,
    director: 'Amar Kaushik', cast: 'Shraddha Kapoor, Rajkummar Rao, Pankaj Tripathi',
    description: 'The terror returns to Chanderi with a new chilling form.',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=80&h=120&fit=crop',
  },
  {
    id: '3', title: 'Pushpa 2: The Rule', genre: ['Action', 'Drama'],
    language: 'Telugu', duration: 190, releaseDate: '2024-12-05',
    certificate: 'UA', format: ['2D', '3D', 'IMAX', '4DX'],
    status: 'active', rating: 7.6, totalBookings: 1453, revenue: 498200,
    director: 'Sukumar', cast: 'Allu Arjun, Rashmika Mandanna, Fahadh Faasil',
    description: 'Pushpa Raj expands his empire while facing a formidable enemy.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=80&h=120&fit=crop',
  },
  {
    id: '4', title: 'Singham Again', genre: ['Action'],
    language: 'Hindi', duration: 175, releaseDate: '2024-11-01',
    certificate: 'UA', format: ['2D', 'IMAX'],
    status: 'active', rating: 6.8, totalBookings: 987, revenue: 312800,
    director: 'Rohit Shetty', cast: 'Ajay Devgn, Kareena Kapoor, Ranveer Singh',
    description: 'ACP Singham returns in an epic battle of good vs evil.',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=80&h=120&fit=crop',
  },
  {
    id: '5', title: 'Vettaiyan', genre: ['Action', 'Thriller'],
    language: 'Tamil', duration: 169, releaseDate: '2024-10-10',
    certificate: 'UA', format: ['2D', '3D'],
    status: 'active', rating: 7.4, totalBookings: 743, revenue: 218600,
    director: 'TJ Gnanavel', cast: 'Rajinikanth, Amitabh Bachchan, Fahadh Faasil',
    description: 'A veteran cop faces crisis when his son joins the force.',
    poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=80&h=120&fit=crop',
  },
  {
    id: '6', title: 'Devara Part 2', genre: ['Action', 'Drama'],
    language: 'Telugu', duration: 0, releaseDate: '2025-03-15',
    certificate: 'UA', format: ['2D', '3D', 'IMAX'],
    status: 'upcoming', rating: 0, totalBookings: 0, revenue: 0,
    director: 'Koratala Siva', cast: 'Jr. NTR, Janhvi Kapoor',
    description: 'The fearless sea-lord returns for the epic conclusion.',
    poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=120&fit=crop',
  },
  {
    id: '7', title: 'War 2', genre: ['Action', 'Spy'],
    language: 'Hindi', duration: 0, releaseDate: '2025-01-26',
    certificate: 'UA', format: ['2D', 'IMAX'],
    status: 'upcoming', rating: 0, totalBookings: 0, revenue: 0,
    director: 'Ayan Mukerji', cast: 'Hrithik Roshan, Jr. NTR',
    description: 'The most awaited spy action sequel.',
    poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=80&h=120&fit=crop',
  },
  {
    id: '8', title: 'Lucky Baskhar', genre: ['Drama', 'Thriller'],
    language: 'Telugu', duration: 155, releaseDate: '2024-10-31',
    certificate: 'UA', format: ['2D'],
    status: 'inactive', rating: 8.1, totalBookings: 431, revenue: 98600,
    director: 'Venky Atluri', cast: 'Dulquer Salmaan, Meenakshi Chaudhary',
    description: 'A bank employee stumbles into money laundering chaos.',
    poster: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=120&fit=crop',
  },
]

const GENRES    = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Spy']
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Malayalam']
const FORMATS   = ['2D', '3D', 'IMAX', '4DX', 'IMAX 3D']
const CERTS     = ['U', 'UA', 'A']

function fmt(mins: number) {
  if (!mins) return '—'
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: Movie['status'] }) {
  const map = {
    active:   { bg: 'rgba(0,229,160,0.12)',  color: '#00e5a0', label: 'Active' },
    upcoming: { bg: 'rgba(77,159,255,0.12)', color: '#4d9fff', label: 'Upcoming' },
    inactive: { bg: 'rgba(255,255,255,0.06)', color: '#555577', label: 'Inactive' },
  }
  const s = map[status]
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

// ── Checkbox multi-select ─────────────────────────────────────
function MultiCheck({
  options, selected, onChange, label,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void; label: string }) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  return (
    <div>
      <label className="block text-xs font-semibold mb-2" style={{ color: '#555577' }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={selected.includes(opt)
              ? { background: 'rgba(232,23,43,0.15)', color: '#ff3b5c', border: '1px solid rgba(232,23,43,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', color: '#666688', border: '1px solid rgba(255,255,255,0.07)' }
            }>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Input field ───────────────────────────────────────────────
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: '#ff3b5c' }}>{error}</p>}
    </div>
  )
}

const inputCls = (err?: string) =>
  `w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all placeholder-gray-600`

const inputStyle = (err?: string): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${err ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}`,
})

// ── Add / Edit Modal ──────────────────────────────────────────
const EMPTY: Omit<Movie, 'id' | 'totalBookings' | 'revenue' | 'rating'> = {
  title: '', genre: [], language: 'Hindi', duration: 0,
  releaseDate: '', certificate: 'UA', format: [], status: 'upcoming',
  director: '', cast: '', description: '', poster: '',
}

interface ModalProps {
  movie?: Movie | null
  onClose: () => void
  onSave: (m: Movie) => void
}

function MovieModal({ movie, onClose, onSave }: ModalProps) {
  const isEdit = !!movie
  const [form, setForm] = useState<typeof EMPTY>(
    movie
      ? { title: movie.title, genre: movie.genre, language: movie.language, duration: movie.duration,
          releaseDate: movie.releaseDate, certificate: movie.certificate, format: movie.format,
          status: movie.status, director: movie.director, cast: movie.cast,
          description: movie.description, poster: movie.poster }
      : { ...EMPTY }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tab, setTab] = useState<'basic' | 'details' | 'media'>('basic')

  const set = (k: keyof typeof EMPTY) => (v: any) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim())        e.title = 'Title is required'
    if (!form.director.trim())     e.director = 'Director is required'
    if (!form.releaseDate)         e.releaseDate = 'Release date is required'
    if (!form.genre.length)        e.genre = 'Select at least one genre'
    if (!form.format.length)       e.format = 'Select at least one format'
    if (!form.language)            e.language = 'Select a language'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({
      ...form,
      id: movie?.id ?? Date.now().toString(),
      rating: movie?.rating ?? 0,
      totalBookings: movie?.totalBookings ?? 0,
      revenue: movie?.revenue ?? 0,
    })
  }

  const TABS = ['basic', 'details', 'media'] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(145deg,#0e0e1c,#0a0a14)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          maxHeight: '90vh',
          animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onClick={e => e.stopPropagation()}>

        {/* Top accent */}
        <div className="h-0.5 shrink-0" style={{ background: 'linear-gradient(90deg,transparent,#E8172B,transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="font-black text-white text-lg">
              {isEdit ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#444466' }}>
              {isEdit ? `Editing: ${movie.title}` : 'Fill in the details below'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: '#555577' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3 text-xs font-bold capitalize transition-all relative"
              style={{ color: tab === t ? '#fff' : '#444466' }}>
              {t}
              {tab === t && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: '#E8172B' }} />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* ── BASIC ── */}
          {tab === 'basic' && (
            <div className="space-y-4" style={{ animation: 'tabIn 0.2s ease' }}>
              <Field label="Movie Title *" error={errors.title}>
                <input value={form.title} onChange={e => set('title')(e.target.value)}
                  placeholder="e.g. Kalki 2898 AD"
                  className={inputCls(errors.title)} style={inputStyle(errors.title)}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.title ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Director *" error={errors.director}>
                  <input value={form.director} onChange={e => set('director')(e.target.value)}
                    placeholder="Director name"
                    className={inputCls(errors.director)} style={inputStyle(errors.director)}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = errors.director ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                  />
                </Field>
                <Field label="Release Date *" error={errors.releaseDate}>
                  <input type="date" value={form.releaseDate} onChange={e => set('releaseDate')(e.target.value)}
                    className={inputCls(errors.releaseDate)} style={{ ...inputStyle(errors.releaseDate), colorScheme: 'dark' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = errors.releaseDate ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Language *" error={errors.language}>
                  <select value={form.language} onChange={e => set('language')(e.target.value)}
                    className={inputCls()} style={{ ...inputStyle(), cursor: 'pointer' }}>
                    {LANGUAGES.map(l => <option key={l} value={l} style={{ background: '#111' }}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Certificate">
                  <select value={form.certificate} onChange={e => set('certificate')(e.target.value as any)}
                    className={inputCls()} style={{ ...inputStyle(), cursor: 'pointer' }}>
                    {CERTS.map(c => <option key={c} value={c} style={{ background: '#111' }}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Duration (mins)">
                  <input type="number" value={form.duration || ''} min={0} max={300}
                    onChange={e => set('duration')(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 150"
                    className={inputCls()} style={inputStyle()}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </Field>
              </div>

              <Field label="Status">
                <div className="flex gap-2">
                  {(['active', 'upcoming', 'inactive'] as const).map(s => (
                    <button key={s} type="button" onClick={() => set('status')(s)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all"
                      style={form.status === s
                        ? { background: 'rgba(232,23,43,0.15)', color: '#ff3b5c', border: '1px solid rgba(232,23,43,0.3)' }
                        : { background: 'rgba(255,255,255,0.04)', color: '#666688', border: '1px solid rgba(255,255,255,0.07)' }
                      }>
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              <MultiCheck label="Genre *" options={GENRES} selected={form.genre} onChange={set('genre')} />
              {errors.genre && <p className="text-xs -mt-2" style={{ color: '#ff3b5c' }}>{errors.genre}</p>}

              <MultiCheck label="Formats *" options={FORMATS} selected={form.format} onChange={set('format')} />
              {errors.format && <p className="text-xs -mt-2" style={{ color: '#ff3b5c' }}>{errors.format}</p>}
            </div>
          )}

          {/* ── DETAILS ── */}
          {tab === 'details' && (
            <div className="space-y-4" style={{ animation: 'tabIn 0.2s ease' }}>
              <Field label="Cast (comma separated)">
                <input value={form.cast} onChange={e => set('cast')(e.target.value)}
                  placeholder="Actor 1, Actor 2, Actor 3…"
                  className={inputCls()} style={inputStyle()}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>
              <Field label="Synopsis">
                <textarea value={form.description} onChange={e => set('description')(e.target.value)}
                  rows={5} placeholder="Brief description of the movie…"
                  className={inputCls()} style={{ ...inputStyle(), resize: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <p className="text-xs mt-1 text-right" style={{ color: '#333355' }}>
                  {form.description.length}/500
                </p>
              </Field>
            </div>
          )}

          {/* ── MEDIA ── */}
          {tab === 'media' && (
            <div className="space-y-4" style={{ animation: 'tabIn 0.2s ease' }}>
              <Field label="Poster URL">
                <input value={form.poster} onChange={e => set('poster')(e.target.value)}
                  placeholder="https://example.com/poster.jpg"
                  className={inputCls()} style={inputStyle()}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Field>
              {form.poster && (
                <div className="flex gap-4 items-start p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <img src={form.poster} alt="Poster preview"
                    className="w-20 h-28 object-cover rounded-xl shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Poster Preview</p>
                    <p className="text-xs" style={{ color: '#555577' }}>
                      Make sure the image is at least 400×600px for best quality.
                    </p>
                  </div>
                </div>
              )}
              <div className="rounded-xl p-4"
                style={{ background: 'rgba(77,159,255,0.06)', border: '1px solid rgba(77,159,255,0.15)' }}>
                <p className="text-xs font-semibold" style={{ color: '#4d9fff' }}>
                  💡 Tip: Use Unsplash, TMDB, or your CDN for poster images. Recommended ratio: 2:3 (portrait).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex gap-2">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(t)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: tab === t ? '#E8172B' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 4px 16px rgba(232,23,43,0.35)' }}>
              {isEdit ? 'Save Changes' : 'Add Movie'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(0.92) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes tabIn   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

// ── Delete confirm ────────────────────────────────────────────
function DeleteConfirm({ movie, onConfirm, onCancel }: { movie: Movie; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: '#0e0e1c', border: '1px solid rgba(232,23,43,0.2)', boxShadow: '0 24px 60px rgba(0,0,0,0.7)', animation: 'modalIn 0.2s ease' }}
        onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
            style={{ background: 'rgba(232,23,43,0.1)', border: '1px solid rgba(232,23,43,0.2)' }}>
            🗑
          </div>
          <h3 className="font-black text-white text-lg mb-2">Delete Movie</h3>
          <p className="text-sm mb-1" style={{ color: '#888' }}>
            Are you sure you want to delete
          </p>
          <p className="font-bold text-white mb-4">"{movie.title}"?</p>
          <p className="text-xs mb-6" style={{ color: '#555577' }}>
            This will also remove all associated showtimes and booking references. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 4px 16px rgba(232,23,43,0.4)' }}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Movie['status']>('all')
  const [langFilter, setLangFilter] = useState('All')
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'bookings' | 'revenue' | 'releaseDate'>('bookings')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [modalMovie, setModalMovie] = useState<Movie | null | undefined>(undefined) // undefined = closed
  const [deleteMovie, setDeleteMovie] = useState<Movie | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Filter + sort ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...movies]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q))
      )
    }
    if (statusFilter !== 'all') list = list.filter(m => m.status === statusFilter)
    if (langFilter !== 'All')   list = list.filter(m => m.language === langFilter)

    list.sort((a, b) => {
      let diff = 0
      switch (sortBy) {
        case 'title':       diff = a.title.localeCompare(b.title); break
        case 'rating':      diff = a.rating - b.rating; break
        case 'bookings':    diff = a.totalBookings - b.totalBookings; break
        case 'revenue':     diff = a.revenue - b.revenue; break
        case 'releaseDate': diff = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(); break
      }
      return sortDir === 'desc' ? -diff : diff
    })
    return list
  }, [movies, search, statusFilter, langFilter, sortBy, sortDir])

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('desc') }
  }

  // ── CRUD ─────────────────────────────────────────────────
  const handleSave = (movie: Movie) => {
    setMovies(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.map(m => m.id === movie.id ? movie : m)
        : [...prev, movie]
    )
    setModalMovie(undefined)
    showToast(modalMovie ? `"${movie.title}" updated successfully` : `"${movie.title}" added successfully`)
  }

  const handleDelete = (movie: Movie) => {
    setMovies(prev => prev.filter(m => m.id !== movie.id))
    setSelectedIds(prev => { const s = new Set(prev); s.delete(movie.id); return s })
    setDeleteMovie(null)
    showToast(`"${movie.title}" deleted`, 'error')
  }

  const handleBulkDelete = () => {
    setMovies(prev => prev.filter(m => !selectedIds.has(m.id)))
    showToast(`${selectedIds.size} movie(s) deleted`, 'error')
    setSelectedIds(new Set())
  }

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const toggleAll = () =>
    setSelectedIds(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(m => m.id)))

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ color: sortBy === col ? '#ff3b5c' : '#333355', display: 'inline', marginLeft: 4 }}>
      {sortBy === col && sortDir === 'desc'
        ? <path d="m6 9 6 6 6-6"/>
        : sortBy === col
        ? <path d="m18 15-6-6-6 6"/>
        : <><path d="m6 9 6 6 6-6" opacity="0.4"/><path d="m18 15-6-6-6 6" opacity="0.4"/></>
      }
    </svg>
  )

  // ── Stats row ─────────────────────────────────────────────
  const stats = {
    total:    movies.length,
    active:   movies.filter(m => m.status === 'active').length,
    upcoming: movies.filter(m => m.status === 'upcoming').length,
    revenue:  movies.reduce((s, m) => s + m.revenue, 0),
  }

  return (
    <div style={{ color: '#e2e2f0' }}>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2.5"
          style={{
            background: toast.type === 'success' ? 'rgba(0,229,160,0.12)' : 'rgba(232,23,43,0.12)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(0,229,160,0.3)' : 'rgba(232,23,43,0.3)'}`,
            color: toast.type === 'success' ? '#00e5a0' : '#ff3b5c',
            backdropFilter: 'blur(12px)',
            animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555577' }}>Content Management</p>
          <h1 className="font-black text-white" style={{ fontSize: 'clamp(22px,3vw,32px)', fontFamily: "'Bebas Neue','Impact',sans-serif", letterSpacing: '0.5px' }}>
            Movies
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#444466' }}>{movies.length} total movies</p>
        </div>
        <button onClick={() => setModalMovie(null)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)', boxShadow: '0 4px 16px rgba(232,23,43,0.35)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Movie
        </button>
      </div>

      {/* ── Mini stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Movies',    value: stats.total,    color: '#4d9fff', icon: '🎬' },
          { label: 'Now Showing',     value: stats.active,   color: '#00e5a0', icon: '▶️' },
          { label: 'Coming Soon',     value: stats.upcoming, color: '#a78bfa', icon: '🔜' },
          { label: 'Total Revenue',   value: `₹${(stats.revenue/100000).toFixed(1)}L`, color: '#ffd166', icon: '💰' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="font-black text-white text-xl" style={{ fontFamily: "'Bebas Neue',sans-serif" }}>
                {s.value}
              </p>
              <p className="text-xs" style={{ color: '#444466' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="rounded-2xl overflow-hidden mb-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13"
              viewBox="0 0 24 24" fill="none" stroke="#555577" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search movies, director, cast…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filter */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['all', 'active', 'upcoming', 'inactive'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className="px-3 py-2 text-xs font-bold capitalize transition-all"
                  style={{
                    background: statusFilter === s ? 'rgba(232,23,43,0.15)' : 'rgba(255,255,255,0.03)',
                    color: statusFilter === s ? '#ff3b5c' : '#555577',
                  }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Language filter */}
            <select value={langFilter} onChange={e => setLangFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs text-white outline-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="All" style={{ background: '#111' }}>All Languages</option>
              {LANGUAGES.map(l => <option key={l} value={l} style={{ background: '#111' }}>{l}</option>)}
            </select>

            {/* Bulk delete */}
            {selectedIds.size > 0 && (
              <button onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
                style={{ background: 'rgba(232,23,43,0.15)', color: '#ff3b5c', border: '1px solid rgba(232,23,43,0.3)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
                Delete ({selectedIds.size})
              </button>
            )}

            <p className="text-xs" style={{ color: '#333355' }}>{filtered.length} results</p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded cursor-pointer accent-red-600"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#333355' }}>
                  Movie
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none" style={{ color: '#333355' }}
                  onClick={() => toggleSort('releaseDate')}>
                  Release <SortIcon col="releaseDate" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#333355' }}>
                  Formats
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#333355' }}>
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none" style={{ color: '#333355' }}
                  onClick={() => toggleSort('rating')}>
                  Rating <SortIcon col="rating" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none" style={{ color: '#333355' }}
                  onClick={() => toggleSort('bookings')}>
                  Bookings <SortIcon col="bookings" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none" style={{ color: '#333355' }}
                  onClick={() => toggleSort('revenue')}>
                  Revenue <SortIcon col="revenue" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#333355' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie, i) => (
                <tr key={movie.id}
                  className="transition-colors hover:bg-white/2 group"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', animation: `cardIn 0.3s ease ${i * 0.03}s both` }}>

                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(movie.id)}
                      onChange={() => toggleSelect(movie.id)}
                      className="w-3.5 h-3.5 rounded cursor-pointer accent-red-600"
                    />
                  </td>

                  {/* Movie */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0"
                        style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
                        {movie.poster
                          ? <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white leading-tight truncate max-w-[160px]">{movie.title}</p>
                        <p className="text-xs mt-0.5 truncate max-w-[160px]" style={{ color: '#555577' }}>
                          {movie.director}
                        </p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {movie.genre.slice(0, 2).map(g => (
                            <span key={g} className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(255,255,255,0.06)', color: '#888', fontSize: 9 }}>
                              {g}
                            </span>
                          ))}
                          <span className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#888', fontSize: 9 }}>
                            {movie.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Release */}
                  <td className="px-4 py-3">
                    <p className="text-xs text-white whitespace-nowrap">
                      {movie.releaseDate
                        ? new Date(movie.releaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#444466' }}>{fmt(movie.duration)}</p>
                  </td>

                  {/* Formats */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap max-w-[100px]">
                      {movie.format.map(f => (
                        <span key={f} className="text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: 'rgba(255,255,255,0.07)', color: '#aaa' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={movie.status} />
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    {movie.rating > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm font-bold text-amber-400">{movie.rating}</span>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: '#333355' }}>No data</span>
                    )}
                  </td>

                  {/* Bookings */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-white">
                      {movie.totalBookings > 0 ? movie.totalBookings.toLocaleString() : '—'}
                    </span>
                  </td>

                  {/* Revenue */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold" style={{ color: movie.revenue > 0 ? '#00e5a0' : '#333355' }}>
                      {movie.revenue > 0 ? `₹${(movie.revenue / 1000).toFixed(0)}K` : '—'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setModalMovie(movie)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
                        title="Edit" style={{ color: '#4d9fff' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => setDeleteMovie(movie)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10"
                        title="Delete" style={{ color: '#ff3b5c' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🎬</div>
              <p className="font-bold text-white mb-1">No movies found</p>
              <p className="text-sm mb-5" style={{ color: '#444466' }}>
                {search ? 'Try a different search term' : 'Add your first movie'}
              </p>
              {!search && (
                <button onClick={() => setModalMovie(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#E8172B,#c4111f)' }}>
                  Add Movie
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs" style={{ color: '#444466' }}>
              {selectedIds.size > 0 ? `${selectedIds.size} selected · ` : ''}
              Showing {filtered.length} of {movies.length} movies
            </p>
            <p className="text-xs" style={{ color: '#333355' }}>
              Click column headers to sort
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modalMovie !== undefined && (
        <MovieModal
          movie={modalMovie}
          onClose={() => setModalMovie(undefined)}
          onSave={handleSave}
        />
      )}
      {deleteMovie && (
        <DeleteConfirm
          movie={deleteMovie}
          onConfirm={() => handleDelete(deleteMovie)}
          onCancel={() => setDeleteMovie(null)}
        />
      )}

      <style>{`
        @keyframes cardIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(16px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
      `}</style>
    </div>
  )
}