import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Wrap any element that requires a logged-in user, e.g.
//   <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner label="Checking your session..." />
  }

  if (!isAuthenticated) {
    // Remember where the user was headed so Login can send them back after.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
