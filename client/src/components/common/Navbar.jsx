import { Link, useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 text-lg">
          <MapPin className="w-5 h-5 text-orange-600" />
          TravelBharat
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/explore" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Explore
          </Link>
          <Link to="/categories" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Categories
          </Link>
          <Link to="/search" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Search
          </Link>

          {loading ? null : isAuthenticated ? (
            <>
              <Link to="/account" className="text-sm text-slate-600 hover:text-slate-900">
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg px-4 py-2 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
