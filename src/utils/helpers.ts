import type { Request } from 'express'

/**
 * Parse pagination params from query string.
 * Defaults: page=1, limit=20, max limit=100
 */
export function parsePagination(query: Request['query']): { page: number; limit: number; offset: number } {
  let page = parseInt(query.page as string, 10)
  let limit = parseInt(query.limit as string, 10)

  if (isNaN(page) || page < 1) page = 1
  if (isNaN(limit) || limit < 1) limit = 20
  if (limit > 100) limit = 100 // don't let clients go crazy

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  }
}

/**
 * Simple text search - checks if any of the fields contain the search term
 * Case insensitive
 */
export function matchesSearch(obj: Record<string, unknown>, search: string, fields: string[]): boolean {
  const term = search.toLowerCase().trim()
  if (!term) return true

  return fields.some((field) => {
    const value = obj[field]
    if (typeof value === 'string') {
      return value.toLowerCase().includes(term)
    }
    if (Array.isArray(value)) {
      return value.some((v) => String(v).toLowerCase().includes(term))
    }
    return false
  })
}

/**
 * Paginate an array. Returns the slice + total count.
 */
export function paginateArray<T>(items: T[], page: number, limit: number): { items: T[]; total: number } {
  const offset = (page - 1) * limit
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
  }
}

// generate a simple request id for logging
// not crypto-grade, just for tracing requests
export function generateRequestId(): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).substring(2, 8)
  return `req_${ts}_${rand}`
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
