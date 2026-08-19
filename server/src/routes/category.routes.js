import { Router } from 'express'
import * as categoryController from '../controllers/category.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createCategoryValidation, updateCategoryValidation } from '../validators/category.validators.js'

const router = Router()

router.get('/', categoryController.getCategories)
router.get('/:slug', categoryController.getCategory)
router.post('/', protect, adminOnly, createCategoryValidation, validate, categoryController.createCategory)
router.put('/:id', protect, adminOnly, updateCategoryValidation, validate, categoryController.updateCategory)
router.delete('/:id', protect, adminOnly, categoryController.deleteCategory)

export default router
