'use client'

import { SupplierHeader } from './SupplierHeader'
import { SupplierTable } from './SupplierTable'

const mockSuppliers = [
  {
    id: 1,
    name: 'Nhà cung cấp 1',
    email: 'supplier1@example.com',
    phone: '0123456789',
    address: 'Ha Noi',
    status: 'ACTIVE',
  },
  {
    id: 3,
    name: 'Nhà xuất bản Quốc gia Sự Thật',
    email: 'nxbSuthut@gmail.com',
    phone: '0300000000',
    address: 'TP Hồ Chí Minh',
    status: 'ACTIVE',
  },
]

export function AdminSuppliersPage() {
  return (
    <div className="space-y-4">
      <SupplierHeader />
      <SupplierTable suppliers={mockSuppliers} />
    </div>
  )
}
