import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Admin Profile</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg">
        <dl className="space-y-4">
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
