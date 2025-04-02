import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middleware/errorHandler.middleware.js'
import { notFound } from './middleware/notFound.middleware.js'
import testRoutes from './routes/test.routes.js'
import authRoutes from './routes/auth.routes.js'
import journalRoutes from './routes/journal.routes.js'
import { specs } from './config/swagger.js'

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// Routes
app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/journals', journalRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
    console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`)
  })
}

export { app }
