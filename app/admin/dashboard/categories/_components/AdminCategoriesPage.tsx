'use client'

import { CategoryHeader } from './CategoryHeader'
import { CategoryTable } from './CategoryTable'

const mockCategories = [
  { id: 1, name: 'Văn học' },
  { id: 2, name: 'Sử liệu' },
  { id: 3, name: 'Truyện tranh' },
  { id: 4, name: 'Sách tắm đá' },
  { id: 5, name: 'Hồi ký - Tự truyện' },
  { id: 6, name: 'Lịch sử' },
  { id: 7, name: 'Chính trị' },
  { id: 8, name: 'Quân sự' },
]

export function AdminCategoriesPage() {
  return (
    <div className="space-y-4">
      <CategoryHeader />
      <CategoryTable categories={mockCategories} />
    </div>
  )
}
