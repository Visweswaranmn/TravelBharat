import { City } from '../models/City.js'
import { State } from '../models/State.js'
import { Destination } from '../models/Destination.js'
import { ApiError } from '../utils/ApiError.js'

export const getAllCities = async ({ state }) => {
  const filter = {}

  if (state) {
    const stateDoc = await State.findOne({ slug: state })
    // No matching state → no cities, rather than accidentally returning all cities.
    if (!stateDoc) return []
    filter.state = stateDoc._id
  }

  return City.find(filter).populate('state', 'name slug').sort({ name: 1 })
}

// A city's slug is only unique within its state, so looking one up needs
// both slugs — this is what powers /states/:stateSlug/:citySlug.
export const getCityBySlug = async (stateSlug, citySlug) => {
  const state = await State.findOne({ slug: stateSlug })
  if (!state) {
    throw new ApiError(404, 'State not found')
  }

  const city = await City.findOne({ state: state._id, slug: citySlug }).populate('state', 'name slug')
  if (!city) {
    throw new ApiError(404, 'City not found')
  }

  const destinationCount = await Destination.countDocuments({ city: city._id })

  return { city, destinationCount }
}

export const createCity = async (data) => {
  const state = await State.findById(data.state)
  if (!state) {
    throw new ApiError(400, 'The selected state does not exist')
  }
  return City.create(data)
}

export const updateCity = async (id, data) => {
  const city = await City.findById(id)
  if (!city) {
    throw new ApiError(404, 'City not found')
  }

  Object.assign(city, data)
  await city.save()
  return city
}

export const deleteCity = async (id) => {
  const city = await City.findById(id)
  if (!city) {
    throw new ApiError(404, 'City not found')
  }

  const destinationCount = await Destination.countDocuments({ city: id })
  if (destinationCount > 0) {
    throw new ApiError(409, 'Cannot delete a city that still has destinations — delete its destinations first')
  }

  await city.deleteOne()
}
