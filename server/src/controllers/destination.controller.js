import * as destinationService from '../services/destinationService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getDestinations = async (req, res) => {
  const { state, city, category, featured, page, limit } = req.query
  const result = await destinationService.getAllDestinations({ state, city, category, featured, page, limit })
  sendSuccess(res, 200, 'Destinations fetched successfully', result)
}

export const searchDestinations = async (req, res) => {
  const destinations = await destinationService.searchDestinations(req.query.q)
  sendSuccess(res, 200, 'Search results fetched successfully', { destinations, count: destinations.length })
}

export const getDestinationBySlug = async (req, res) => {
  const destination = await destinationService.getDestinationBySlug(req.params.slug)
  sendSuccess(res, 200, 'Destination fetched successfully', { destination })
}

export const createDestination = async (req, res) => {
  const destination = await destinationService.createDestination(req.body)
  sendSuccess(res, 201, 'Destination created successfully', { destination })
}

export const updateDestination = async (req, res) => {
  const destination = await destinationService.updateDestination(req.params.id, req.body)
  sendSuccess(res, 200, 'Destination updated successfully', { destination })
}

export const deleteDestination = async (req, res) => {
  await destinationService.deleteDestination(req.params.id)
  sendSuccess(res, 200, 'Destination deleted successfully', null)
}
