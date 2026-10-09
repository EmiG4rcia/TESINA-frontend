export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: number
  menu_item_id: number | null
  quantity: number
  unit_price: number | null
  item_name: string | null
}

export interface OrderItemCreate {
  menu_item_id: number
  quantity: number
  unit_price: number
}

export interface OrderCreate {
  customer_id?: number
  table_id?: number
  items: OrderItemCreate[]
}

export interface Order {
  id: number
  customer_id: number | null
  table_id: number | null
  status: OrderStatus
  total_amount: number | null
  created_at: string
  updated_at: string
  customer_name: string | null
  table_number: string | null
  items: OrderItem[]
}

export interface OrderStatusUpdate {
  status: OrderStatus
}

export interface OrderSummary {
  orders_today: number
  pending_orders: number
}