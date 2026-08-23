import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/explore', label: 'Explore' },
  { to: '/categories', label: 'Categories' },
  { to: '/search', label: 'Search' },
]

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 text-lg" onClick={closeMenu}>
          <MapPin className="w-5 h-5 text-orange-600" />
          TravelBharat
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-medium text-slate-600 hover:text-slate-900">
              {link.label}
            </Link>
          ))}

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

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="md:hidden text-slate-600 hover:text-slate-900 p-2 -mr-2"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 py-2.5"
            >
              {link.label}
            </Link>
          ))}

          {loading ? null : isAuthenticated ? (
            <>
              <Link to="/account" onClick={closeMenu} className="text-sm font-medium text-slate-600 hover:text-slate-900 py-2.5">
                Hi, {user.name.split(' ')[0]} — My Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg px-4 py-2.5 mt-1 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="text-sm font-medium text-slate-600 hover:text-slate-900 py-2.5">
                Log in
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg px-4 py-2.5 mt-1 text-center transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
