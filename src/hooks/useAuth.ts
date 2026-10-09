import { useMutation } from '@tanstack/react-query'
import { useAuthContext } from '../auth/useAuthContext'
import { authApi } from '../api/auth'
import type { LoginRequest, ChangePasswordRequest, ChangeSalesPasswordRequest, RecoverPasswordRequest } from '../types'

export function useLogin() {
  const { login } = useAuthContext()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      login(response.access_token)
    },
  })
}

export function useSalesVerify() {
  return useMutation({
    mutationFn: (password: string) => authApi.salesVerify(password),
    onSuccess: (response) => {
      localStorage.setItem('sales_token', response.sales_token)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
  })
}

export function useChangeSalesPassword() {
  return useMutation({
    mutationFn: (data: ChangeSalesPasswordRequest) => authApi.changeSalesPassword(data),
  })
}

export function useRecoverPassword() {
  return useMutation({
    mutationFn: (data: RecoverPasswordRequest) => authApi.recover(data),
  })
}