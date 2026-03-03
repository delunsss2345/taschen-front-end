'use client'

import { useEffect, useState, useMemo } from 'react'
import { ImportReceiptsHeader } from './ImportReceiptsHeader'
import { ImportReceiptsTable } from './ImportReceiptsTable'
import { importStockService, ImportStock } from '@/services/import-stock.service'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading'

export function ImportReceiptsPage() {
  const [importReceipts, setImportReceipts] = useState<ImportStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchImportReceipts = async () => {
    try {
      setIsLoading(true)
      const data = await importStockService.getAll()
      setImportReceipts(data)
    } catch (error) {
      toast.error('Không thể tải danh sách phiếu nhập')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImportReceipts()
  }, [])

  const filteredReceipts = useMemo(() => {
    if (!searchQuery.trim()) return importReceipts

    const query = searchQuery.toLowerCase().trim()
    return importReceipts.filter((receipt) => {
      const totalQuantity = (receipt.details || receipt.items || []).reduce((sum, item) => sum + item.quantity, 0)
      return (
        receipt.id.toString().includes(query) ||
        receipt.supplierName?.toLowerCase().includes(query) ||
        receipt.createdByName?.toLowerCase().includes(query) ||
        totalQuantity.toString().includes(query)
      )
    })
  }, [importReceipts, searchQuery])

  return (
    <div className="space-y-6">
      <ImportReceiptsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ImportReceiptsTable importReceipts={filteredReceipts} onRefresh={fetchImportReceipts} />
      )}
    </div>
  )
}
