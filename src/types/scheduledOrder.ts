export interface ScheduledOrderItem {
  id: number
  product_id: number
  product_name: string | null
  product_unit: string | null
  planned_quantity: number
  modified_by_username: string | null
  modified_at: string | null
}

export interface ScheduledOrderItemCreate {
  product_id: number
  planned_quantity: number
}

export interface ScheduledOrderItemUpdate {
  planned_quantity: number
}

export interface ScheduledOrder {
  id: number
  destination_id: number
  destination_name: string | null
  scheduled_date: string
  status: 'pending' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  items: ScheduledOrderItem[]
}

export interface ScheduledOrderCreate {
  destination_id: number
  scheduled_date: string
  notes?: string
  items?: ScheduledOrderItemCreate[]
}

export interface ScheduledOrderUpdate {
  scheduled_date?: string
  notes?: string
  status?: string
}