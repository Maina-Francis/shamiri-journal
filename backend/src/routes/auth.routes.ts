import { Router } from 'express'
import { AuthController } from '../controllers/AuthController.js'
import { validate } from '../middleware/validate.middleware.js'
import { loginSchema, registerSchema, changePasswordSchema, updateProfileSchema } from '../models/user.model.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { asyncHandler } from '../lib/async-handler.js'

const router = Router()

// Public routes
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login))
router.post('/register', validate(registerSchema), asyncHandler(AuthController.register))

// Protected routes (require authentication)
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(AuthController.changePassword))
router.put('/profile', authenticate, validate(updateProfileSchema), asyncHandler(AuthController.updateProfile))
router.get('/me', authenticate, asyncHandler(AuthController.getCurrentUser))

export default router 