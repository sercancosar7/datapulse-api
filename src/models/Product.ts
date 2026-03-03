export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  tags: string[]
  stock: number
  isPublished: boolean
  rating: number // 1-5
  reviewCount: number
  imageUrl: string
  createdAt: string
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  category: string
  tags?: string[]
  stock?: number
}

// Analytics types - maybe move these to their own file later
export interface AnalyticsOverview {
  totalUsers: number
  activeUsers: number
  totalProducts: number
  totalRevenue: number
  ordersToday: number
  conversionRate: number
}

export interface DailyStats {
  date: string
  visitors: number
  pageViews: number
  orders: number
  revenue: number
}

export interface TopProduct {
  productId: string
  name: string
  unitsSold: number
  revenue: number
}
