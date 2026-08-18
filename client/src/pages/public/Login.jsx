import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/'

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
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 text-center">Welcome back</h1>
        <p className="text-slate-500 text-center mt-1 mb-6">Log in to continue exploring India</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.email ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange('password')}
              className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.password ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 transition-colors"
          >
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-orange-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
