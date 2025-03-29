import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/AuthService.js'

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new Error('No token provided')
    }

    const user = await AuthService.getCurrentUser(token)
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    })
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