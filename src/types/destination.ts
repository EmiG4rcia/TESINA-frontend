export interface Destination {
  id: number
  name: string
  address: string | null
  contact: string | null
  is_active: boolean
  created_at: string
}

export interface DestinationCreate {
  name: string
  address?: string
  contact?: string
}

export interface DestinationUpdate {
  name?: string
  address?: string
  contact?: string
  is_active?: boolean
}