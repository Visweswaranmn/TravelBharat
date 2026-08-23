import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Building2, Compass, Tag, User, X } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/states', label: 'States', icon: Map },
  { to: '/admin/cities', label: 'Cities', icon: Building2 },
  { to: '/admin/destinations', label: 'Destinations', icon: Compass },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

// On desktop this sits statically in the flex row (see AdminLayout). On
// mobile it becomes a fixed off-canvas drawer, toggled by AdminTopbar's
// hamburger button and closed via the backdrop, the X button, or picking a link.
export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={onClose} />}

      <aside
        className={`w-60 shrink-0 bg-slate-900 text-slate-300 min-h-screen p-4 fixed inset-y-0 left-0 z-50 md:static ${
          isOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">TravelBharat</span>
            <span className="text-xs bg-orange-600 text-white px-1.5 py-0.5 rounded">Admin</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close menu" className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-orange-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
