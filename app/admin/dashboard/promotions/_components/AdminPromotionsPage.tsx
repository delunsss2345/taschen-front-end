'use client'

import { useState } from 'react'
import { PromotionHeader } from './PromotionHeader'
import { PromotionTabs } from './PromotionTabs'
import { PromotionTable } from './PromotionTable'

const mockPromotions = [
  {
    id: 1,
    name: 'Giảm 10% dịp lễ',
    code: 'HE2025',
    discount: '10%',
    quantity: 87,
    minOrder: 'Không giới hạn',
    startDate: '31/10/2025',
    endDate: '15/12/2025',
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Chúc mừng gián...',
    code: 'NOEL2025',
    discount: '10%',
    quantity: 10,
    minOrder: '200.000 đ',
    startDate: '20/12/2025',
    endDate: '01/01/2026',
    status: 'PENDING',
  },
  {
    id: 3,
    name: 'TEST KHUYẾN ...',
    code: 'TEST2025',
    discount: '1%',
    quantity: 1,
    minOrder: '1 đ',
    startDate: '09/12/2025',
    endDate: '10/12/2025',
    status: 'PENDING',
  },
  {
    id: 4,
    name: 'SELLER TEST',
    code: 'SELLER123',
    discount: '1%',
    quantity: 1,
    minOrder: '1 đ',
    startDate: '09/12/2025',
    endDate: '09/01/2026',
    status: 'PENDING',
  },
  {
    id: 5,
    name: 'hihihihi',
    code: 'AL',
    discount: '20%',
    quantity: 100,
    minOrder: '200.000 đ',
    startDate: '18/12/2025',
    endDate: '13/01/2026',
    status: 'NOT_STARTED',
  },
]

export function AdminPromotionsPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="space-y-6">
      <PromotionHeader />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <PromotionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <PromotionTable promotions={mockPromotions} />
      </div>
    </div>
  )
}
