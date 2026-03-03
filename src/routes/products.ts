import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  getCategories,
  deleteProduct,
} from '../controllers/productController.js'

const router = Router()

// GET /api/products - list products
// supports: ?search=, ?category=, ?minPrice=, ?maxPrice=, ?published=
//           ?sort=price|rating|name|createdAt, ?order=asc|desc
//           ?page=, ?limit=
router.get('/', getProducts)

// GET /api/products/categories - list unique categories
router.get('/categories', getCategories)

// GET /api/products/slug/:slug - get product by URL slug
router.get('/slug/:slug', getProductBySlug)

// GET /api/products/:id - get single product
router.get('/:id', getProductById)

// POST /api/products - create product (auth required)
router.post('/', authMiddleware, createProduct)

// TODO: PUT /api/products/:id - update product

// DELETE /api/products/:id - delete product (auth required)
router.delete('/:id', authMiddleware, deleteProduct)

export default router
