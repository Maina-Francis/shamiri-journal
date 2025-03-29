import { PrismaClient } from '@prisma/client'

export abstract class BaseModel {
  protected prisma: PrismaClient
  protected table: string

  constructor(table: string) {
    this.prisma = new PrismaClient()
    this.table = table
  }

  abstract validate(): boolean
  abstract toJSON(): Record<string, any>
} 