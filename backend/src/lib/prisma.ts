
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined
}

// Create a singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// If not in production, attach prisma to the global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma }
