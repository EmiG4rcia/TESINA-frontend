export type MovementType =
  | 'purchase'
  | 'production_in'
  | 'production_out'
  | 'delivery'
  | 'adjustment'
  | 'waste'

export type ItemType = 'product' | 'raw_material'

export interface StockMovement {
  id: number
  item_type: ItemType
  item_id: number
  item_name: string | null
  movement_type: MovementType
  quantity: number
  reference_id: number | null
  notes: string | null
  created_by_username: string | null
  created_at: string
}

export interface StockPurchase {
  item_type: ItemType
  item_id: number
  quantity: number
  notes?: string
}

export interface StockAdjustment {
  item_type: ItemType
  item_id: number
  quantity: number
  notes?: string
}