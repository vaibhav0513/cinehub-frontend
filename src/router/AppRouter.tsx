import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLayout, BookingLayout, AdminLayout } from '@/components/layout/Layouts'
import { PrivateRoute, RoleRoute } from './guards'

// ── Lazy pages ──
const HomePage        = lazy(() => import('@/pages/HomePage'))
const MoviesPage      = lazy(() => import('@/pages/MoviesPage'))
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'))
// const ShowtimesPage   = lazy(() => import('@/pages/ShowtimesPage'))
// const SeatPickerPage  = lazy(() => import('@/pages/SeatPickerPage'))
// const CheckoutPage    = lazy(() => import('@/pages/CheckoutPage'))
// const ConfirmPage     = lazy(() => import('@/pages/ConfirmationPage'))
// const ProfilePage     = lazy(() => import('@/pages/ProfilePage'))
// const SearchPage      = lazy(() => import('@/pages/SearchPage'))
// const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'))

// Admin — separate chunk, never loads for regular users
// const AdminDashboard  = lazy(() => import('@/features/admin/pages/AdminDashboard'))
// const AdminMovies     = lazy(() => import('@/features/admin/pages/AdminMovies'))
// const AdminVenues     = lazy(() => import('@/features/admin/pages/AdminVenues'))
// const AdminShows      = lazy(() => import('@/features/admin/pages/AdminShows'))
// const AdminBookings   = lazy(() => import('@/features/admin/pages/AdminBookings'))
// const AdminAnalytics  = lazy(() => import('@/features/admin/pages/AdminAnalytics'))

// ── Page loader ──
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080810' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black animate-pulse"
          style={{ background: '#E8172B' }}
        >
          C
        </div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public pages ── */}
        <Route element={<PageLayout />}>
          <Route path="/"            element={<HomePage />} />
          <Route path="/movies"      element={<MoviesPage />} />
          <Route path="/movies/:id"  element={<MovieDetailPage />} />
          {/* <Route path="/shows/:movieId" element={<ShowtimesPage />} /> */}
          {/* <Route path="/search"      element={<SearchPage />} /> */}
        </Route>

        {/* ── Protected: booking flow ── */}
        {/* <Route element={<PrivateRoute />}>
          <Route element={<BookingLayout />}>
            <Route path="/book/:showId/seats"    element={<SeatPickerPage />} />
            <Route path="/book/:showId/checkout" element={<CheckoutPage />} />
            <Route path="/booking/:id/confirm"   element={<ConfirmPage />} />
          </Route>

          <Route element={<PageLayout />}>
            <Route path="/profile"          element={<ProfilePage />} />
            <Route path="/profile/:tab"     element={<ProfilePage />} />
          </Route>
        </Route> */}

        {/* ── Admin only ── */}
        {/* <Route element={<RoleRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"              element={<AdminDashboard />} />
            <Route path="/admin/movies"       element={<AdminMovies />} />
            <Route path="/admin/venues"       element={<AdminVenues />} />
            <Route path="/admin/shows"        element={<AdminShows />} />
            <Route path="/admin/bookings"     element={<AdminBookings />} />
            <Route path="/admin/analytics"    element={<AdminAnalytics />} />
          </Route>
        </Route> */}

        {/* ── 404 ── */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Suspense>
  )
}