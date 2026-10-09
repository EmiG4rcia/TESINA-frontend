export interface DeliveryProduct {
  id: number
  product_id: number
  product_name: string | null
  product_unit: string | null
  planned_quantity: number | null
  actual_quantity: number | null
  modified_by_username: string | null
}

export interface DeliveryProductCreate {
  product_id: number
  planned_quantity?: number
  actual_quantity?: number
}

export interface Delivery {
  id: number
  destination_id: number
  destination_name: string | null
  scheduled_order_id: number | null
  delivery_date: string
  delivery_time: string | null
  status: 'pending' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  completed_at: string | null
  products: DeliveryProduct[]
}

export interface DeliveryCreate {
  destination_id: number
  scheduled_order_id?: number
  delivery_date: string
  delivery_time?: string
  notes?: string
  products?: DeliveryProductCreate[]
}

export interface DeliveryUpdate {
  delivery_time?: string
  notes?: string
  status?: string
}