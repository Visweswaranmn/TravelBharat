import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function AdminTopbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <p className="text-sm text-slate-500">
        Welcome back, <span className="font-medium text-slate-900">{user?.name}</span>
      </p>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
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
