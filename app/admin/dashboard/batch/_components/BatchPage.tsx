'use client'

import { useEffect, useState, useMemo } from 'react'
import { BatchHeader } from './BatchHeader'
import { BatchTable } from './BatchTable'
import { batchService, type Batch } from '@/services/batch.service'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'
import { AddBatchDialog } from './AddBatchDialog'

export function BatchPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const fetchBatches = async () => {
    try {
      setIsLoading(true)
      const data = await batchService.getAllBatches()
      setBatches(data)
    } catch {
      toast.error('Không thể tải danh sách lô hàng')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBatches = useMemo(() => {
    if (!searchQuery.trim()) return batches
    
    const query = searchQuery.toLowerCase()
    return batches.filter(
      (batch) =>
        batch.batchCode.toLowerCase().includes(query) ||
        batch.bookTitle.toLowerCase().includes(query) ||
        batch.supplierName.toLowerCase().includes(query)
    )
  }, [batches, searchQuery])

  const handleAddBatch = () => {
    setIsAddDialogOpen(true)
  }

  const handleAddBatchSuccess = () => {
    setIsAddDialogOpen(false)
    fetchBatches()
    toast.success('Thêm lô hàng thành công')
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  return (
    <div className="space-y-4">
      <BatchHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddBatch={handleAddBatch}
      />
      {isLoading ? <LoadingSpinner /> : <BatchTable batches={filteredBatches} />}
      <AddBatchDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddBatchSuccess}
      />
    </div>
  )
}
