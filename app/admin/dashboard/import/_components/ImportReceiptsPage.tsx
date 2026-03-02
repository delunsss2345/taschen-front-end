'use client'

import { useEffect, useState } from 'react'
import { ImportReceiptsHeader } from './ImportReceiptsHeader'
import { ImportReceiptsTable } from './ImportReceiptsTable'
import { importStockService, ImportStock } from '@/services/import-stock.service'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading'

export function ImportReceiptsPage() {
  const [importReceipts, setImportReceipts] = useState<ImportStock[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <ImportReceiptsHeader />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ImportReceiptsTable importReceipts={importReceipts} onRefresh={fetchImportReceipts} />
      )}
    </div>
  )
}
