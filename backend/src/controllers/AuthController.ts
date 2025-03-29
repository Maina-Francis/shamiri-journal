import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService.js'
import { IUser } from '../models/User.js'

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body as Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>
      const { user, token } = await AuthService.register(userData)
      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to our platform.',
        data: {
          user: user.toJSON(),
          token,
        },
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        error: error instanceof Error ? error.message : 'Registration failed',
      })
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      const { user, token } = await AuthService.login(email, password)
      res.json({
        success: true,
        message: 'Login successful! Welcome back.',
        data: {
          user: user.toJSON(),
          token,
        },
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        error: error instanceof Error ? error.message : 'Login failed',
      })
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        throw new Error('No token provided')
      }

      const user = await AuthService.getCurrentUser(token)
      res.json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          user: user.toJSON(),
        },
      })
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed',
        error: error instanceof Error ? error.message : 'Authentication failed',
      })
    }
  }
} 