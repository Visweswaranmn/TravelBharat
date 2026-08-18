import * as categoryService from '../services/categoryService.js'
import { sendSuccess } from '../utils/apiResponse.js'

export const getCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories()
  sendSuccess(res, 200, 'Categories fetched successfully', { categories })
}
