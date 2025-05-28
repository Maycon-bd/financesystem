export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  email: string
  name: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  userId: string
  avatar?: string
  phone?: string
  address?: string
  preferences: {
    currency: string
    language: string
    notifications: boolean
  }
}
