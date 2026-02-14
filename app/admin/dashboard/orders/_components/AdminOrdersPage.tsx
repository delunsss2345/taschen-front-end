'use client'

import { OrderHeader } from './OrderHeader'
import { OrderTabs } from './OrderTabs'
import { OrderTable } from './OrderTable'
import { useState } from 'react'

const mockOrders = [
  {
    id: '#24',
    customer: 'testtest@gmail.com',
    date: '17:56 10/12/2025',
    total: 205000,
    status: 'CANCELLED',
  },
  {
    id: '#23',
    customer: 'testtest@gmail.com',
    date: '17:55 10/12/2025',
    total: 85000,
    status: 'UNPAID',
  },
  {
    id: '#22',
    customer: 'testtest@gmail.com',
    date: '17:52 10/12/2025',
    total: 150000,
    status: 'PENDING',
  },
  {
    id: '#21',
    customer: 'testtest@gmail.com',
    date: '17:13 10/12/2025',
    total: 425000,
    status: 'PENDING',
  },
  {
    id: '#20',
    customer: 'testtest@gmail.com',
    date: '16:50 10/12/2025',
    total: 198000,
    status: 'COMPLETED',
  },
  {
    id: '#17',
    customer: 'testtest@gmail.com',
    date: '11:20 10/12/2025',
    total: 171000,
    status: 'CANCELLED',
  },
]

export function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="space-y-6">
      <OrderHeader />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <OrderTable orders={mockOrders} />
      </div>
    </div>
  )
}
