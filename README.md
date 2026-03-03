# DataPulse API

High-performance RESTful API built with Node.js, Express, and TypeScript. Features JWT authentication, rate limiting, and comprehensive error handling.

## Features

- RESTful API design with versioning
- JWT authentication & authorization
- Input validation (Zod)
- Rate limiting & request logging
- Standardized error handling
- Pagination & filtering
- Comprehensive API documentation

## Tech Stack

- Node.js + Express 5
- TypeScript
- Zod validation
- JWT (jsonwebtoken)

## Quick Start

```bash
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/auth/login | Get JWT token |
| GET | /api/users | List users |
| GET | /api/users/:id | Get user |
| POST | /api/users | Create user |
| GET | /api/products | List products |
| GET | /api/products/categories | List categories |
| GET | /api/analytics/overview | Analytics overview |
| GET | /api/analytics/daily | Daily stats |
| GET | /api/analytics/summary | Dashboard summary |

## Authentication

```bash
# Get a token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ayse.yilmaz@example.com", "password": "demo123"}'

# Use the token
curl http://localhost:3000/api/analytics/overview \
  -H "Authorization: Bearer <token>"
```

## Filtering & Pagination

```bash
# Paginate
GET /api/users?page=2&limit=10

# Search
GET /api/users?search=ayse

# Filter products by category and price
GET /api/products?category=Electronics&minPrice=50&maxPrice=200

# Sort
GET /api/products?sort=price&order=desc
```
