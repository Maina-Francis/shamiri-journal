
import { PrismaClient } from '@prisma/client'

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined
}

// Create a singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// If not in production, attach prisma to the global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma }
