import { BaseModel } from './BaseModel.js'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

type UserRole = 'USER' | 'ADMIN'

export interface IUser {
  id?: string
  name: string
  email: string
  password: string
  role?: UserRole
  createdAt?: Date
  updatedAt?: Date
}

export class User extends BaseModel {
  private static prisma: PrismaClient = new PrismaClient()
  private id?: string
  private name: string
  private email: string
  private password: string
  private role: UserRole
  private createdAt?: Date
  private updatedAt?: Date

  constructor(data: IUser) {
    super('user')
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.role = data.role || 'USER'
    this.id = data.id
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
  }

  validate(): boolean {
    return !!(this.name && this.email && this.password)
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  async save(): Promise<User> {
    if (!this.validate()) {
      throw new Error('Invalid user data')
    }

    await this.hashPassword()

    const user = await User.prisma.user.create({
      data: {
        name: this.name,
        email: this.email,
        password: this.password,
      } as any,
    })

    return new User(user)
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await User.prisma.user.findUnique({
      where: { email },
    })

    return user ? new User(user) : null
  }

  static async findById(id: string): Promise<User | null> {
    const user = await User.prisma.user.findUnique({
      where: { id },
    })

    return user ? new User(user) : null
  }
}

// Validation schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

// Password hashing methods
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}; 