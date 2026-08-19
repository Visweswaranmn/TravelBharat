import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Building2, Compass, Tag, User } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/states', label: 'States', icon: Map },
  { to: '/admin/cities', label: 'Cities', icon: Building2 },
  { to: '/admin/destinations', label: 'Destinations', icon: Compass },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

export default function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 min-h-screen p-4">
      <div className="flex items-center gap-2 px-2 py-3 mb-4">
        <span className="font-semibold text-white">TravelBharat</span>
        <span className="text-xs bg-orange-600 text-white px-1.5 py-0.5 rounded">Admin</span>
      </div>
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
  )
}
