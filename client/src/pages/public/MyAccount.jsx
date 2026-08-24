import { useAuth } from '../../context/AuthContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function MyAccount() {
  const { user } = useAuth()

  usePageTitle('My Account')

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 p-8">
        <h1 className="text-2xl font-semibold text-slate-900">My Account</h1>

        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="text-slate-900 font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="text-slate-900 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Role</dt>
            <dd className="text-slate-900 font-medium capitalize">{user.role}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
