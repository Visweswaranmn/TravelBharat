import api from './api'

export const getStates = (params) => api.get('/states', { params })
export const getState = (slug) => api.get(`/states/${slug}`)
