'use client'

import { useEffect, useState, useMemo } from 'react'
import { SupplierHeader } from './SupplierHeader'
import { SupplierTable } from './SupplierTable'
import { supplierService } from '@/services/supplier.service'
import type { Supplier } from '@/types/response/supplier.response'
import { toast } from 'sonner'

export function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true)
      const data = await supplierService.getAllSuppliers()
      setSuppliers(data)
    } catch (error) {
      toast.error('Không thể tải danh sách nhà cung cấp')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleAddSuccess = () => {
    fetchSuppliers()
  }

  const handleEditSuccess = () => {
    fetchSuppliers()
  }

  const filteredSuppliers = useMemo(() => {
    let result = suppliers

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
        onSuccess={handleAddSuccess}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <SupplierTable 
        suppliers={filteredSuppliers} 
        isLoading={isLoading}
        onEditSuccess={handleEditSuccess}
      />
    </div>
  )
}
