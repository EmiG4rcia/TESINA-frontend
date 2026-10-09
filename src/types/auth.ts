export interface Admin {
  admin_id: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface SalesTokenResponse {
  sales_token: string
  token_type: string
  expires_in_minutes: number
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface ChangeSalesPasswordRequest {
  current_password: string
  new_sales_password: string
}

export interface RecoverPasswordRequest {
  recovery_code: string
  new_password: string
}