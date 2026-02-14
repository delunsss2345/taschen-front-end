'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Check, X, Eye } from 'lucide-react'

interface ReturnRequest {
  id: number
  orderCode: string
  orderTotal: number
  reason: string
  status: string
  createdBy: string
  processedBy: string | null
  createdAt: string
  processedAt: string | null
}

interface ReturnsTableProps {
  returns: ReturnRequest[]
}

export function ReturnsTable({ returns }: ReturnsTableProps) {
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-50 shadow-none font-normal">
            Chờ duyệt
          </Badge>
        )
      case 'APPROVED':
        return (
          <Badge className="bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal">
            Đã duyệt
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal">
            Đã từ chối
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const handleViewDetails = (returnItem: ReturnRequest) => {
    setSelectedReturn(returnItem)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
        <table className="w-full text-sm">
          <thead className="bg-[#fcfcfc] border-b border-gray-50">
            <tr className="text-gray-500 font-medium">
              <TableHeaderCell className="w-16">ID</TableHeaderCell>
              <TableHeaderCell>Mã đơn</TableHeaderCell>
              <TableHeaderCell className="text-right">Tổng tiền đơn</TableHeaderCell>
              <TableHeaderCell>Lý do</TableHeaderCell>
              <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell>Người tạo</TableHeaderCell>
              <TableHeaderCell>Người xử lý</TableHeaderCell>
              <TableHeaderCell>Ngày tạo</TableHeaderCell>
              <TableHeaderCell className="text-center w-24">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {returns.map((item) => (
              <TableRow key={item.id}>
                <TableCell variant="primary">{item.id}</TableCell>
                <TableCell>{item.orderCode}</TableCell>
                <TableCell className="text-right text-red-500">
                  {formatCurrency(item.orderTotal)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={item.reason}>
                  {item.reason}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.processedBy || '-'}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => handleViewDetails(item)}
                    className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Chi tiết yêu cầu hoàn/đổi
            </DialogTitle>
          </DialogHeader>

          {selectedReturn && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">ID</label>
                  <p className="text-sm font-medium text-blue-600 mt-1">#{selectedReturn.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mã đơn</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedReturn.orderCode}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Tổng tiền đơn</label>
                <p className="text-sm font-medium text-red-500 mt-1">
                  {formatCurrency(selectedReturn.orderTotal)}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Lý do</label>
                <p className="text-sm text-gray-700 mt-1">{selectedReturn.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedReturn.status)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày tạo</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người tạo</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.createdBy}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.processedBy || '-'}</p>
                </div>
              </div>

              {selectedReturn.processedAt && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.processedAt}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 border-t pt-4 mt-4">
            {selectedReturn?.status === 'PENDING' ? (
              <>
                <Button
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  Duyệt
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Từ chối
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="cursor-pointer"
              >
                Xem chi tiết
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
