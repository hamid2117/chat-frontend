import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../../hooks/useAuth'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuthStatus()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/' replace />
  }

  return children || <Outlet />
}
