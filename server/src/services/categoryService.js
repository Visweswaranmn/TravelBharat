import { Category } from '../models/Category.js'
import { Destination } from '../models/Destination.js'
import { ApiError } from '../utils/ApiError.js'

// Read-only for now — categories are seeded directly. Admin create/edit/
// delete for categories arrives with the Admin CRUD phase.
export const getAllCategories = async () => {
  const [categories, destinationCounts] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Destination.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ])

  const countMap = new Map(destinationCounts.map((d) => [d._id.toString(), d.count]))

  return categories.map((category) => ({
    ...category.toObject(),
    destinationCount: countMap.get(category._id.toString()) || 0,
  }))
}

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug })
  if (!category) {
    throw new ApiError(404, 'Category not found')
  }
  return category
}
