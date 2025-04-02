import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService.js'
import { IUser } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../models/user.model.js'
import { CustomRequest } from '../types/auth.js'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        })
      }

      // Hash password
      const hashedPassword = await hashPassword(password)

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token },
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Error registering user',
      })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        })
      }

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

      const { password: _, ...userWithoutPassword } = user

      res.json({
        success: true,
        message: 'Login successful',
        data: { user: userWithoutPassword, token },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Error logging in',
      })
    }
  }

  static async changePassword(req: CustomRequest, res: Response) {
    try {
      const userId = req.user?.id
      const { currentPassword, newPassword } = req.body

      // Get user with current password
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      // Verify current password
      const isPasswordValid = await comparePassword(currentPassword, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        })
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword)

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      })

      res.json({
        success: true,
        message: 'Password updated successfully',
      })
    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({
        success: false,
        message: 'Error changing password',
      })
    }
  }

  static async getCurrentUser(req: CustomRequest, res: Response) {
    try {
      const userId = req.user?.id
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }

      res.json({
        success: true,
        data: { user },
      })
    } catch (error) {
      console.error('Get current user error:', error)
      res.status(500).json({
        success: false,
        message: 'Error getting current user',
      })
    }
  }
} 