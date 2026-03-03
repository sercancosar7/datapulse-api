import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  getOverview,
  getDailyStats,
  getTopProductsHandler,
  getSummary,
} from '../controllers/analyticsController.js'

const router = Router()

// All analytics routes require authentication
router.use(authMiddleware)

// GET /api/analytics/overview - high-level metrics
router.get('/overview', getOverview)

// GET /api/analytics/daily - daily stats
// supports: ?days=30, ?metric=visitors|revenue|orders|pageViews
router.get('/daily', getDailyStats)

// GET /api/analytics/top-products - best selling products
// supports: ?count=10
router.get('/top-products', getTopProductsHandler)

// GET /api/analytics/summary - 30-day dashboard summary
router.get('/summary', getSummary)

export default router
