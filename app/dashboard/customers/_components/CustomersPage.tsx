'use client'

import { CustomersHeader } from './CustomersHeader'
import { CustomersTable } from './CustomersTable'

const mockCustomers = [
  {
    id: 1,
    username: 'test1',
    email: 'test1@gmail.com',
    fullName: 'Nguyễn Văn Test1',
    phone: '0123456789',
    totalOrders: 5,
    totalSpent: 250000,
    status: 'ACTIVE',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    username: 'test2',
    email: 'test2@gmail.com',
    fullName: 'Trần Thị Test2',
    phone: '0123456790',
    totalOrders: 3,
    totalSpent: 150000,
    status: 'ACTIVE',
    joinDate: '2024-02-20',
  },
  {
    id: 3,
    username: 'test3',
    email: 'test3@gmail.com',
    fullName: 'Lê Hoàng Test3',
    phone: '0123456791',
    totalOrders: 8,
    totalSpent: 520000,
    status: 'ACTIVE',
    joinDate: '2024-03-10',
  },
  {
    id: 4,
    username: 'test4',
    email: 'test4@gmail.com',
    fullName: 'Phạm Minh Test4',
    phone: '0123456792',
    totalOrders: 2,
    totalSpent: 80000,
    status: 'LOCKED',
    joinDate: '2024-04-05',
  },
  {
    id: 5,
    username: 'test5',
    email: 'test5@gmail.com',
    fullName: 'Hoàng Đức Test5',
    phone: '0123456793',
    totalOrders: 10,
    totalSpent: 980000,
    status: 'ACTIVE',
    joinDate: '2024-05-18',
  },
]

export function CustomersPage() {
  return (
    <div className="space-y-4">
      <CustomersHeader />
      <CustomersTable customers={mockCustomers} />
    </div>
  )
}
