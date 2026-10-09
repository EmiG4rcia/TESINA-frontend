export type PaymentStatus =
  | 'pending'
  | 'payment_received'
  | 'completed'
  | 'failed'

export interface Payment {
  id: number
  order_id: number | null
  amount: number | null
  method: 'cash' | 'card' | 'qr_payment'
  status: PaymentStatus
  created_at: string
  customer_name: string | null
  table_number: string | null
}

export interface PaymentStatusUpdate {
  status: PaymentStatus
}

export interface PaymentCreate {
  order_id: number
  amount: number
  method: string
}

export interface SalesSummary {
  total_orders: number
  total_revenue: number
  pending_payments: number
  completed_payments: number
  payment_received_pending: number
}