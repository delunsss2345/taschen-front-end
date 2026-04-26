'use client'

import { useEffect, useState } from 'react'
import { AccountHeader } from './AccountHeader'
import { AccountTable } from './AccountTable'
import { useUsersQuery } from '@/features/user/hooks'
import { type User } from '@/services/user.service'
import { type Account } from './AccountTable'
import { toast } from 'sonner'

function mapUserToAccount(user: User): Account {
  return {
    id: user.id,
    username: user.email.split('@')[0],
    email: user.email,
    fullName: user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || '-',
    phone: user.phoneNumber || '-',
    role: user.roles && user.roles.length > 0 ? user.roles[0] : 'USER',
    status: user.active,
    addresses: user.addresses || [],
  }
}

export function AdminAccountsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: users, isPending, isError, refetch } = useUsersQuery()

  useEffect(() => {
    if (isError) {
      toast.error('Không thể tải danh sách tài khoản')
    }
  }, [isError])

  const accounts = users?.map(mapUserToAccount) ?? []

  const filteredAccounts = searchTerm.trim()
    ? accounts.filter((acc) => {
        const term = searchTerm.toLowerCase()
        return (
          acc.username.toLowerCase().includes(term) ||
          acc.email.toLowerCase().includes(term) ||
          acc.fullName.toLowerCase().includes(term)
        )
      })
    : accounts

  return (
    <div className="space-y-4">
      <AccountHeader
        onRefresh={refetch}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />
      <AccountTable
        accounts={filteredAccounts}
        loading={isPending}
        onRefresh={refetch}
      />
    </div>
  )
}
