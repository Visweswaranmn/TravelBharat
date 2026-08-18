import api from './api'

export const getCities = (params) => api.get('/cities', { params })
export const getCity = (stateSlug, citySlug) => api.get(`/states/${stateSlug}/cities/${citySlug}`)
