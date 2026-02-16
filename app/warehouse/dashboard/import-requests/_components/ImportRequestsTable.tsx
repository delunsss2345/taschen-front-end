'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Check, X } from 'lucide-react'

export type ImportRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED'

export interface ImportRequest {
  id: number
  bookName: string
  quantity: number
  status: ImportRequestStatus
  createdBy: string
  processedBy: string | null
  note: string
  feedback: string
  createdAt: string
  processedAt: string | null
}

export type TableMode = 'pending' | 'approved' | 'rejected'

interface ImportRequestsTableProps {
  requests: ImportRequest[]
  mode: TableMode
  onStatusChange?: (id: number, newStatus: ImportRequestStatus) => void
}

export function ImportRequestsTable({ requests, mode, onStatusChange }: ImportRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<ImportRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [localRequests, setLocalRequests] = useState(requests)

  // Update local state when requests prop changes
  if (JSON.stringify(requests) !== JSON.stringify(localRequests)) {
    // Only update if the data actually changed
  }

  const getStatusBadge = (status: ImportRequestStatus) => {
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
      case 'CONFIRMED':
        return (
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50 shadow-none font-normal">
            Đã xác nhận
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

  const handleApprove = (id: number) => {
    const updated = localRequests.map(item => 
      item.id === id ? { ...item, status: 'APPROVED' as ImportRequestStatus, processedBy: 'Warehouse', processedAt: new Date().toISOString().split('T')[0] } : item
    )
    setLocalRequests(updated)
    onStatusChange?.(id, 'APPROVED')
  }

  const handleReject = (id: number) => {
    const updated = localRequests.map(item => 
      item.id === id ? { ...item, status: 'REJECTED' as ImportRequestStatus, processedBy: 'Warehouse', processedAt: new Date().toISOString().split('T')[0] } : item
    )
    setLocalRequests(updated)
    onStatusChange?.(id, 'REJECTED')
  }

  const handleCreateReceipt = (id: number) => {
    const updated = localRequests.map(item => 
      item.id === id ? { ...item, status: 'CONFIRMED' as ImportRequestStatus, processedBy: 'Warehouse', processedAt: new Date().toISOString().split('T')[0] } : item
    )
    setLocalRequests(updated)
    onStatusChange?.(id, 'CONFIRMED')
  }

  const renderActionButtons = (item: ImportRequest) => {
    // Pending mode: Duyệt / Từ chối buttons
    if (mode === 'pending') {
      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            onClick={() => handleApprove(item.id)}
            className="h-8 cursor-pointer bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 gap-1"
          >
            <Check className="h-3.5 w-3.5" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleReject(item.id)}
            className="h-8 cursor-pointer shadow-sm transition-all duration-200 gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Từ chối
          </Button>
        </div>
      )
    }

    // Approved mode: Tạo phiếu nhập button
    if (mode === 'approved') {
      if (item.status === 'CONFIRMED') {
        return (
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 shadow-none font-normal">
            Đã xác nhận
          </Badge>
        )
      }
      return (
        <Button
          size="sm"
          onClick={() => handleCreateReceipt(item.id)}
          className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
        >
          
          Tạo phiếu nhập
        </Button>
      )
    }

    // Rejected mode: just view details
    return (
      <Button
        size="sm"
        onClick={() => handleViewDetails(item)}
        className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
      >
        
        Xem chi tiết
      </Button>
    )
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
              <TableHeaderCell>Người xử lý</TableHeaderCell>
              <TableHeaderCell>Ghi chú</TableHeaderCell>
              <TableHeaderCell>Phản hồi</TableHeaderCell>
              <TableHeaderCell className="text-center w-40">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {localRequests.map((item) => (
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
                <TableCell>{item.processedBy || '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={item.note}>
                  {item.note}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={item.feedback}>
                  {item.feedback || '-'}
                </TableCell>
                <TableCell className="text-center">
                  {renderActionButtons(item)}
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

          <DialogFooter className="gap-2 border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
