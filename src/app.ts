import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { requestLogger } from './middleware/logger.js'
import { rateLimit } from './middleware/rateLimit.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { generateToken } from './middleware/auth.js'
import { loginSchema } from './utils/validators.js'
import { users } from './data/mockData.js'
import { successResponse, errorResponse } from './models/ApiResponse.js'

// Route imports
import healthRoutes from './routes/health.js'
import userRoutes from './routes/users.js'
import productRoutes from './routes/products.js'
import analyticsRoutes from './routes/analytics.js'

export function createApp() {
  const app = express()

  // ---- Global middleware ----
  app.use(helmet())
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
  app.use(express.json({ limit: '10mb' }))
  app.use(requestLogger)
  app.use(rateLimit({ windowMs: 60_000, maxRequests: 100 }))

  // ---- Auth route (not behind /api prefix for simplicity) ----
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body)

      // Demo auth: accept any user from our mock data with password "demo123"
      // In a real app you'd hash-compare against stored passwords
      const user = users.find((u) => u.email === email)

      if (!user || password !== 'demo123') {
        res.status(401).json(errorResponse('Invalid credentials'))
        return
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      res.json(successResponse({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        expiresIn: '24h',
      }))
    } catch (err) {
      // let the error handler deal with zod errors
      throw err
    }
  })

  // ---- API Routes ----
  app.use('/api/health', healthRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/products', productRoutes)
  app.use('/api/analytics', analyticsRoutes)

  // ---- Root route ----
  app.get('/', (_req, res) => {
    res.json({
      name: 'DataPulse API',
      version: '1.2.0',
      docs: '/api/health',
      endpoints: {
        auth: 'POST /api/auth/login',
        users: 'GET /api/users',
        products: 'GET /api/products',
        analytics: 'GET /api/analytics/overview',
        health: 'GET /api/health',
      },
    })
  })

  // ---- Error handling ----
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
