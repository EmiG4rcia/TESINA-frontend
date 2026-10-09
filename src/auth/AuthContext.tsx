import { createContext } from 'react'
import type { UserRole } from '../types'

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  role: UserRole | null
  isOwner: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: null,
  role: null,
  isOwner: false,
  login: async () => {},
  logout: () => {},
})