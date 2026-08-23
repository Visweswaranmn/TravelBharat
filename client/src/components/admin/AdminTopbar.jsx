import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function AdminTopbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden text-slate-500 hover:text-slate-900 p-1 -ml-1"
        >
          <Menu className="w-5 h-5" />
        </button>
        <p className="text-sm text-slate-500 truncate">
          Welcome back, <span className="font-medium text-slate-900">{user?.name}</span>
        </p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Link to="/" className="hidden sm:inline text-sm text-slate-500 hover:text-slate-900">
          View Site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
