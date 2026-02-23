'use client'

import { useEffect, useState } from 'react'
import { AccountHeader } from './AccountHeader'
import { AccountTable, type Account } from './AccountTable'
import { userService, type User } from '@/services/user.service'
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
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const users = await userService.getAllUsers()
      const mappedAccounts = users.map(mapUserToAccount)
      setAccounts(mappedAccounts)
      setFilteredAccounts(mappedAccounts)
    } catch (error) {
      toast.error('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [refreshKey])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAccounts(accounts)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = accounts.filter(
        (acc) =>
          acc.username.toLowerCase().includes(term) ||
          acc.email.toLowerCase().includes(term) ||
          acc.fullName.toLowerCase().includes(term)
      )
      setFilteredAccounts(filtered)
    }
  }, [searchTerm, accounts])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleUpdateAccount = (updatedAccount: Account) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    )
  }

  return (
    <div className="space-y-4">
      <AccountHeader 
        onRefresh={handleRefresh} 
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />
      <AccountTable 
        accounts={filteredAccounts} 
        loading={loading} 
        onUpdate={handleUpdateAccount}
        onRefresh={handleRefresh}
      />
    </div>
  )
}
