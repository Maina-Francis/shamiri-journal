import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User.js'

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
  private static readonly JWT_EXPIRES_IN = '24h'

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
      const decoded = jwt.verify(token, this.JWT_SECRET) as { id: string }
      const user = await User.findById(decoded.id)
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.toJSON().id },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    )
  }
} 