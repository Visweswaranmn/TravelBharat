import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  usePageTitle('Sign Up')

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address'
    if (!form.password) nextErrors.password = 'Password is required'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const user = await register(form.name, form.email, form.password)
      toast.success(`Welcome to TravelBharat, ${user.name.split(' ')[0]}!`)
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Jane Doe' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', placeholder: '••••••••' },
    {
      name: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      autoComplete: 'new-password',
      placeholder: '••••••••',
    },
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 text-center">Create your account</h1>
        <p className="text-slate-500 text-center mt-1 mb-6">Join TravelBharat and start exploring</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {fields.map(({ name, label, type, autoComplete, placeholder }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
              </label>
              <input
                id={name}
                type={type}
                autoComplete={autoComplete}
                value={form[name]}
                onChange={handleChange(name)}
                className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors[name] ? 'border-red-400' : 'border-slate-300'
                }`}
                placeholder={placeholder}
              />
              {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 transition-colors"
          >
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
