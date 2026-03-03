// Standard API response wrapper
// Every endpoint should return this format for consistency

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: PaginationMeta
  timestamp: string
}

export function successResponse<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
  }
}

export function errorResponse(message: string): ApiResponse {
  return {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  }
}

// helper to build pagination meta from query params
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
