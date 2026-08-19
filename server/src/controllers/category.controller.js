import * as categoryService from '../services/categoryService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories()
  sendSuccess(res, 200, 'Categories fetched successfully', { categories })
}

export const getCategory = async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug)
  sendSuccess(res, 200, 'Category fetched successfully', { category })
}

export const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body)
  sendSuccess(res, 201, 'Category created successfully', { category })
}

export const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body)
  sendSuccess(res, 200, 'Category updated successfully', { category })
}

export const deleteCategory = async (req, res) => {
  await categoryService.deleteCategory(req.params.id)
  sendSuccess(res, 200, 'Category deleted successfully', null)
}
