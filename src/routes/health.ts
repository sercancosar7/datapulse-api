import { Router } from 'express'
import { successResponse } from '../models/ApiResponse.js'

const router = Router()

const startTime = Date.now()

router.get('/', (_req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000)

  res.json(successResponse({
    status: 'healthy',
    uptime: `${uptime}s`,
    version: '1.2.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
    },
    timestamp: new Date().toISOString(),
  }))
})

export default router
