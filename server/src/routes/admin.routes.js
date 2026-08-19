import { Router } from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// Every route in this file is admin-only.
router.use(protect, adminOnly)

router.get('/stats', adminController.getStats)

export default router
