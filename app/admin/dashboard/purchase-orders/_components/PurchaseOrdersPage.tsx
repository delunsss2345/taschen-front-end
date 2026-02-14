'use client'

import { PurchaseOrdersHeader } from './PurchaseOrdersHeader'
import { PurchaseOrdersTable } from './PurchaseOrdersTable'

// Interface cho dữ liệu PO
interface PurchaseOrder {
  id: string
  supplier: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  createdBy: string
  approvedBy: string | null
  createdAt: string
  books: {
    name: string
    quantity: number
    price: number
  }[]
}

// Mock data tạm thời
const mockData: PurchaseOrder[] = [
  {
    id: 'PO001',
    supplier: 'Nhà xuất bản Kim Đồng',
    status: 'APPROVED',
    createdBy: 'nguyenvana',
    approvedBy: 'admin01',
    createdAt: '2024-01-15 10:30',
    books: [
      { name: 'Doraemon - Tập 45', quantity: 50, price: 25000 },
      { name: 'Conan - Tập 100', quantity: 30, price: 28000 },
    ],
  },
  {
    id: 'PO002',
    supplier: 'Công ty Sách Trí Tuệ',
    status: 'PENDING',
    createdBy: 'tranb',
    approvedBy: null,
    createdAt: '2024-01-14 09:15',
    books: [
      { name: 'Đắc Nhân Tâm', quantity: 100, price: 75000 },
      { name: 'Nhà Giả Kim', quantity: 80, price: 68000 },
      { name: 'Sapiens', quantity: 50, price: 120000 },
    ],
  },
  {
    id: 'PO003',
    supplier: 'NXB Giáo Dục',
    status: 'REJECTED',
    createdBy: 'lehong',
    approvedBy: 'admin02',
    createdAt: '2024-01-13 16:45',
    books: [
      { name: 'Sách Giáo Khoa Lớp 5', quantity: 200, price: 15000 },
    ],
  },
  {
    id: 'PO004',
    supplier: 'Nhà xuất bản Kim Đồng',
    status: 'PENDING',
    createdBy: 'phamt',
    approvedBy: null,
    createdAt: '2024-01-12 11:20',
    books: [
      { name: 'Harry Potter và Hòn Đá Phù Thủy', quantity: 40, price: 95000 },
      { name: 'Harry Potter và Phòng Bí Mật', quantity: 40, price: 95000 },
    ],
  },
  {
    id: 'PO005',
    supplier: 'Công ty Sách Alpha',
    status: 'APPROVED',
    createdBy: 'dangm',
    approvedBy: 'admin01',
    createdAt: '2024-01-11 08:00',
    books: [
      { name: 'Sherlock Holmes - Tập 1', quantity: 25, price: 55000 },
      { name: 'Sherlock Holmes - Tập 2', quantity: 25, price: 55000 },
    ],
  },
]

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-6">
      <PurchaseOrdersHeader />
      <PurchaseOrdersTable data={mockData} />
    </div>
  )
}
