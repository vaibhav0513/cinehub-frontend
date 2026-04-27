export function PromoStrip() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Loyalty card */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5"
          style={{
            background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0f0f 100%)',
            border: '1px solid rgba(232,23,43,0.2)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(232,23,43,0.15) 0%, transparent 70%)' }}
          />

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(232,23,43,0.15)', border: '1px solid rgba(232,23,43,0.25)' }}
          >
            🌟
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-base mb-1">BookMyShow Rewards</h3>
            <p className="text-gray-400 text-sm mb-3">Earn points on every booking. Redeem for free tickets!</p>
            <button
              className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg,#E8172B,#c4111f)',
                boxShadow: '0 4px 16px rgba(232,23,43,0.3)',
              }}
            >
              Join Now — It's Free
            </button>
          </div>
        </div>

        {/* App download */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5"
          style={{
            background: 'linear-gradient(135deg, #0a100a 0%, #0f1e0f 100%)',
            border: '1px solid rgba(0,229,160,0.15)',
          }}
        >
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,229,160,0.1) 0%, transparent 70%)' }}
          />

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)' }}
          >
            📱
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-base mb-1">Download the App</h3>
            <p className="text-gray-400 text-sm mb-3">Book faster. Get exclusive app-only offers.</p>
            <div className="flex gap-2">
              <button
                className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc' }}
              >
                App Store
              </button>
              <button
                className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc' }}
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}