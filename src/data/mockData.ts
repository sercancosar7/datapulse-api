import { v4 as uuid } from 'uuid'
import type { User } from '../models/User.js'
import type { Product, DailyStats, TopProduct } from '../models/Product.js'

// ---- Users ----

const userNames = [
  { name: 'Ayse Yilmaz', email: 'ayse.yilmaz@example.com' },
  { name: 'Mehmet Kaya', email: 'mehmet.kaya@example.com' },
  { name: 'Elif Demir', email: 'elif.demir@example.com' },
  { name: 'Can Ozturk', email: 'can.ozturk@example.com' },
  { name: 'Zeynep Arslan', email: 'zeynep.arslan@example.com' },
  { name: 'Burak Celik', email: 'burak.celik@example.com' },
  { name: 'Selin Koc', email: 'selin.koc@example.com' },
  { name: 'Emre Sahin', email: 'emre.sahin@example.com' },
  { name: 'Deniz Yildiz', email: 'deniz.yildiz@example.com' },
  { name: 'Arda Dogan', email: 'arda.dogan@example.com' },
  { name: 'Maria Santos', email: 'maria.santos@example.com' },
  { name: 'James Wilson', email: 'j.wilson@example.com' },
  { name: 'Lena Muller', email: 'lena.m@example.com' },
  { name: 'Kenji Tanaka', email: 'kenji.t@example.com' },
  { name: 'Fatma Erdogan', email: 'fatma.e@example.com' },
  { name: 'Omar Hassan', email: 'omar.h@example.com' },
  { name: 'Sophie Laurent', email: 'sophie.l@example.com' },
  { name: 'Ahmet Polat', email: 'ahmet.polat@example.com' },
  { name: 'Yuki Sato', email: 'yuki.sato@example.com' },
  { name: 'Carlos Rivera', email: 'carlos.r@example.com' },
]

const roles: Array<'admin' | 'user' | 'moderator'> = ['admin', 'user', 'user', 'user', 'moderator']

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString()
}

export const users: User[] = userNames.map((u, i) => {
  const created = randomDate(new Date('2024-06-01'), new Date('2025-11-15'))
  return {
    id: uuid(),
    email: u.email,
    name: u.name,
    role: roles[i % roles.length],
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
    isActive: Math.random() > 0.15, // ~85% active
    lastLogin: Math.random() > 0.2 ? randomDate(new Date('2025-10-01'), new Date('2026-02-20')) : null,
    createdAt: created,
    updatedAt: created,
  }
})

// ---- Products ----

