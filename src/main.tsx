

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { AppRouter } from '@/router/AppRouter'
import { AuthModal } from '@/features/auth'
import { ToastContainer } from '@/components/ui/ToastContainer'
// import { AuthModal } from '@/features/auth'
// import { ToastContainer } from '@/components/ui/ToastContainer'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Core app */}
        <AppRouter />

        {/* Global overlays — rendered at root so they're always on top */}
        <AuthModal />
        <ToastContainer />
      </BrowserRouter>

      {/* Dev tools — stripped in production build */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)