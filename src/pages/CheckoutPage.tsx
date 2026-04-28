import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// ── Types ─────────────────────────────────────────────────────
type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking'
type UPIApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim'

interface SeatInfo {
  id: string
  row: string
  number: number
  category: string
  price: number
}

interface ShowInfo {
  movie: string
  venue: string
  screen: string
  date: string
  time: string
  format: string
  lang: string
}

// ── Mock wallets ───────────────────────────────────────────────
const WALLETS = [
  { id: 'paytm',    label: 'Paytm',    balance: 2450, color: '#00B9F1' },
  { id: 'amazon',   label: 'Amazon Pay', balance: 850, color: '#FF9900' },
  { id: 'mobikwik', label: 'MobiKwik',  balance: 320,  color: '#6739B7' },
]

const BANKS = [
  'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank',
  'Kotak Bank', 'Yes Bank', 'PNB', 'Bank of Baroda',
]

const UPI_APPS: { id: UPIApp; label: string; color: string; icon: string }[] = [
  { id: 'gpay',    label: 'Google Pay', color: '#4285F4', icon: 'G' },
  { id: 'phonepe', label: 'PhonePe',    color: '#5F259F', icon: 'P' },
  { id: 'paytm',   label: 'Paytm',      color: '#00B9F1', icon: 'T' },
  { id: 'bhim',    label: 'BHIM',        color: '#007DC1', icon: 'B' },
]

// ── Card number formatter ──────────────────────────────────────
function formatCard(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

// ── Processing modal ───────────────────────────────────────────
function ProcessingModal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const steps = ['Securing your seats…', 'Processing payment…', 'Generating your ticket…', 'All done! 🎉']

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 900)
    )
    const done = setTimeout(onDone, steps.length * 900 + 400)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="flex flex-col items-center gap-6 p-8 text-center"
        style={{ animation: 'fadeIn 0.3s ease' }}>
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <svg className="absolute inset-0 animate-spin" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E8172B" strokeWidth="4"
              strokeLinecap="round" strokeDasharray="60 154" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {step >= 3 ? '✓' : '🎬'}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((s, i) => (
            <p key={i} className="text-sm font-semibold transition-all duration-500"
              style={{ color: i === step ? '#fff' : i < step ? '#00e5a0' : '#333355', opacity: i <= step ? 1 : 0.3 }}>
              {i < step ? '✓ ' : i === step ? '→ ' : '  '}{s}
            </p>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  )
}

