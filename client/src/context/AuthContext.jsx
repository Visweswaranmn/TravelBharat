import { createContext, useContext, useEffect, useState } from 'react'
import { registerRequest, loginRequest, fetchCurrentUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // True until we've checked whether a saved token still works —
  // ProtectedRoute holds off rendering until this settles.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    fetchCurrentUser()
      .then((res) => setUser(res.data.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await loginRequest({ email, password })
    const { user: loggedInUser, token } = res.data.data
    localStorage.setItem('token', token)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (name, email, password) => {
    const res = await registerRequest({ name, email, password })
    const { user: newUser, token } = res.data.data
    localStorage.setItem('token', token)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = { user, loading, isAuthenticated: !!user, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
