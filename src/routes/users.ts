import { Router } from 'express'
import { authMiddleware, requireRole } from '../middleware/auth.js'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'

const router = Router()

// GET /api/users - list all users (paginated)
// supports: ?search=, ?role=, ?active=, ?sort=, ?page=, ?limit=
router.get('/', getUsers)

// GET /api/users/:id - get single user
router.get('/:id', getUserById)

// POST /api/users - create new user (auth required)
router.post('/', authMiddleware, createUser)

// PUT /api/users/:id - update user (auth required)
router.put('/:id', authMiddleware, updateUser)

// DELETE /api/users/:id - delete user (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUser)

export default router
