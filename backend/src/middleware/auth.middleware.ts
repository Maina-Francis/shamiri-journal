
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../lib/errors.js'

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided or invalid token format')
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new ApiError(401, 'No token provided')
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
      
      // Get user from database to ensure they exist
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true }
      })
      
      if (!user) {
        throw new ApiError(401, 'User not found')
      }
      
      // Attach user to request object
      req.user = user
      next()
    } catch (err) {
      console.error('JWT verification error:', err)
      throw new ApiError(401, 'Invalid or expired token')
    }
  } catch (error) {
    next(error)
  }
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}
