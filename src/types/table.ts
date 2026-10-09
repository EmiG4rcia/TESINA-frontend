export interface Table {
  id: number
  table_number: string
  qr_token: string
  status: 'available' | 'occupied'
}

export interface TableCreate {
  table_number: string
}

export interface TableUpdate {
  table_number?: string
  status?: 'available' | 'occupied'
}

export interface TableQR extends Table {
  qr_image_base64: string
  whatsapp_url: string
}