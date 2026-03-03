import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { errorResponse } from '../models/ApiResponse.js'

/**
 * Global error handler.
 * Catches unhandled errors and returns a clean JSON response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors -> 400
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => {
      const path = e.path.join('.')
      return path ? `${path}: ${e.message}` : e.message
    })
    res.status(400).json(errorResponse(messages.join(', ')))
    return
  }

  // Check for known error types
  if (err.name === 'SyntaxError' && 'body' in err) {
    // malformed JSON in request body
    res.status(400).json(errorResponse('Invalid JSON in request body'))
    return
  }

  // Don't leak internal error details in production
  const isDev = process.env.NODE_ENV !== 'production'

  // Log the full error server-side
  console.error(`[ERROR] ${err.message}`, isDev ? err.stack : '')

  res.status(500).json(
    errorResponse(isDev ? err.message : 'Internal server error')
  )
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    errorResponse(`Route not found: ${req.method} ${req.originalUrl}`)
  )
}
