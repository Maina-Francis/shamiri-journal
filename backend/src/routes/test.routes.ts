import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.middleware.js'
import { testController } from '../controllers/test.controller.js'

const router = Router()

// Validation schema for test endpoint
const testSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required'),
  }),
})

router.post('/', validate(testSchema), testController.test)
router.get('/', testController.test)

export default router 