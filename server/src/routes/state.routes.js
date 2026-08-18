import { Router } from 'express'
import * as stateController from '../controllers/state.controller.js'
import * as cityController from '../controllers/city.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createStateValidation, updateStateValidation } from '../validators/state.validators.js'

const router = Router()

router.get('/', stateController.getStates)

// Nested under states since a city's slug is only unique per state.
router.get('/:stateSlug/cities/:citySlug', cityController.getCity)

router.get('/:slug', stateController.getState)
router.post('/', protect, adminOnly, createStateValidation, validate, stateController.createState)
router.put('/:id', protect, adminOnly, updateStateValidation, validate, stateController.updateState)
router.delete('/:id', protect, adminOnly, stateController.deleteState)

export default router
