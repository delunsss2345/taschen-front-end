'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'

interface ImportRequest {
  id: number
  bookName: string
  quantity: number
  status: string
  createdBy: string
  processedBy: string | null
  note: string
  feedback: string
  createdAt: string
  processedAt: string | null
}

interface ImportRequestsTableProps {
  requests: ImportRequest[]
}

export function ImportRequestsTable({ requests }: ImportRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<ImportRequest | null>(null)
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
            Từ chối
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetails = (request: ImportRequest) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
        <table className="w-full text-sm">
          <thead className="bg-[#fcfcfc] border-b border-gray-50">
            <tr className="text-gray-500 font-medium">
              <TableHeaderCell className="w-16">ID</TableHeaderCell>
              <TableHeaderCell>Tên sách</TableHeaderCell>
              <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
              <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell>Người tạo</TableHeaderCell>
              <TableHeaderCell>Ghi chú</TableHeaderCell>
              <TableHeaderCell>Phản hồi</TableHeaderCell>
              <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {requests.map((item) => (
              <TableRow key={item.id}>
                <TableCell variant="primary">{item.id}</TableCell>
                <TableCell>{item.bookName}</TableCell>
                <TableCell className="text-right text-red-500 font-medium">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={item.note}>
                  {item.note}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={item.feedback}>
                  {item.feedback || '-'}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => handleViewDetails(item)}
                    className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
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
              Chi tiết yêu cầu nhập kho
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">ID</label>
                  <p className="text-sm font-medium text-blue-600 mt-1">#{selectedRequest.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Tên sách</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedRequest.bookName}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Số lượng</label>
                <p className="text-sm font-medium text-red-500 mt-1">{selectedRequest.quantity}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Ghi chú</label>
                <p className="text-sm text-gray-700 mt-1">{selectedRequest.note}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày tạo</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người tạo</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.createdBy}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.processedBy || '-'}</p>
                </div>
              </div>

              {selectedRequest.feedback && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Phản hồi</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.feedback}</p>
                </div>
              )}

              {selectedRequest.processedAt && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.processedAt}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
