import type { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { products } from '../data/mockData.js'
import { successResponse, errorResponse, buildPaginationMeta } from '../models/ApiResponse.js'
import { createProductSchema } from '../utils/validators.js'
import { parsePagination, matchesSearch, paginateArray } from '../utils/helpers.js'
import type { Product } from '../models/Product.js'

let productStore = [...products]

export function getProducts(req: Request, res: Response): void {
  const { page, limit } = parsePagination(req.query)
  const search = req.query.search as string | undefined
  const category = req.query.category as string | undefined
  const minPrice = parseFloat(req.query.minPrice as string)
  const maxPrice = parseFloat(req.query.maxPrice as string)
  const published = req.query.published as string | undefined

  let filtered = productStore

  // text search across name, description, tags
  if (search) {
    filtered = filtered.filter((p) =>
      matchesSearch(p as unknown as Record<string, unknown>, search, ['name', 'description', 'tags'])
    )
  }

  // category filter (case insensitive)
  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    )
  }

  // price range
  if (!isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price >= minPrice)
  }
  if (!isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price <= maxPrice)
  }

  // published filter
  if (published === 'true' || published === 'false') {
    filtered = filtered.filter((p) => p.isPublished === (published === 'true'))
  }

  // sorting
  const sortBy = req.query.sort as string
  const order = req.query.order === 'desc' ? -1 : 1

  switch (sortBy) {
    case 'price':
      filtered.sort((a, b) => (a.price - b.price) * order)
      break
    case 'rating':
      filtered.sort((a, b) => (a.rating - b.rating) * order)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name) * order)
      break
    case 'createdAt':
      filtered.sort((a, b) =>
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order
      )
      break
    default:
      // default sort by name
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  const { items, total } = paginateArray(filtered, page, limit)

  res.json(
    successResponse(items, buildPaginationMeta(total, page, limit))
  )
}

export function getProductById(req: Request, res: Response): void {
  const product = productStore.find((p) => p.id === req.params.id)

  if (!product) {
    res.status(404).json(errorResponse('Product not found'))
    return
  }

  res.json(successResponse(product))
}

// get by slug (useful for frontend routing)
export function getProductBySlug(req: Request, res: Response): void {
  const product = productStore.find((p) => p.slug === req.params.slug)

  if (!product) {
    res.status(404).json(errorResponse('Product not found'))
    return
  }

  res.json(successResponse(product))
}

export function createProduct(req: Request, res: Response): void {
  const parsed = createProductSchema.parse(req.body)

  const slug = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // check duplicate slug
  if (productStore.some((p) => p.slug === slug)) {
    res.status(409).json(errorResponse('Product with similar name already exists'))
    return
  }

  const newProduct: Product = {
    id: uuid(),
    name: parsed.name,
    slug,
    description: parsed.description,
    price: parsed.price,
    category: parsed.category,
    tags: parsed.tags ?? [],
    stock: parsed.stock ?? 0,
    isPublished: false, // new products start as draft
    rating: 0,
    reviewCount: 0,
    imageUrl: `https://picsum.photos/seed/${slug}/400/400`,
    createdAt: new Date().toISOString(),
  }

  productStore = [...productStore, newProduct]

  res.status(201).json(successResponse(newProduct))
}

export function getCategories(_req: Request, res: Response): void {
  const categories = [...new Set(productStore.map((p) => p.category))].sort()
  res.json(successResponse(categories))
}

export function deleteProduct(req: Request, res: Response): void {
  const index = productStore.findIndex((p) => p.id === req.params.id)

  if (index === -1) {
    res.status(404).json(errorResponse('Product not found'))
    return
  }

  productStore = productStore.filter((_, i) => i !== index)
  res.status(204).send()
}
