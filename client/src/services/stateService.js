import api from './api'

export const getStates = (params) => api.get('/states', { params })
export const getState = (slug) => api.get(`/states/${slug}`)
export const createState = (data) => api.post('/states', data)
export const updateState = (id, data) => api.put(`/states/${id}`, data)
export const deleteState = (id) => api.delete(`/states/${id}`)