// ── Section wrapper ─────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { showId } = useParams<{ showId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Data passed from SeatPickerPage via navigate state
  const state = location.state as { seats: SeatInfo[]; total: number; showInfo: ShowInfo } | null

  // Fallback mock data if navigated directly
  const seats: SeatInfo[] = state?.seats ?? [
    { id: 'C-3', row: 'C', number: 3, category: 'premium',   price: 499 },
    { id: 'C-4', row: 'C', number: 4, category: 'premium',   price: 499 },
    { id: 'F-7', row: 'F', number: 7, category: 'executive', price: 349 },
  ]
  const showInfo: ShowInfo = state?.showInfo ?? {
    movie: 'Kalki 2898 AD',
    venue: 'PVR ICON Versova',
    screen: 'Screen 3 — IMAX',
    date: 'Today, Dec 21',
    time: '09:45 AM',
    format: 'IMAX',
    lang: 'Telugu',
  }

  // ── Payment state ──────────────────────────────────────────
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [upiApp, setUpiApp] = useState<UPIApp | null>(null)
  const [upiId, setUpiId] = useState('')
  const [upiIdError, setUpiIdError] = useState('')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  // Card state
  const [cardNum, setCardNum]     = useState('')
  const [cardName, setCardName]   = useState('')
  const [expiry, setExpiry]       = useState('')
  const [cvv, setCvv]             = useState('')
  const [saveCard, setSaveCard]   = useState(false)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [cardErrors, setCardErrors]   = useState<Record<string, string>>({})

  const [processing, setProcessing] = useState(false)
  const [agreed, setAgreed]         = useState(false)

  // ── Price calculation ──────────────────────────────────────
  const subtotal    = seats.reduce((s, seat) => s + seat.price, 0)
  const convenience = seats.length * 29
  const gst         = Math.floor((subtotal + convenience) * 0.18)
  const total       = subtotal + convenience + gst

  // ── Validate & pay ─────────────────────────────────────────
  const validateAndPay = () => {
    if (!agreed) return

    if (method === 'upi' && !upiApp) {
      if (!upiId.match(/^[\w.-]+@[\w]+$/)) {
        setUpiIdError('Enter a valid UPI ID (e.g. name@upi)')
        return
      }
    }

    if (method === 'card') {
      const errs: Record<string, string> = {}
      if (cardNum.replace(/\s/g, '').length < 16) errs.cardNum = 'Enter valid 16-digit card number'
      if (!cardName.trim()) errs.cardName = 'Enter cardholder name'
      if (expiry.length < 5) errs.expiry = 'Enter valid expiry MM/YY'
      if (cvv.length < 3) errs.cvv = 'Enter valid CVV'
      if (Object.keys(errs).length) { setCardErrors(errs); return }
    }

    if (method === 'wallet' && !selectedWallet) return
    if (method === 'netbanking' && !selectedBank) return

    setProcessing(true)
  }

  const handlePaymentDone = () => {
    navigate(`/booking/${showId}/confirm`, {
      state: { seats, total, showInfo, paymentMethod: method }
    })
  }

  const CATEGORY_COLORS: Record<string, string> = {
    recliner: '#a78bfa', premium: '#ffd166', executive: '#4d9fff', classic: '#00e5a0',
  }

  // ── Method tab ─────────────────────────────────────────────
  const MethodTab = ({ id, icon, label }: { id: PaymentMethod; icon: string; label: string }) => (
    <button onClick={() => setMethod(id)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={method === id
        ? { background: 'rgba(232,23,43,0.15)', color: '#ff3b5c', border: '1px solid rgba(232,23,43,0.35)' }
        : { background: 'rgba(255,255,255,0.04)', color: '#666688', border: '1px solid rgba(255,255,255,0.07)' }
      }>
      <span>{icon}</span>{label}
    </button>
  )

  return (
    <div style={{ background: '#07070e', minHeight: '100vh', color: '#e2e2f0', paddingBottom: 80 }}>

      {/* ── TOP BAR ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 h-14 border-b sticky top-0 z-40"
        style={{ background: 'rgba(7,7,14,0.98)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <Link to={`/book/${showId}/seats`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </Link>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <p className="text-sm font-bold text-white">Secure Checkout</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#555577' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ color: '#00e5a0' }}>SSL Secured</span>
        </div>
      </div>

      {/* ── STEPS ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-0 px-6 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {[
          { n: 1, label: 'Select Seats', done: true },
          { n: 2, label: 'Checkout',     active: true },
          { n: 3, label: 'Payment',      active: false },
        ].map((step, i) => (
          <div key={step.n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: step.done ? '#00e5a0' : step.active ? '#E8172B' : 'rgba(255,255,255,0.06)',
                  color: step.done || step.active ? '#fff' : '#444466',
                }}>
                {step.done ? '✓' : step.n}
              </div>
              <span className="text-xs font-semibold hidden sm:block"
                style={{ color: step.done ? '#00e5a0' : step.active ? '#fff' : '#444466' }}>
                {step.label}
              </span>
            </div>
            {i < 2 && <div className="w-12 sm:w-20 h-px mx-3" style={{ background: 'rgba(255,255,255,0.08)' }} />}
          </div>
        ))}
      </div>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6">

        {/* ── LEFT: Payment section ─────────────────── */}
        <div className="flex-1 space-y-5">

          {/* Contact info */}
          <Section title="Contact Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>Name</label>
                <input defaultValue={user?.name ?? ''} readOnly
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.7 }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>Email</label>
                <input defaultValue={user?.email ?? 'user@example.com'} readOnly
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', opacity: 0.7 }} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>
                  Mobile <span className="font-normal">(OTP will be sent)</span>
                </label>
                <div className="flex gap-2">
                  <div className="px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888' }}>
                    +91
                  </div>
                  <input defaultValue={user?.phone ?? '98765 43210'}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Payment method */}
          <Section title="Payment Method">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <MethodTab id="upi"        icon="📱" label="UPI" />
              <MethodTab id="card"       icon="💳" label="Card" />
              <MethodTab id="wallet"     icon="👜" label="Wallet" />
              <MethodTab id="netbanking" icon="🏦" label="Net Banking" />
            </div>

            {/* ── UPI ── */}
            {method === 'upi' && (
              <div style={{ animation: 'tabIn 0.2s ease' }}>
                {/* UPI app buttons */}
                <p className="text-xs font-semibold mb-3" style={{ color: '#555577' }}>Choose UPI App</p>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {UPI_APPS.map(app => (
                    <button key={app.id} onClick={() => { setUpiApp(app.id); setUpiId('') }}
                      className="flex flex-col items-center gap-2 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: upiApp === app.id ? `${app.color}18` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${upiApp === app.id ? app.color + '50' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
                        style={{ background: app.color }}>
                        {app.icon}
                      </div>
                      <span className="text-xs font-medium" style={{ color: upiApp === app.id ? '#fff' : '#666688' }}>
                        {app.label}
                      </span>
                    </button>
                  ))}
                </div>

                {upiApp && (
                  <div className="flex items-center gap-3 p-4 rounded-xl mb-4"
                    style={{ background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.2)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <p className="text-xs" style={{ color: '#00e5a0' }}>
                      {UPI_APPS.find(a => a.id === upiApp)?.label} will open to complete payment
                    </p>
                  </div>
                )}

                {/* OR UPI ID */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-xs" style={{ color: '#444466' }}>or enter UPI ID</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>

                <div className="flex gap-2">
                  <input value={upiId} onChange={e => { setUpiId(e.target.value); setUpiApp(null); setUpiIdError('') }}
                    placeholder="yourname@upi"
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${upiIdError ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = upiIdError ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                  />
                  <button className="px-4 py-3 rounded-xl text-xs font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Verify
                  </button>
                </div>
                {upiIdError && <p className="text-xs mt-1.5" style={{ color: '#ff3b5c' }}>{upiIdError}</p>}
              </div>
            )}

            {/* ── CARD ── */}
            {method === 'card' && (
              <div style={{ animation: 'tabIn 0.2s ease' }}>
                {/* Virtual card preview */}
                <div className="relative h-44 rounded-2xl mb-6 overflow-hidden"
                  style={{ perspective: 1000 }}>
                  <div className="w-full h-full transition-all duration-700"
                    style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>

                    {/* Front */}
                    <div className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between"
                      style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#1a1a3e 0%,#0e0e2a 50%,#1a1020 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-8 rounded-md" style={{ background: 'linear-gradient(135deg,#ffd166,#ff7a00)' }} />
                        <div className="text-xs font-bold" style={{ color: '#ffffff60' }}>
                          {cardNum.replace(/\s/g, '').length <= 4 ? 'VISA' : 'MASTERCARD'}
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-lg font-bold tracking-widest text-white mb-3">
                          {cardNum || '•••• •••• •••• ••••'}
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: '#ffffff50' }}>CARDHOLDER</p>
                            <p className="text-sm font-bold text-white uppercase tracking-wider">
                              {cardName || 'YOUR NAME'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs mb-0.5" style={{ color: '#ffffff50' }}>EXPIRES</p>
                            <p className="text-sm font-bold text-white">{expiry || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 rounded-2xl flex flex-col justify-center"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#1a1a3e,#0e0e2a)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="h-10 mb-4" style={{ background: 'rgba(0,0,0,0.5)' }} />
                      <div className="flex items-center gap-3 px-5">
                        <div className="flex-1 h-8 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="w-14 h-8 rounded flex items-center justify-center text-sm font-bold"
                          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                          {cvv || 'CVV'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>Card Number</label>
                    <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono placeholder-gray-600 outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${cardErrors.cardNum ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = cardErrors.cardNum ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                    />
                    {cardErrors.cardNum && <p className="text-xs mt-1" style={{ color: '#ff3b5c' }}>{cardErrors.cardNum}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>Cardholder Name</label>
                    <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
                      placeholder="AS ON CARD"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white uppercase tracking-wider placeholder-gray-600 outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${cardErrors.cardName ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = cardErrors.cardName ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                    />
                    {cardErrors.cardName && <p className="text-xs mt-1" style={{ color: '#ff3b5c' }}>{cardErrors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>Expiry</label>
                      <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY" maxLength={5}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono placeholder-gray-600 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${cardErrors.expiry ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)'}
                        onBlur={e => e.currentTarget.style.borderColor = cardErrors.expiry ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}
                      />
                      {cardErrors.expiry && <p className="text-xs mt-1" style={{ color: '#ff3b5c' }}>{cardErrors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#555577' }}>CVV</label>
                      <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••" type="password" maxLength={4}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white font-mono placeholder-gray-600 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${cardErrors.cvv ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                        onFocus={e => { setCardFlipped(true); e.currentTarget.style.borderColor = 'rgba(232,23,43,0.5)' }}
                        onBlur={e => { setCardFlipped(false); e.currentTarget.style.borderColor = cardErrors.cvv ? 'rgba(232,23,43,0.5)' : 'rgba(255,255,255,0.08)' }}
                      />
                      {cardErrors.cvv && <p className="text-xs mt-1" style={{ color: '#ff3b5c' }}>{cardErrors.cvv}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div onClick={() => setSaveCard(!saveCard)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{ background: saveCard ? '#E8172B' : 'rgba(255,255,255,0.06)', border: `1px solid ${saveCard ? '#E8172B' : 'rgba(255,255,255,0.15)'}` }}>
                      {saveCard && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: '#666688' }}>Save card for faster future payments</span>
                  </label>
                </div>
              </div>
            )}

            {/* ── WALLET ── */}
            {method === 'wallet' && (
              <div className="space-y-3" style={{ animation: 'tabIn 0.2s ease' }}>
                {WALLETS.map(w => (
                  <button key={w.id} onClick={() => setSelectedWallet(w.id)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all hover:scale-[1.01]"
                    style={{
                      background: selectedWallet === w.id ? `${w.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedWallet === w.id ? w.color + '40' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                      style={{ background: w.color }}>
                      {w.label[0]}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white">{w.label}</p>
                      <p className="text-xs" style={{ color: '#555577' }}>Balance: ₹{w.balance.toLocaleString()}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center`}
                      style={{ borderColor: selectedWallet === w.id ? w.color : 'rgba(255,255,255,0.2)' }}>
                      {selectedWallet === w.id && (
                        <div className="w-2 h-2 rounded-full" style={{ background: w.color }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ── NET BANKING ── */}
            {method === 'netbanking' && (
              <div style={{ animation: 'tabIn 0.2s ease' }}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {BANKS.slice(0, 6).map(bank => (
                    <button key={bank} onClick={() => setSelectedBank(bank)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                      style={{
                        background: selectedBank === bank ? 'rgba(232,23,43,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedBank === bank ? 'rgba(232,23,43,0.35)' : 'rgba(255,255,255,0.07)'}`,
                        color: selectedBank === bank ? '#ff3b5c' : '#888',
                      }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: selectedBank === bank ? '#E8172B' : 'rgba(255,255,255,0.1)' }}>
                        {bank[0]}
                      </div>
                      <span className="font-medium text-xs">{bank}</span>
                    </button>
                  ))}
                </div>
                <select value={selectedBank ?? ''} onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <option value="" style={{ background: '#111' }}>All other banks…</option>
                  {BANKS.map(b => <option key={b} value={b} style={{ background: '#111' }}>{b}</option>)}
                </select>
              </div>
            )}
          </Section>

          {/* T&C */}
          <div className="flex items-start gap-3 px-1">
            <div onClick={() => setAgreed(!agreed)}
              className="w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-all cursor-pointer shrink-0"
              style={{ background: agreed ? '#E8172B' : 'rgba(255,255,255,0.06)', border: `1px solid ${agreed ? '#E8172B' : 'rgba(255,255,255,0.15)'}` }}>
              {agreed && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#555577' }}>
              I agree to the{' '}
              <a href="/terms" className="text-red-400 hover:underline">Terms & Conditions</a> and{' '}
              <a href="/privacy" className="text-red-400 hover:underline">Privacy Policy</a>. I understand that seats will be released if payment is not completed within the time limit.
            </p>
          </div>

          {/* Pay button (mobile) */}
          <button onClick={validateAndPay} disabled={!agreed}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all lg:hidden hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: agreed ? 'linear-gradient(135deg,#E8172B,#c4111f)' : 'rgba(255,255,255,0.05)', boxShadow: agreed ? '0 8px 32px rgba(232,23,43,0.35)' : 'none' }}>
            Pay ₹{total.toLocaleString()}
          </button>
        </div>

        {/* ── RIGHT: Order summary ───────────────────── */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-4">

            {/* Booking summary */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-bold text-white">Booking Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Show info */}
                <div className="flex gap-3">
                  <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0"
                    style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
                    <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-tight mb-1">{showInfo.movie}</p>
                    <p className="text-xs mb-0.5" style={{ color: '#555577' }}>{showInfo.venue}</p>
                    <p className="text-xs" style={{ color: '#555577' }}>{showInfo.screen}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '📅', label: showInfo.date },
                    { icon: '🕐', label: showInfo.time },
                    { icon: '🎞', label: showInfo.format },
                    { icon: '🌐', label: showInfo.lang },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-xs">{icon}</span>
                      <span className="text-xs font-medium text-white">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Seats */}
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#555577' }}>Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {seats.map(seat => {
                      const color = CATEGORY_COLORS[seat.category] ?? '#888'
                      return (
                        <span key={seat.id} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                          {seat.row}{seat.number}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#666688' }}>Tickets ({seats.length})</span>
                    <span className="text-white">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#666688' }}>Convenience fee</span>
                    <span className="text-white">₹{convenience}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#666688' }}>GST (18%)</span>
                    <span className="text-white">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <span className="text-white">Total</span>
                    <span className="text-white">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay button desktop */}
            <button onClick={validateAndPay} disabled={!agreed}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all hidden lg:block hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: agreed ? 'linear-gradient(135deg,#E8172B,#c4111f)' : 'rgba(255,255,255,0.05)', boxShadow: agreed ? '0 8px 32px rgba(232,23,43,0.35)' : 'none' }}>
              Pay ₹{total.toLocaleString()}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {['🔒 SSL', '💳 PCI DSS', '🛡 Razorpay'].map(badge => (
                <span key={badge} className="text-xs font-medium" style={{ color: '#333355' }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PROCESSING MODAL ──────────────────────────── */}
      {processing && <ProcessingModal onDone={handlePaymentDone} />}

      <style>{`
        @keyframes tabIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}

const CATEGORY_COLORS: Record<string, string> = {
  recliner: '#a78bfa', premium: '#ffd166', executive: '#4d9fff', classic: '#00e5a0',
}