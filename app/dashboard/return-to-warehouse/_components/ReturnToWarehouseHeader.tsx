'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ReturnToWarehouseHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yêu cầu trả hàng về kho</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý các yêu cầu trả sách về kho
        </p>
      </div>
      <Button variant="default" className="h-9 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4" />
        Tạo yêu cầu
      </Button>
    </div>
  )
}
