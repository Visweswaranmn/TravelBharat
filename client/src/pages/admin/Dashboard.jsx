import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Map, Building2, Compass, Tag } from 'lucide-react'
import { getDashboardStats } from '../../services/adminService'
import { usePageTitle } from '../../hooks/usePageTitle'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [status, setStatus] = useState('loading')

  usePageTitle('Admin Dashboard')

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        setStats(res.data.data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'loading') return <LoadingSpinner label="Loading dashboard..." />
  if (status === 'error') return <ErrorMessage message="Couldn't load dashboard stats." />

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Map} label="Total States" value={stats.totalStates} />
        <StatCard icon={Building2} label="Total Cities" value={stats.totalCities} />
        <StatCard icon={Compass} label="Total Destinations" value={stats.totalDestinations} />
        <StatCard icon={Tag} label="Total Categories" value={stats.totalCategories} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Destinations</h2>
        {stats.recentDestinations.length === 0 ? (
          <p className="text-sm text-slate-500">No destinations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">State</th>
                  <th className="py-2 pr-4 font-medium">City</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDestinations.map((destination) => (
                  <tr key={destination._id} className="border-b border-slate-100 last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-slate-900">
                      <Link to={`/destinations/${destination.slug}`} className="hover:text-orange-600">
                        {destination.name}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600">{destination.state?.name}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{destination.city?.name}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{destination.category?.name}</td>
                    <td className="py-2.5 pr-4 text-slate-500">{new Date(destination.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
