import type { Request, Response } from 'express'
import { users, products, generateDailyStats, getTopProducts } from '../data/mockData.js'
import { successResponse } from '../models/ApiResponse.js'
import type { AnalyticsOverview } from '../models/Product.js'
import { clamp } from '../utils/helpers.js'

export function getOverview(_req: Request, res: Response): void {
  const activeUsers = users.filter((u) => u.isActive).length
  const stats = generateDailyStats(7)
  const totalRevenue = stats.reduce((sum, s) => sum + s.revenue, 0)
  const todayOrders = stats[stats.length - 1]?.orders ?? 0

  const overview: AnalyticsOverview = {
    totalUsers: users.length,
    activeUsers,
    totalProducts: products.length,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    ordersToday: todayOrders,
    conversionRate: parseFloat((2.4 + Math.random() * 1.5).toFixed(2)), // ~2.4-3.9%
  }

  res.json(successResponse(overview))
}

export function getDailyStats(req: Request, res: Response): void {
  let days = parseInt(req.query.days as string, 10)
  if (isNaN(days)) days = 30
  days = clamp(days, 1, 90)

  const stats = generateDailyStats(days)

  // if a specific metric is requested, only return that field
  const metric = req.query.metric as string
  if (metric && ['visitors', 'revenue', 'orders', 'pageViews'].includes(metric)) {
    const simplified = stats.map((s) => ({
      date: s.date,
      value: s[metric as keyof typeof s],
    }))
    res.json(successResponse(simplified))
    return
  }

  res.json(successResponse(stats))
}

export function getTopProductsHandler(req: Request, res: Response): void {
  let count = parseInt(req.query.count as string, 10)
  if (isNaN(count)) count = 10
  count = clamp(count, 1, 30)

  const topProducts = getTopProducts(count)

  res.json(successResponse(topProducts))
}

// Summary stats for the dashboard
export function getSummary(_req: Request, res: Response): void {
  const stats = generateDailyStats(30)

  const totalVisitors = stats.reduce((sum, s) => sum + s.visitors, 0)
  const totalRevenue = stats.reduce((sum, s) => sum + s.revenue, 0)
  const totalOrders = stats.reduce((sum, s) => sum + s.orders, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // calculate week-over-week change
  const thisWeek = stats.slice(-7)
  const lastWeek = stats.slice(-14, -7)

  const thisWeekRevenue = thisWeek.reduce((s, d) => s + d.revenue, 0)
  const lastWeekRevenue = lastWeek.reduce((s, d) => s + d.revenue, 0)

  const revenueChange = lastWeekRevenue > 0
    ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue * 100)
    : 0

  res.json(successResponse({
    period: '30d',
    totalVisitors,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
    revenueChangePercent: parseFloat(revenueChange.toFixed(1)),
    topCategories: getTopCategories(),
  }))
}

// helper - not exported
function getTopCategories() {
  const catMap = new Map<string, number>()
  for (const p of products) {
    catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1)
  }
  return Array.from(catMap.entries())
    .map(([name, count]) => ({ name, productCount: count }))
    .sort((a, b) => b.productCount - a.productCount)
}
