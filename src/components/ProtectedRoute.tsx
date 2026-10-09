import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../auth/useAuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireOwner?: boolean
}

export function ProtectedRoute({ children, requireOwner = false }: ProtectedRouteProps) {
  const { isAuthenticated, isOwner } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}