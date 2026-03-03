import type { Request, Response, NextFunction } from 'express'
import { generateRequestId } from '../utils/helpers.js'

/**
 * Request logging middleware.
 * Logs method, url, status code, and response time.
 *
 * In production we'd use morgan or pino, but this gives us
 * more control over the format for demo purposes.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = generateRequestId()
  const start = Date.now()

  // attach request id so controllers can reference it
  req.headers['x-request-id'] = requestId
  res.setHeader('X-Request-Id', requestId)

  // log when the response finishes
  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode

    // color code by status for dev readability
    const statusColor = status >= 500 ? '\x1b[31m' // red
      : status >= 400 ? '\x1b[33m' // yellow
      : status >= 300 ? '\x1b[36m' // cyan
      : '\x1b[32m' // green
    const reset = '\x1b[0m'

    console.log(
      `${statusColor}${status}${reset} ${req.method} ${req.originalUrl} - ${duration}ms [${requestId}]`
    )
  })

  next()
}
