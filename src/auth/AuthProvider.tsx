import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../api/auth'
import { queryClient } from '../api/queryClient'
import type { UserRole } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  )
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem('username')
  )
  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem('user_role') as UserRole | null
  )

  const login = async (username: string, password: string) => {
    const data = await authApi.login(username, password)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user_role', data.role)
    localStorage.setItem('username', data.username)
    setIsAuthenticated(true)
    setUsername(data.username)
    setRole(data.role)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('username')
    setIsAuthenticated(false)
    setUsername(null)
    setRole(null)
    queryClient.clear()
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      username,
      role,
      isOwner: role === 'owner',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}