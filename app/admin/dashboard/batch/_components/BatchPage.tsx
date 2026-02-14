'use client'

import { BatchHeader } from './BatchHeader'
import { BatchTable } from './BatchTable'

interface Batch {
  id: number
  batchCode: string
  quantity: number
  remainingQuantity: number
  importPrice: number
  productionDate: string
  manufacturer: string
  createdAt: string
  bookId: number
  bookTitle: string
  createdById: number
  createdByName: string
  importStockDetailId: number
}

const mockBatches: Batch[] = [
  {
    id: 1,
    batchCode: 'BATCH-2024-0001',
    quantity: 100,
    remainingQuantity: 100,
    importPrice: 50000.0,
    productionDate: '2024-01-15',
    manufacturer: 'NXB Giáo Dục',
    createdAt: '2026-02-09T11:26:04.584866',
    bookId: 2,
    bookTitle: 'To Kill a Mockingbird',
    createdById: 46,
    createdByName: 'warehouse warehouse',
    importStockDetailId: 1
  },
  {
    id: 2,
    batchCode: 'BATCH-2024-0002',
    quantity: 50,
    remainingQuantity: 30,
    importPrice: 45000.0,
    productionDate: '2024-02-20',
    manufacturer: 'NXB Trẻ',
    createdAt: '2026-02-10T10:00:00.000000',
    bookId: 3,
    bookTitle: 'The Great Gatsby',
    createdById: 46,
    createdByName: 'warehouse warehouse',
    importStockDetailId: 2
  },
  {
    id: 3,
    batchCode: 'BATCH-2024-0003',
    quantity: 200,
    remainingQuantity: 200,
    importPrice: 35000.0,
    productionDate: '2024-03-05',
    manufacturer: 'NXB Kim Đồng',
    createdAt: '2026-02-11T09:15:30.123456',
    bookId: 4,
    bookTitle: 'Harry Potter',
    createdById: 47,
    createdByName: 'admin admin',
    importStockDetailId: 3
  }
]

export function BatchPage() {
  return (
    <div className="space-y-4">
      <BatchHeader />
      <BatchTable batches={mockBatches} />
    </div>
  )
}
