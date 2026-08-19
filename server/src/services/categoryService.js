import { Category } from '../models/Category.js'
import { Destination } from '../models/Destination.js'
import { ApiError } from '../utils/ApiError.js'

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

export const createCategory = (data) => Category.create(data)

export const updateCategory = async (id, data) => {
  const category = await Category.findById(id)
  if (!category) {
    throw new ApiError(404, 'Category not found')
  }

  Object.assign(category, data)
  await category.save()
  return category
}

export const deleteCategory = async (id) => {
  const category = await Category.findById(id)
  if (!category) {
    throw new ApiError(404, 'Category not found')
  }

  const destinationCount = await Destination.countDocuments({ category: id })
  if (destinationCount > 0) {
    throw new ApiError(409, 'Cannot delete a category that still has destinations — reassign or delete them first')
  }

  await category.deleteOne()
}
