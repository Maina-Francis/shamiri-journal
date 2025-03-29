import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User.js'

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private static readonly JWT_EXPIRES_IN = '1h'
  private static readonly INACTIVITY_THRESHOLD = 60 * 60 * 1000 // 1 hour in milliseconds

  static async register(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ user: User; token: string }> {
    const existingUser = await User.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = new User(userData)
    const savedUser = await user.save()
    const token = this.generateToken(savedUser)

    return { user: savedUser, token }
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await User.findByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = this.generateToken(user)
    return { user, token }
  }

  static async getCurrentUser(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { id: string; lastActivity: number }
      const user = await User.findById(decoded.id)
      if (!user) {
        throw new Error('User not found')
      }

      // Check for inactivity
      const now = Date.now()
      if (now - decoded.lastActivity > this.INACTIVITY_THRESHOLD) {
        throw new Error('Session expired due to inactivity')
      }

      return user
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Session expired')
      }
      throw new Error('Invalid token')
    }
  }

  static generateNewToken(user: User): string {
    return this.generateToken(user)
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.toJSON().id,
        lastActivity: Date.now()
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )
  }
} 