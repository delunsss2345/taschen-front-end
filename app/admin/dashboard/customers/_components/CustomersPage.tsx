'use client'

import { useState, useMemo, useEffect } from 'react'
import { CustomersHeader } from './CustomersHeader'
import { CustomersTable } from './CustomersTable'
import { userService, type User } from '@/services/user.service'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading'

interface Customer {
  id: number
  username: string
  email: string
  fullName: string
  phone: string
  totalOrders: number
  totalSpent: number
  status: string
  joinDate: string
}

function mapUserToCustomer(user: User): Customer {
  return {
    id: user.id,
    username: user.email.split('@')[0],
    email: user.email,
    fullName: `${user.firstName} ${user.lastName || ''}`.trim(),
    phone: user.phoneNumber || '',
    totalOrders: 0,
    totalSpent: 0,
    status: user.active ? 'ACTIVE' : 'LOCKED',
    joinDate: new Date().toISOString().split('T')[0],
  }
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const users = await userService.getAllUsers()
      const customerUsers = users.filter(user => 
        user.roles.includes('USER') || !user.roles.includes('ADMIN')
      )
      const mappedCustomers = customerUsers.map(mapUserToCustomer)
      setCustomers(mappedCustomers)
    } catch (error) {
      toast.error('Không thể tải danh sách khách hàng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers

    const query = searchQuery.toLowerCase().trim()

    return customers.filter((item) => {
      return (
        item.username.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.fullName.toLowerCase().includes(query) ||
        item.phone.includes(query)
      )
    })
  }, [searchQuery, customers])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CustomersHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CustomersHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CustomersTable customers={filteredCustomers} />
    </div>
  )
}
