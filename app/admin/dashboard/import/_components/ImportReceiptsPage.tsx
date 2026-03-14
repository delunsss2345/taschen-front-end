'use client'

import { useEffect } from 'react'
import { ImportReceiptsHeader } from './ImportReceiptsHeader'
import { ImportReceiptsTable } from './ImportReceiptsTable'
import { useImportReceiptsQuery } from '@/features/import-stock/hooks'
import { toast } from 'sonner'

export function ImportReceiptsPage() {
  const { data: importReceipts, isPending, error, refetch } = useImportReceiptsQuery({
    select: (data) => data,
  })

  useEffect(() => {
    if (error) {
      toast.error('Không thể tải danh sách phiếu nhập')
    }
  }, [error])

  return (
    <div className="space-y-6">
      <ImportReceiptsHeader />
      {isPending ? (
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      ) : (
        <ImportReceiptsTable
          importReceipts={importReceipts ?? []}
          onRefresh={() => {
            void refetch()
          }}
        />
      )}
    </div>
  )
}
