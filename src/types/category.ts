export interface Category {
  id: number
  name: string
  is_active: boolean
  created_at: string
}

export interface CategoryCreate {
  name: string
}

export interface CategoryUpdate {
  name?: string
  is_active?: boolean
}