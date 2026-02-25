export interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
  active: boolean
}

export type SupplierApiResponse = {
  error: string | null
  message: string
  statusCode: number
  data: Supplier
}

export type SupplierResponseWrapper = {
  success: boolean
  data: SupplierApiResponse
}

export type SuppliersApiResponse = {
  error: string | null
  message: string
  statusCode: number
  data: Supplier[]
}

export type SuppliersResponseWrapper = {
  success: boolean
  data: SuppliersApiResponse
}
