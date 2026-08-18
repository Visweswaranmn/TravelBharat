import { Router } from 'express'
import * as cityController from '../controllers/city.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createCityValidation, updateCityValidation } from '../validators/city.validators.js'

const router = Router()

router.get('/', cityController.getCities)
router.post('/', protect, adminOnly, createCityValidation, validate, cityController.createCity)
router.put('/:id', protect, adminOnly, updateCityValidation, validate, cityController.updateCity)
router.delete('/:id', protect, adminOnly, cityController.deleteCity)

export default router
