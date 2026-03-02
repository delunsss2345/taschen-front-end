'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { returnRequestService } from '@/services/return-request.service'

interface ReturnRequestItem {
  bookId: number
  bookTitle: string
  bookAuthor: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface ReturnRequest {
  id: number
  orderId: number
  orderTotal: number
  reason: string
  status: string
  createdAt: string
  processedAt: string | null
  createdById: number
  createdByName: string
  processedById: number | null
  processedByName: string | null
  responseNote: string | null
  items: ReturnRequestItem[]
}

interface ReturnsTableProps {
  returns: ReturnRequest[]
  onRefresh?: () => void
}

export function ReturnsTable({ returns, onRefresh }: ReturnsTableProps) {
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Approve modal states
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [approveNote, setApproveNote] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  
  // Reject modal states
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

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
      case 'RETURNED':
        return (
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50 shadow-none font-normal">
            Đã trả
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

  const handleApprove = async () => {
    if (!selectedReturn) return
    
    const loadingToast = toast.loading('Đang duyệt yêu cầu...', { duration: Infinity })
    
    try {
      setIsApproving(true)
      await returnRequestService.approve(selectedReturn.id, approveNote)
      toast.dismiss(loadingToast)
      toast.success('Yêu cầu đã được duyệt')
      setShowApproveModal(false)
      setApproveNote('')
      setIsDialogOpen(false)
      onRefresh?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể duyệt yêu cầu')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedReturn) return
    
    const loadingToast = toast.loading('Đang từ chối yêu cầu...', { duration: Infinity })
    
    try {
      setIsRejecting(true)
      await returnRequestService.reject(selectedReturn.id, rejectNote)
      toast.dismiss(loadingToast)
      toast.success('Yêu cầu đã bị từ chối')
      setShowRejectModal(false)
      setRejectNote('')
      setIsDialogOpen(false)
      onRefresh?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể từ chối yêu cầu')
    } finally {
      setIsRejecting(false)
    }
  }

  const openApproveModal = () => {
    setShowApproveModal(true)
  }

  const openRejectModal = () => {
    setShowRejectModal(true)
  }

  return (
    <>
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
        <table className="w-full text-sm">
          <thead className="bg-[#fcfcfc] border-b border-gray-50">
            <tr className="text-gray-500 font-medium">
              <TableHeaderCell className="w-16">ID</TableHeaderCell>
              <TableHeaderCell className='w-32'>Mã đơn trả</TableHeaderCell>
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
                <TableCell>#{item.orderId}</TableCell>
                <TableCell className="text-right text-red-500">
                  {formatCurrency(item.orderTotal)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={item.reason}>
                  {item.reason}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>{item.createdByName}</TableCell>
                <TableCell>{item.processedByName || '-'}</TableCell>
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
        <DialogContent className="min-w-[800px] max-w-[800px] max-h-[90vh] overflow-y-auto font-sans">
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
                  <label className="text-xs font-medium text-gray-500 uppercase">Mã đơn trả</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">#{selectedReturn.orderId}</p>
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
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.createdByName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.processedByName || '-'}</p>
                </div>
              </div>

              {selectedReturn.processedAt && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedReturn.processedAt}</p>
                </div>
              )}

              {selectedReturn.responseNote && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Phản hồi</label>
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-md border border-gray-100">
                    {selectedReturn.responseNote}
                  </p>
                </div>
              )}

              {/* Items Table */}
              <div className="mt-6">
                <label className="text-xs font-medium text-gray-500 uppercase">Danh sách sách</label>
                <div className="mt-2 rounded-md border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <TableHeaderCell className="text-center">STT</TableHeaderCell>
                        <TableHeaderCell>Tên sách</TableHeaderCell>
                        <TableHeaderCell>Tác giả</TableHeaderCell>
                        <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                        <TableHeaderCell className="text-right">Đơn giá</TableHeaderCell>
                        <TableHeaderCell className="text-right">Thành tiền</TableHeaderCell>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {selectedReturn.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell>{item.bookTitle}</TableCell>
                          <TableCell>{item.bookAuthor}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right text-red-500">{formatCurrency(item.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 border-t pt-4 mt-4">
            {selectedReturn?.status === 'PENDING' ? (
              <>
                <Button
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
                  onClick={openApproveModal}
                >
                  
                  Duyệt
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={openRejectModal}
                >
                 
                  Từ chối
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="cursor-pointer"
              >
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-md font-sans">
          <DialogHeader>
            <DialogTitle>Duyệt yêu cầu hoàn/đổi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ghi chú
            </label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Nhập ghi chú cho yêu cầu..."
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? 'Đang duyệt...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md font-sans">
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu hoàn/đổi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Lý do từ chối
            </label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Nhập lý do từ chối..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(false)}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? 'Đang từ chối...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
