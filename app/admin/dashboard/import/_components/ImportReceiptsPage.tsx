'use client'

import { useEffect, useState, useMemo } from 'react'
import { ImportReceiptsHeader } from './ImportReceiptsHeader'
import { ImportReceiptsTable } from './ImportReceiptsTable'
import { useImportReceiptsQuery } from '@/features/import-stock/hooks'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading'

export function ImportReceiptsPage() {
  const { data: importReceipts, isPending, error, refetch } = useImportReceiptsQuery({
    select: (data) => data,
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (error) {
      toast.error('Không thể tải danh sách phiếu nhập')
    }
  }, [error])

  const filteredReceipts = useMemo(() => {
    if (!searchQuery.trim()) return importReceipts ?? []

    const query = searchQuery.toLowerCase().trim()
    return (importReceipts ?? []).filter((receipt) => {
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
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <ImportReceiptsTable
          importReceipts={filteredReceipts}
          onRefresh={() => {
            void refetch()
          }}
        />
      )}
    </div>
  )
}
