import type { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../models/ApiResponse.js'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Simple in-memory rate limiter
// For production, use redis-based solution (e.g. ioredis + sliding window)
const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  windowMs: number    // time window in ms
  maxRequests: number // max requests per window
}

const defaultOptions: RateLimitOptions = {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 60,       // 60 req/min
}

export function rateLimit(options: Partial<RateLimitOptions> = {}) {
  const config = { ...defaultOptions, ...options }

  return (req: Request, res: Response, next: NextFunction): void => {
    // use IP as the key, or userId if authenticated
    const key = req.userId || req.ip || 'unknown'
    const now = Date.now()

    let entry = store.get(key)

    if (!entry || entry.resetAt < now) {
      entry = {
        count: 0,
        resetAt: now + config.windowMs,
      }
      store.set(key, entry)
    }

    entry.count++

    // set rate limit headers
    const remaining = Math.max(0, config.maxRequests - entry.count)
    res.setHeader('X-RateLimit-Limit', config.maxRequests)
    res.setHeader('X-RateLimit-Remaining', remaining)
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000))

    if (entry.count > config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      res.setHeader('Retry-After', retryAfter)
      res.status(429).json(errorResponse(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      ))
      return
    }

    next()
  }
}
