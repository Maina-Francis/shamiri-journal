import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/AuthService.js'

export const updateLastActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      next()
      return
    }

    const user = await AuthService.getCurrentUser(token)
    const newToken = AuthService.generateNewToken(user)
    res.setHeader('X-New-Token', newToken)
    next()
  } catch (error) {
    next(error)
  }
} 