import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import LandingPage from './pages/LandingPage.tsx'
import ProtectedRoute from './components/common/ProtectedRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuthStatus } from './hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuthStatus()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route
        path='/'
        element={isAuthenticated ? <Navigate to='/home' /> : <LandingPage />}
      />

      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
