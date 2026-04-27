import { HeroBanner } from '@/features/home/components/HeroBanner'
import { CategoryBar } from '@/features/home/components/CategoryBar'
import { QuickFilter } from '@/features/home/components/QuickFilter'
import { MovieRow } from '@/features/home/components/MovieRow'
import { EventsSection } from '@/features/home/components/EventsSection'
import { PromoStrip } from '@/features/home/components/PromoStrip'
import { FEATURED_MOVIES, UPCOMING_MOVIES } from '@/features/home/data/mockData'

export default function HomePage() {
  return (
    <div style={{ background: '#080810', minHeight: '100vh' }}>
      {/* 1. Cinematic hero */}
      <HeroBanner />

      {/* 2. Category nav */}
      <CategoryBar />

      {/* 3. Filter row */}
      <div className="pt-10">
        <QuickFilter />
      </div>

      {/* 4. Now showing */}
      <MovieRow
        title="Now Showing"
        subtitle="Currently in cinemas near you"
        movies={FEATURED_MOVIES}
        viewAllHref="/movies"
      />

      {/* 5. Events */}
      <EventsSection />

      {/* 6. Promo strip */}
      <PromoStrip />

      {/* 7. Coming soon */}
      <MovieRow
        title="Coming Soon"
        subtitle="Mark your calendar"
        movies={UPCOMING_MOVIES}
        viewAllHref="/movies?tab=upcoming"
        variant="upcoming"
      />

      {/* Bottom padding */}
      <div className="h-8" />
    </div>
  )
}