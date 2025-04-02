import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../lib/errors.js'

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'No token provided or invalid token format'
    });
    return;
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'No token provided'
    });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
    
    // Get user from database to ensure they exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    })
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    // Attach user to request object
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
    return;
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
