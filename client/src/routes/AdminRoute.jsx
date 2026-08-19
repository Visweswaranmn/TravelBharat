import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Like ProtectedRoute, but also requires role === 'admin'. A logged-in
// regular user hitting an admin URL gets bounced to the admin login too —
// they were never going to pass adminOnly on the API anyway.
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner label="Checking your session..." />
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