const productData = [
  { name: 'Wireless Bluetooth Headphones', cat: 'Electronics', price: 79.99, tags: ['audio', 'wireless', 'bluetooth'] },
  { name: 'Ergonomic Office Chair', cat: 'Furniture', price: 349.00, tags: ['office', 'ergonomic'] },
  { name: 'Mechanical Keyboard RGB', cat: 'Electronics', price: 129.95, tags: ['keyboard', 'gaming', 'rgb'] },
  { name: 'Organic Cotton T-Shirt', cat: 'Clothing', price: 29.99, tags: ['organic', 'cotton', 'casual'] },
  { name: '4K Monitor 27"', cat: 'Electronics', price: 449.00, tags: ['monitor', '4k', 'display'] },
  { name: 'Running Shoes Pro', cat: 'Sports', price: 119.99, tags: ['running', 'shoes', 'fitness'] },
  { name: 'Stainless Steel Water Bottle', cat: 'Accessories', price: 24.95, tags: ['bottle', 'eco', 'reusable'] },
  { name: 'Laptop Stand Aluminum', cat: 'Accessories', price: 49.99, tags: ['laptop', 'stand', 'aluminum'] },
  { name: 'Smart Watch Series X', cat: 'Electronics', price: 299.00, tags: ['smartwatch', 'fitness', 'health'] },
  { name: 'Noise Cancelling Earbuds', cat: 'Electronics', price: 159.99, tags: ['audio', 'anc', 'wireless'] },
  { name: 'Standing Desk Converter', cat: 'Furniture', price: 279.00, tags: ['desk', 'standing', 'ergonomic'] },
  { name: 'Yoga Mat Premium', cat: 'Sports', price: 39.99, tags: ['yoga', 'fitness', 'mat'] },
  { name: 'USB-C Hub 7-in-1', cat: 'Electronics', price: 54.99, tags: ['usb-c', 'hub', 'adapter'] },
  { name: 'Coffee Maker Drip', cat: 'Kitchen', price: 89.00, tags: ['coffee', 'kitchen', 'drip'] },
  { name: 'LED Desk Lamp', cat: 'Furniture', price: 44.99, tags: ['lamp', 'led', 'desk'] },
  { name: 'Portable SSD 1TB', cat: 'Electronics', price: 109.99, tags: ['storage', 'ssd', 'portable'] },
  { name: 'Leather Wallet RFID', cat: 'Accessories', price: 34.99, tags: ['wallet', 'leather', 'rfid'] },
  { name: 'Resistance Bands Set', cat: 'Sports', price: 19.99, tags: ['fitness', 'bands', 'home-gym'] },
  { name: 'Webcam 1080p HD', cat: 'Electronics', price: 69.99, tags: ['webcam', 'streaming', 'hd'] },
  { name: 'Insulated Lunch Bag', cat: 'Accessories', price: 22.50, tags: ['lunch', 'insulated', 'bag'] },
  { name: 'Electric Kettle 1.7L', cat: 'Kitchen', price: 42.00, tags: ['kettle', 'electric', 'kitchen'] },
  { name: 'Denim Jacket Classic', cat: 'Clothing', price: 79.99, tags: ['denim', 'jacket', 'casual'] },
  { name: 'Gaming Mouse Wireless', cat: 'Electronics', price: 64.99, tags: ['mouse', 'gaming', 'wireless'] },
  { name: 'Plant Pot Ceramic Set', cat: 'Home', price: 32.00, tags: ['plant', 'ceramic', 'decor'] },
  { name: 'Backpack Travel 40L', cat: 'Accessories', price: 89.99, tags: ['backpack', 'travel', 'durable'] },
  { name: 'Air Purifier HEPA', cat: 'Home', price: 199.00, tags: ['air', 'purifier', 'hepa'] },
  { name: 'Bamboo Cutting Board', cat: 'Kitchen', price: 18.99, tags: ['bamboo', 'cutting', 'kitchen'] },
  { name: 'Microfiber Towel Set', cat: 'Home', price: 15.99, tags: ['towel', 'microfiber', 'quick-dry'] },
  { name: 'Protein Shaker Bottle', cat: 'Sports', price: 12.99, tags: ['shaker', 'protein', 'gym'] },
  { name: 'Wireless Charging Pad', cat: 'Electronics', price: 29.99, tags: ['charging', 'wireless', 'qi'] },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const products: Product[] = productData.map((p) => {
  const rating = parseFloat((3.2 + Math.random() * 1.8).toFixed(1)) // 3.2 - 5.0
  return {
    id: uuid(),
    name: p.name,
    slug: slugify(p.name),
    description: `High-quality ${p.name.toLowerCase()} designed for everyday use. Premium materials and craftsmanship.`,
    price: p.price,
    category: p.cat,
    tags: p.tags,
    stock: Math.floor(Math.random() * 200) + 5,
    isPublished: Math.random() > 0.1,
    rating,
    reviewCount: Math.floor(Math.random() * 500) + 10,
    imageUrl: `https://picsum.photos/seed/${slugify(p.name)}/400/400`,
    createdAt: randomDate(new Date('2024-08-01'), new Date('2025-12-01')),
  }
})

// ---- Analytics (last 30 days) ----

export function generateDailyStats(days: number = 30): DailyStats[] {
  const stats: DailyStats[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // weekends have less traffic
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const baseVisitors = isWeekend ? 800 : 1400
    const visitors = baseVisitors + Math.floor(Math.random() * 600)

    stats.push({
      date: date.toISOString().split('T')[0],
      visitors,
      pageViews: visitors * (2 + Math.floor(Math.random() * 3)),
      orders: Math.floor(visitors * (0.02 + Math.random() * 0.03)),
      revenue: parseFloat((visitors * (0.8 + Math.random() * 1.2)).toFixed(2)),
    })
  }
  return stats
}

export function getTopProducts(count: number = 10): TopProduct[] {
  // pick random products and assign sales data
  const shuffled = [...products].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((p) => {
    const units = Math.floor(Math.random() * 300) + 20
    return {
      productId: p.id,
      name: p.name,
      unitsSold: units,
      revenue: parseFloat((units * p.price).toFixed(2)),
    }
  })
}
