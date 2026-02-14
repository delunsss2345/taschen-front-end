'use client'

import { AccountHeader } from './AccountHeader'
import { AccountTable } from './AccountTable'

const mockAccounts = [
  {
    id: 1,
    username: 'admin',
    email: 'test@example.com',
    fullName: '-',
    phone: '-',
    role: 'ADMIN',
    status: true,
  },
  {
    id: 2,
    username: 'seller',
    email: 'test@example.com',
    fullName: '-',
    phone: '-',
    role: 'SELLER_STAFF',
    status: true,
  },
  {
    id: 3,
    username: 'warehouse',
    email: 'test@example.com',
    fullName: '-',
    phone: '-',
    role: 'WAREHOUSE_STAFF',
    status: true,
  },
  {
    id: 4,
    username: 'customer',
    email: 'test@example.com',
    fullName: 'cus mer',
    phone: '-',
    role: 'CUSTOMER',
    status: true,
  },
  {
    id: 5,
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'tét tơ',
    phone: '0123456789',
    role: 'CUSTOMER',
    status: false,
  },
]

export function AdminAccountsPage() {
  return (
    <div className="space-y-4">
      <AccountHeader />
      <AccountTable accounts={mockAccounts} />
    </div>
  )
}
