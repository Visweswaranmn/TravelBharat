import { Router } from 'express'
import * as destinationController from '../controllers/destination.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createDestinationValidation, updateDestinationValidation } from '../validators/destination.validators.js'

const router = Router()

// Specific paths before /:id-style routes would go, if we had one — we
// don't (the admin table already has full destination objects from the
// list, so there's no need for a redundant GET /:id).
router.get('/search', destinationController.searchDestinations)
router.get('/slug/:slug', destinationController.getDestinationBySlug)
router.get('/', destinationController.getDestinations)

router.post('/', protect, adminOnly, createDestinationValidation, validate, destinationController.createDestination)
router.put('/:id', protect, adminOnly, updateDestinationValidation, validate, destinationController.updateDestination)
router.delete('/:id', protect, adminOnly, destinationController.deleteDestination)

export default router
