import axios from 'axios'

// Central axios instance. Every service file (authService, stateService, ...)
// added in later phases will import this instead of creating its own client.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT (once auth exists) on every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
