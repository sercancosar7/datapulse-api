import { z } from 'zod'

// User creation schema
export const createUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128),
  role: z.enum(['admin', 'user', 'moderator']).optional().default('user'),
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(255).optional(),
  role: z.enum(['admin', 'user', 'moderator']).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})

// Product creation
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name too short')
    .max(200),
  description: z
    .string()
    .min(10)
    .max(2000),
  price: z
    .number()
    .positive('Price must be positive')
    .max(99999.99),
  category: z.string().min(2).max(50),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  stock: z.number().int().min(0).optional().default(0),
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

// Query params validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().max(200).optional(),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
})

// Analytics query
export const analyticsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).optional().default(30),
  metric: z.enum(['visitors', 'revenue', 'orders', 'pageViews']).optional(),
})

// TODO: add product filter schema (category, price range, rating)

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type LoginInput = z.infer<typeof loginSchema>
