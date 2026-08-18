import api from './api'

export const getDestinations = (params) => api.get('/destinations', { params })
export const searchDestinations = (q) => api.get('/destinations/search', { params: { q } })
export const getDestinationBySlug = (slug) => api.get(`/destinations/slug/${slug}`)
