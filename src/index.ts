import { createApp } from './app.js'

const PORT = parseInt(process.env.PORT || '3000', 10)
const HOST = process.env.HOST || '0.0.0.0'

const app = createApp()

app.listen(PORT, HOST, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │                                         │
  │   DataPulse API v1.2.0                  │
  │   Running on http://${HOST}:${PORT}        │
  │   Environment: ${process.env.NODE_ENV || 'development'}           │
  │                                         │
  │   Endpoints:                            │
  │   GET  /api/health                      │
  │   POST /api/auth/login                  │
  │   GET  /api/users                       │
  │   GET  /api/products                    │
  │   GET  /api/analytics/overview          │
  │                                         │
  └─────────────────────────────────────────┘
  `)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...')
  process.exit(0)
})
