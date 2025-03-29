import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  statusCode?: number
  code?: string
  errors?: Array<{ message: string }>
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  // Handle validation errors (Zod)
  if (err.errors && err.errors.length > 0) {
    statusCode = 400
    message = err.errors[0].message
  }

  // Handle database errors (Prisma)
  if (err.code === 'P2002') {
    statusCode = 409
    message = 'A record with this value already exists'
  }

  // Handle session expiration
  if (err.message === 'Session expired' || err.message === 'Session expired due to inactivity') {
    statusCode = 401
  }

  // Handle invalid token
  if (err.message === 'Invalid token' || err.message === 'No token provided') {
    statusCode = 401
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
} 