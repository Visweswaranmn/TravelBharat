import { State } from '../models/State.js'
import { City } from '../models/City.js'
import { Destination } from '../models/Destination.js'
import { ApiError } from '../utils/ApiError.js'

// Returns states with their city/destination counts attached. Uses two
// aggregate $group queries (not one per state) so this stays cheap
// regardless of how many states exist.
export const getAllStates = async ({ search, page = 1, limit = 20 }) => {
  const filter = search ? { name: { $regex: search, $options: 'i' } } : {}
  const pageNum = Number(page) || 1
  const limitNum = Number(limit) || 20
  const skip = (pageNum - 1) * limitNum

  const [states, total, cityCounts, destinationCounts] = await Promise.all([
    State.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
    State.countDocuments(filter),
    City.aggregate([{ $group: { _id: '$state', count: { $sum: 1 } } }]),
    Destination.aggregate([{ $group: { _id: '$state', count: { $sum: 1 } } }]),
  ])

  const cityCountMap = new Map(cityCounts.map((c) => [c._id.toString(), c.count]))
  const destinationCountMap = new Map(destinationCounts.map((d) => [d._id.toString(), d.count]))

  const statesWithCounts = states.map((state) => ({
    ...state.toObject(),
    cityCount: cityCountMap.get(state._id.toString()) || 0,
    destinationCount: destinationCountMap.get(state._id.toString()) || 0,
  }))

  return { states: statesWithCounts, total, page: pageNum, pages: Math.max(Math.ceil(total / limitNum), 1) }
}

export const getStateBySlug = async (slug) => {
  const state = await State.findOne({ slug })
  if (!state) {
    throw new ApiError(404, 'State not found')
  }

  const [cities, destinationCount] = await Promise.all([
    City.find({ state: state._id }).sort({ name: 1 }),
    Destination.countDocuments({ state: state._id }),
  ])

  return { state, cities, destinationCount }
}

export const createState = (data) => State.create(data)

export const updateState = async (id, data) => {
  const state = await State.findById(id)
  if (!state) {
    throw new ApiError(404, 'State not found')
  }

  Object.assign(state, data)
  await state.save()
  return state
}

export const deleteState = async (id) => {
  const state = await State.findById(id)
  if (!state) {
    throw new ApiError(404, 'State not found')
  }

  // Guard against orphaning cities that still point at this state.
  const cityCount = await City.countDocuments({ state: id })
  if (cityCount > 0) {
    throw new ApiError(409, 'Cannot delete a state that still has cities — delete its cities first')
  }

  await state.deleteOne()
}
