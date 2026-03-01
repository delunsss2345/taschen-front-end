'use client'

import { useEffect, useState } from 'react'
import { ImportReceiptsHeader } from './ImportReceiptsHeader'
import { ImportReceiptsTable } from './ImportReceiptsTable'
import { importStockService, ImportStock } from '@/services/import-stock.service'
import { toast } from 'sonner'

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
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      ) : (
        <ImportReceiptsTable importReceipts={importReceipts} onRefresh={fetchImportReceipts} />
      )}
    </div>
  )
}
