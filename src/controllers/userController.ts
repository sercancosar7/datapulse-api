import type { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { users } from '../data/mockData.js'
import { successResponse, errorResponse, buildPaginationMeta } from '../models/ApiResponse.js'
import { createUserSchema, updateUserSchema } from '../utils/validators.js'
import { parsePagination, matchesSearch, paginateArray } from '../utils/helpers.js'
import type { User, UserPublic } from '../models/User.js'

// mutable copy of mock data so we can add/edit
let userStore = [...users]

function toPublic(user: User): UserPublic {
  const { updatedAt: _updated, ...rest } = user
  return rest
}

export function getUsers(req: Request, res: Response): void {
  const { page, limit } = parsePagination(req.query)
  const search = req.query.search as string | undefined
  const role = req.query.role as string | undefined
  const active = req.query.active as string | undefined

  let filtered = userStore

  // filter by search term
  if (search) {
    filtered = filtered.filter((u) =>
      matchesSearch(u as unknown as Record<string, unknown>, search, ['name', 'email'])
    )
  }

  // filter by role
  if (role && ['admin', 'user', 'moderator'].includes(role)) {
    filtered = filtered.filter((u) => u.role === role)
  }

  // filter by active status
  if (active === 'true' || active === 'false') {
    const isActive = active === 'true'
    filtered = filtered.filter((u) => u.isActive === isActive)
  }

  // sort by name (default) or createdAt
  const sortBy = req.query.sort as string
  if (sortBy === 'createdAt') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  const { items, total } = paginateArray(filtered, page, limit)

  res.json(
    successResponse(
      items.map(toPublic),
      buildPaginationMeta(total, page, limit)
    )
  )
}

export function getUserById(req: Request, res: Response): void {
  const user = userStore.find((u) => u.id === req.params.id)

  if (!user) {
    res.status(404).json(errorResponse('User not found'))
    return
  }

  res.json(successResponse(toPublic(user)))
}

export function createUser(req: Request, res: Response): void {
  const parsed = createUserSchema.parse(req.body)

  // check duplicate email
  if (userStore.some((u) => u.email === parsed.email)) {
    res.status(409).json(errorResponse('Email already exists'))
    return
  }

  const now = new Date().toISOString()
  const newUser: User = {
    id: uuid(),
    email: parsed.email,
    name: parsed.name,
    role: parsed.role ?? 'user',
    isActive: true,
    lastLogin: null,
    createdAt: now,
    updatedAt: now,
  }

  userStore = [...userStore, newUser]

  res.status(201).json(successResponse(toPublic(newUser)))
}

export function updateUser(req: Request, res: Response): void {
  const index = userStore.findIndex((u) => u.id === req.params.id)

  if (index === -1) {
    res.status(404).json(errorResponse('User not found'))
    return
  }

  const parsed = updateUserSchema.parse(req.body)
  const existing = userStore[index]

  const updated: User = {
    ...existing,
    ...parsed,
    updatedAt: new Date().toISOString(),
  }

  // immutable update
  userStore = userStore.map((u, i) => (i === index ? updated : u))

  res.json(successResponse(toPublic(updated)))
}

export function deleteUser(req: Request, res: Response): void {
  const index = userStore.findIndex((u) => u.id === req.params.id)

  if (index === -1) {
    res.status(404).json(errorResponse('User not found'))
    return
  }

  userStore = userStore.filter((_, i) => i !== index)

  res.status(204).send()
}
