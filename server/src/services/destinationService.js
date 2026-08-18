import { Destination } from '../models/Destination.js'
import { State } from '../models/State.js'
import { City } from '../models/City.js'
import { Category } from '../models/Category.js'
import { ApiError } from '../utils/ApiError.js'

const POPULATE_FIELDS = [
  { path: 'state', select: 'name slug' },
  { path: 'city', select: 'name slug' },
  { path: 'category', select: 'name slug' },
]

const EMPTY_PAGE = { destinations: [], total: 0, page: 1, pages: 1 }

export const getAllDestinations = async ({ state, city, category, featured, page = 1, limit = 12 }) => {
  const filter = {}

  if (state) {
    const stateDoc = await State.findOne({ slug: state })
    if (!stateDoc) return EMPTY_PAGE
    filter.state = stateDoc._id
  }

  if (city) {
    // A city slug is only unique per state, so without a state filter we
    // may match more than one city — include all of them rather than
    // guessing which one the caller meant.
    const cityQuery = { slug: city }
    if (filter.state) cityQuery.state = filter.state
    const cityDocs = await City.find(cityQuery)
    if (cityDocs.length === 0) return EMPTY_PAGE
    filter.city = { $in: cityDocs.map((c) => c._id) }
  }

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category })
    if (!categoryDoc) return EMPTY_PAGE
    filter.category = categoryDoc._id
  }

  if (featured !== undefined) {
    filter.featured = featured === 'true'
  }

  const pageNum = Number(page) || 1
  const limitNum = Number(limit) || 12
  const skip = (pageNum - 1) * limitNum

  const [destinations, total] = await Promise.all([
    Destination.find(filter).populate(POPULATE_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Destination.countDocuments(filter),
  ])

  return { destinations, total, page: pageNum, pages: Math.max(Math.ceil(total / limitNum), 1) }
}

export const searchDestinations = async (query) => {
  if (!query || !query.trim()) {
    return []
  }

  return Destination.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
    .populate(POPULATE_FIELDS)
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
}

export const getDestinationBySlug = async (slug) => {
  const destination = await Destination.findOne({ slug })
    .populate(POPULATE_FIELDS)
    .populate({
      path: 'nearbyAttractions',
      select: 'name slug shortDescription images state city',
      populate: [
        { path: 'state', select: 'name slug' },
        { path: 'city', select: 'name slug' },
      ],
    })

  if (!destination) {
    throw new ApiError(404, 'Destination not found')
  }

  return destination
}

export const createDestination = async (data) => {
  const [state, city, category] = await Promise.all([
    State.findById(data.state),
    City.findById(data.city),
    Category.findById(data.category),
  ])

  if (!state) throw new ApiError(400, 'The selected state does not exist')
  if (!city) throw new ApiError(400, 'The selected city does not exist')
  if (!category) throw new ApiError(400, 'The selected category does not exist')

  return Destination.create(data)
}

export const updateDestination = async (id, data) => {
  const destination = await Destination.findById(id)
  if (!destination) {
    throw new ApiError(404, 'Destination not found')
  }

  Object.assign(destination, data)
  await destination.save()
  return destination
}

export const deleteDestination = async (id) => {
  const destination = await Destination.findById(id)
  if (!destination) {
    throw new ApiError(404, 'Destination not found')
  }

  await destination.deleteOne()
}
