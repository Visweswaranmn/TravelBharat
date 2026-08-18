import api from './api'

// Thin wrappers around the auth endpoints — AuthContext owns the state
// (user, token, loading), this file just knows how to talk to the API.
export const registerRequest = (payload) => api.post('/auth/register', payload)
export const loginRequest = (payload) => api.post('/auth/login', payload)
export const fetchCurrentUser = () => api.get('/auth/me')
