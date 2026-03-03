export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'moderator'
  avatar?: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

// what we return to clients (no sensitive fields)
export type UserPublic = Omit<User, 'updatedAt'>

// for creating a new user
export interface CreateUserDto {
  email: string
  name: string
  password: string
  role?: 'admin' | 'user' | 'moderator'
}

// TODO: add UpdateUserDto when PATCH endpoint is ready
export interface UpdateUserDto {
  name?: string
  email?: string
  role?: 'admin' | 'user' | 'moderator'
  isActive?: boolean
}
