'use client'

import { useState, useEffect, useMemo } from 'react'
import { ReturnToWarehouseHeader } from './ReturnToWarehouseHeader'
import { ReturnToWarehouseTable } from './ReturnToWarehouseTable'
import { CreateDisposalRequestModal } from './CreateDisposalRequestModal'
import { disposalRequestService, type DisposalRequest } from '@/services/disposal-request.service'
import { LoadingSpinner } from '@/components/ui/loading'

export default function ReturnToWarehousePage() {
  const [requests, setRequests] = useState<DisposalRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const data = await disposalRequestService.getAllDisposalRequests()
      setRequests(data)
    } catch {
      // Silent fail - handled gracefully
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Filter requests based on search and status
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Filter by status
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false
      }

      // Filter by search term (search in id and reason)
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchId = request.id.toString().includes(search)
        const matchReason = request.reason.toLowerCase().includes(search)
        return matchId || matchReason
      }

      return true
    })
  }, [requests, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <ReturnToWarehouseHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onOpenCreateModal={() => setIsCreateModalOpen(true)} 
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ReturnToWarehouseTable data={filteredRequests} onRefresh={fetchRequests} />
      )}

      <CreateDisposalRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchRequests}
      />
    </div>
  )
}
