import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Same idea as ProtectedRoute, plus a role check. A regular user poking
// around an admin URL just gets sent to the admin login — they'd fail
// adminOnly on the API anyway, this just saves the round trip.
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
