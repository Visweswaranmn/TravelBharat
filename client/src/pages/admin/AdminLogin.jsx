import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function AdminLogin() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  usePageTitle('Admin Login')

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address'
    if (!form.password) nextErrors.password = 'Password is required'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const user = await login(form.email, form.password)

      // Same login endpoint as the public site — this page is just a
      // separate entry point, so a non-admin account gets signed right back out.
      if (user.role !== 'admin') {
        logout()
        toast.error('This account does not have admin access.')
        return
      }

      toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
      navigate('/admin', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-600/20 text-orange-500 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-white">TravelBharat Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage the platform</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              className={`w-full rounded-lg border bg-slate-900 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder="admin@travelbharat.com"
            />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange('password')}
              className={`w-full rounded-lg border bg-slate-900 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.password ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 transition-colors"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
