import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import testRoutes from './routes/test.routes.js'
import authRoutes from './routes/auth.js'

// Load environment variables
dotenv.config()

export const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
  })
} 