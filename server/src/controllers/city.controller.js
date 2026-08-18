import * as cityService from '../services/cityService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getCities = async (req, res) => {
  const cities = await cityService.getAllCities({ state: req.query.state })
  sendSuccess(res, 200, 'Cities fetched successfully', { cities })
}

export const getCity = async (req, res) => {
  const result = await cityService.getCityBySlug(req.params.stateSlug, req.params.citySlug)
  sendSuccess(res, 200, 'City fetched successfully', result)
}

export const createCity = async (req, res) => {
  const city = await cityService.createCity(req.body)
  sendSuccess(res, 201, 'City created successfully', { city })
}

export const updateCity = async (req, res) => {
  const city = await cityService.updateCity(req.params.id, req.body)
  sendSuccess(res, 200, 'City updated successfully', { city })
}

export const deleteCity = async (req, res) => {
  await cityService.deleteCity(req.params.id)
  sendSuccess(res, 200, 'City deleted successfully', null)
}
