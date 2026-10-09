import type { Order } from './order'

export interface Customer {
  id: number
  phone_number: string
  name: string | null
  created_at: string
  total_orders: number
}

export interface CustomerDetail extends Customer {
  orders: Partial<Order>[]
}

export interface CustomerCreate {
  phone_number: string
  name?: string
}

export interface CustomerUpdate {
  phone_number?: string
  name?: string
}