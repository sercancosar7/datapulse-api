import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { errorResponse } from '../models/ApiResponse.js'

// In a real app this would come from env vars
const JWT_SECRET = 'datapulse-demo-secret-key-not-for-production'
const TOKEN_EXPIRY = '24h'

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string
      userRole?: string
    }
  }
}

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

/**
 * Generate a JWT token for demo purposes.
 * In production you'd verify against a real user store.
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

/**
 * Auth middleware - validates JWT from Authorization header.
 * Format: Bearer <token>
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json(errorResponse('Authorization header is required'))
    return
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json(errorResponse('Invalid authorization format. Use: Bearer <token>'))
    return
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json(errorResponse('Token expired'))
      return
    }
    res.status(401).json(errorResponse('Invalid token'))
    return
  }
}

/**
 * Role-based access control.
 * Use after authMiddleware.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json(errorResponse('Insufficient permissions'))
      return
    }
    next()
  }
}
