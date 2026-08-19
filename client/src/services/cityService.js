import api from './api'

export const getCities = (params) => api.get('/cities', { params })
export const getCity = (stateSlug, citySlug) => api.get(`/states/${stateSlug}/cities/${citySlug}`)
export const createCity = (data) => api.post('/cities', data)
export const updateCity = (id, data) => api.put(`/cities/${id}`, data)
export const deleteCity = (id) => api.delete(`/cities/${id}`)
