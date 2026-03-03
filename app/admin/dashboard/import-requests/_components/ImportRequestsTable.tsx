'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Check, X } from 'lucide-react'
import { StockRequest } from '@/services/stock-request.service'
import { stockRequestService } from '@/services/stock-request.service'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth'
import { CreatePurchaseOrderFromStockRequestModal } from './CreatePurchaseOrderFromStockRequestModal'

export type ImportRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'ORDERED'

export type TableMode = 'pending' | 'approved' | 'rejected' | 'all' | 'ordered'

interface ImportRequestsTableProps {
  requests: StockRequest[]
  mode: TableMode
  onRefresh?: () => void
}

export function ImportRequestsTable({ requests, mode, onRefresh }: ImportRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false)
  const [approvingId, setApprovingId] = useState<number | null>(null)
  const [rejectingId, setRejectingId] = useState<number | null>(null)
  const { currentUser } = useAuthStore()

  // Response message dialog state
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [responseRequest, setResponseRequest] = useState<StockRequest | null>(null)
  const [responseType, setResponseType] = useState<'approve' | 'reject' | null>(null)
  const [responseMessage, setResponseMessage] = useState('')

  const getStatusBadge = (item: StockRequest) => {
    const status = item.status
    
    switch (status) {
      case 'PENDING':
        return (
          <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-orange-100 shadow-none font-normal">
            Chờ duyệt
          </Badge>
        )
      case 'APPROVED':
        return (
          <Badge className="bg-blue-50 text-blue-500 hover:bg-blue-50 border-blue-100 shadow-none font-normal">
            Đã duyệt
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-50 text-red-500 hover:bg-red-50 border-red-100 shadow-none font-normal">
            Từ chối
          </Badge>
        )
      case 'CONFIRMED':
        return (
          <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-green-100 shadow-none font-normal">
            Đã xác nhận
          </Badge>
        )
      case 'ORDERED':
        return (
          <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-50 border-purple-100 shadow-none font-normal">
            Đã tạo đơn
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewDetails = (request: StockRequest) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const openResponseDialog = (request: StockRequest, type: 'approve' | 'reject') => {
    setResponseRequest(request)
    setResponseType(type)
    setResponseMessage('')
    setIsResponseDialogOpen(true)
  }

  const handleConfirmResponse = async () => {
    if (!responseRequest || !responseType) {
      return
    }

    if (!currentUser) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    const processedById = currentUser.id

    if (responseType === 'approve') {
      const loadingToast = toast.loading('Đang duyệt yêu cầu...')
      setApprovingId(responseRequest.id)
      try {
        await stockRequestService.approve(responseRequest.id, processedById, responseMessage)
        toast.success('Duyệt yêu cầu thành công')
        setIsResponseDialogOpen(false)
        onRefresh?.()
      } catch (error) {
        const err = error as { response?: { data?: { error?: string; message?: string } } }
        toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Duyệt yêu cầu thất bại')
      } finally {
        toast.dismiss(loadingToast)
        setApprovingId(null)
      }
    } else {
      const loadingToast = toast.loading('Đang từ chối yêu cầu...')
      setRejectingId(responseRequest.id)
      try {
        await stockRequestService.reject(responseRequest.id, processedById, responseMessage)
        toast.success('Từ chối yêu cầu thành công')
        setIsResponseDialogOpen(false)
        onRefresh?.()
      } catch (error) {
        const err = error as { response?: { data?: { error?: string; message?: string } } }
        toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Từ chối yêu cầu thất bại')
      } finally {
        toast.dismiss(loadingToast)
        setRejectingId(null)
      }
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const renderActionButtons = (item: StockRequest) => {
    // For 'all' mode, determine buttons based on item status
    const effectiveMode = mode === 'all' 
      ? (item.status === 'PENDING' ? 'pending' : item.status === 'ORDERED' ? 'ordered' : item.status === 'APPROVED' ? 'approved' : 'rejected')
      : mode

    // Pending mode: Duyệt / Từ chối buttons
    if (effectiveMode === 'pending') {
      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            className="h-8 cursor-pointer bg-blue-600! hover:bg-blue-700! text-white shadow-sm transition-all duration-200 gap-1"
            onClick={() => openResponseDialog(item, 'approve')}
            disabled={approvingId !== null}
          >
            <Check className="h-3.5 w-3.5" />
            {approvingId === item.id ? 'Đang...' : 'Duyệt'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 cursor-pointer shadow-sm transition-all duration-200 gap-1"
            onClick={() => openResponseDialog(item, 'reject')}
            disabled={rejectingId !== null}
          >
            <X className="h-3.5 w-3.5" />
            {rejectingId === item.id ? 'Đang...' : 'Từ chối'}
          </Button>
        </div>
      )
    }

    // Approved mode: Đặt hàng ngay / Xem chi tiết buttons
    if (effectiveMode === 'approved') {
      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            onClick={() => {
              setSelectedRequest(item)
              setIsCreateOrderModalOpen(true)
            }}
            className="h-8 gap-1 px-3 cursor-pointer bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200"
          >
            Đặt hàng ngay
          </Button>
          <Button
            size="sm"
            onClick={() => handleViewDetails(item)}
            className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
          >
            Xem chi tiết
          </Button>
        </div>
      )
    }

    // Ordered mode: only view details (already ordered)
    if (effectiveMode === 'ordered') {
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
              <TableHeaderCell>Định dạng</TableHeaderCell>
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
            {requests.map((item) => (
              <TableRow key={item.id}>
                <TableCell variant="primary">{item.id}</TableCell>
                <TableCell>{item.bookTitle}</TableCell>
                <TableCell>{item.variantName || '-'}</TableCell>
                <TableCell className="text-right text-red-500 font-medium">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(item)}
                </TableCell>
                <TableCell>{item.createdByName}</TableCell>
                <TableCell>{item.processedByName || '-'}</TableCell>
                <TableCell className="max-w-[150px] truncate" title={item.reason}>
                  {item.reason}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={item.responseMessage || undefined}>
                  {item.responseMessage || '-'}
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
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedRequest.bookTitle}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Số lượng</label>
                <p className="text-sm font-medium text-red-500 mt-1">{selectedRequest.quantity}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Lý do</label>
                <p className="text-sm text-gray-700 mt-1">{selectedRequest.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày tạo</label>
                  <p className="text-sm text-gray-700 mt-1">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người tạo</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.createdByName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.processedByName || '-'}</p>
                </div>
              </div>

              {selectedRequest.responseMessage && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Phản hồi</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.responseMessage}</p>
                </div>
              )}

              {selectedRequest.processedAt && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày xử lý</label>
                  <p className="text-sm text-gray-700 mt-1">{formatDate(selectedRequest.processedAt)}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 border-t pt-4 mt-4">
            {selectedRequest?.status === 'PENDING' ? (
              <>
                <Button 
                  className="cursor-pointer bg-blue-600! hover:bg-blue-700! text-white"
                  onClick={() => openResponseDialog(selectedRequest, 'approve')}
                  disabled={approvingId !== null}
                >
                  {approvingId === selectedRequest.id ? 'Đang duyệt...' : 'Duyệt'}
                </Button>
                <Button 
                  variant="destructive" 
                  className="cursor-pointer"
                  onClick={() => openResponseDialog(selectedRequest, 'reject')}
                  disabled={rejectingId !== null}
                >
                  {rejectingId === selectedRequest.id ? 'Đang từ chối...' : 'Từ chối'}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="cursor-pointer">
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Message Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-md font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {responseType === 'approve' ? 'Duyệt yêu cầu' : 'Từ chối yêu cầu'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nhập phản hồi
            </label>
            <Input
              placeholder={responseType === 'approve' ? 'Nhập nội dung phản hồi duyệt...' : 'Nhập lý do từ chối...'}
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmResponse()
                }
              }}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsResponseDialogOpen(false)}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleConfirmResponse}
              disabled={responseType === 'approve' ? approvingId !== null : rejectingId !== null}
            >
              {responseType === 'approve' ? 'Duyệt' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Purchase Order Modal */}
      <CreatePurchaseOrderFromStockRequestModal
        open={isCreateOrderModalOpen}
        onOpenChange={setIsCreateOrderModalOpen}
        stockRequest={selectedRequest}
        onSuccess={() => {
          onRefresh?.()
        }}
      />
    </>
  )
}
