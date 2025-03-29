import request from 'supertest'
import { app } from '../index.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('Authentication', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  }

  beforeAll(async () => {
    // Clean up the database before tests
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user).toHaveProperty('id')
      expect(response.body.data.user.email).toBe(testUser.email)
      expect(response.body.data.token).toBeDefined()
    })

    it('should not register a user with existing email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user).toHaveProperty('id')
      expect(response.body.data.token).toBeDefined()
    })

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /auth/me', () => {
    let token: string

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
      token = loginResponse.body.data.token
    })

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user).toHaveProperty('id')
      expect(response.body.data.user.email).toBe(testUser.email)
    })

    it('should not get current user with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
}) 