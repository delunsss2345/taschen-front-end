'use client'

import { useEffect, useMemo, useState } from 'react'
import { SupplierHeader } from './SupplierHeader'
import { SupplierTable } from './SupplierTable'
import { useSuppliersQuery } from '@/features/supplier/hooks'
import { toast } from 'sonner'

export function AdminSuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const { data: suppliers, isPending, isError, refetch } = useSuppliersQuery()

  useEffect(() => {
    if (isError) {
      toast.error('Không thể tải danh sách nhà cung cấp')
    }
  }, [isError])

  const filteredSuppliers = useMemo(() => {
    let result = suppliers ?? []

    // Filter by status
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      result = result.filter((s) => s.active === isActive)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.phone.includes(query)
      )
    }

    return result
  }, [suppliers, searchQuery, statusFilter])

  return (
    <div className="space-y-4">
      <SupplierHeader
        onSuccess={refetch}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <SupplierTable
        suppliers={filteredSuppliers}
        isLoading={isPending}
        onEditSuccess={refetch}
      />
    </div>
  )
}
