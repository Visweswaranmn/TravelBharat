import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiters.js'
import { registerValidation, loginValidation } from '../validators/auth.validators.js'

const router = Router()

router.post('/register', authLimiter, registerValidation, validate, register)
router.post('/login', authLimiter, loginValidation, validate, login)
router.get('/me', protect, getMe)

export default router
