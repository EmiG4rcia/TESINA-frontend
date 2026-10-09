export interface ProductionInput {
  id: number
  raw_material_id: number
  raw_material_name: string | null
  raw_material_unit: string | null
  quantity_used: number
  estimated_quantity: number | null
}

export interface ProductionInputCreate {
  raw_material_id: number
  quantity_used: number
}

export interface ProductionLog {
  id: number
  product_id: number
  product_name: string | null
  product_unit: string | null
  produced_quantity: number
  estimated_quantity: number | null
  notes: string | null
  created_by_username: string | null
  created_at: string
  inputs: ProductionInput[]
  yield_percentage: number | null
}

export interface ProductionLogCreate {
  product_id: number
  produced_quantity: number
  notes?: string
  inputs: ProductionInputCreate[]
}