export type UserRole = 'owner' | 'employee'

export interface User {
  id: number
  username: string
  role: UserRole
  is_active: boolean
  created_at: string
  last_login: string | null
}

export interface UserCreate {
  username: string
  password: string
  role: UserRole
}

export interface UserUpdate {
  username?: string
  role?: UserRole
  is_active?: boolean
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  role: UserRole
  username: string
}