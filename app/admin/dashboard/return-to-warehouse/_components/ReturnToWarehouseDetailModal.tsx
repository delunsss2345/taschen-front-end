'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Calendar, User } from 'lucide-react'
import { toast } from 'sonner'
import { disposalRequestService, type DisposalRequest, type BatchInfo } from '@/services/disposal-request.service'

interface ReturnToWarehouseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  request: DisposalRequest | null
  onRefresh?: () => void
}

const statusConfig = {
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  APPROVED: {
    label: 'Đã duyệt',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  REJECTED: {
    label: 'Từ chối',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export function ReturnToWarehouseDetailModal({
  isOpen,
  onClose,
  request,
  onRefresh,
}: ReturnToWarehouseDetailModalProps) {
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [responseNote, setResponseNote] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<BatchInfo | null>(null)
  const [showBatchDetailModal, setShowBatchDetailModal] = useState(false)

  if (!request) return null

  const handleApprove = async () => {
    const loadingToast = toast.loading('Đang duyệt yêu cầu...', { duration: Infinity })

    try {
      setIsApproving(true)
      await disposalRequestService.approveDisposalRequest(request.id, responseNote)
      toast.dismiss(loadingToast)
      toast.success('Yêu cầu đã được duyệt')
      setShowApproveModal(false)
      setResponseNote('')
      onClose()
      onRefresh?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể duyệt yêu cầu')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    const loadingToast = toast.loading('Đang từ chối yêu cầu...', { duration: Infinity })

    try {
      setIsRejecting(true)
      await disposalRequestService.rejectDisposalRequest(request.id, responseNote)
      toast.dismiss(loadingToast)
      toast.success('Yêu cầu đã bị từ chối')
      setShowRejectModal(false)
      setResponseNote('')
      onClose()
      onRefresh?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể từ chối yêu cầu')
    } finally {
      setIsRejecting(false)
    }
  }

  const getTotalQuantity = () => {
    return request.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chi tiết yêu cầu trả hàng về kho
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ID và Trạng thái */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mã yêu cầu:</span>
                <span className="font-semibold text-blue-600">#{request.id}</span>
              </div>
              <Badge className={`${statusConfig[request.status].className} cursor-default`}>
                {statusConfig[request.status].label}
              </Badge>
            </div>

            {/* Lý do */}
            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Thông tin yêu cầu</h4>
              <div>
                <p className="text-sm text-muted-foreground">Lý do:</p>
                <p className="font-medium">{request.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng số lượng:</p>
                <p className="font-medium">{getTotalQuantity()} sản phẩm</p>
              </div>
            </div>

            {/* Danh sách items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Danh sách lô hàng</h4>
              <div className="rounded-md border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <TableHeaderCell className="text-center">STT</TableHeaderCell>
                      <TableHeaderCell>Mã lô</TableHeaderCell>
                      <TableHeaderCell>Tên sách</TableHeaderCell>
                      <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                      <TableHeaderCell className="text-center">Thao tác</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {request.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>#{item.batchId}</TableCell>
                        <TableCell>{item.batch?.bookTitle || '-'}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="default"
                            size="sm"
                            className="h-8 px-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              setSelectedBatch(item.batch || null)
                              setShowBatchDetailModal(true)
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Thông tin người tạo và xử lý */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Người tạo: </span>
                  <span className="font-medium">{request.createdBy?.email || '-'}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Người xử lý: </span>
                  <span className="font-medium">{request.processedBy?.email || '-'}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Ngày tạo: </span>
                  <span className="font-medium">
                    {new Date(request.createdAt).toLocaleString('vi-VN')}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Ngày xử lý: </span>
                  <span className="font-medium">
                    {request.processedAt ? new Date(request.processedAt).toLocaleString('vi-VN') : '-'}
                  </span>
                </span>
              </div>
            </div>

            {request.responseNote && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phản hồi:</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                  {request.responseNote}
                </p>
              </div>
            )}
          </div>

          {request.status === 'PENDING' && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="destructive"
                onClick={() => setShowRejectModal(true)}
                className="cursor-pointer"
              >
                Từ chối
              </Button>
              <Button
                variant="default"
                onClick={() => setShowApproveModal(true)}
                className="cursor-pointer bg-green-600 hover:bg-green-700"
              >
                Duyệt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Duyệt yêu cầu trả hàng về kho</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ghi chú (không bắt buộc)
            </label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Nhập ghi chú cho yêu cầu..."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveModal(false)
                setResponseNote('')
              }}
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu trả hàng về kho</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Lý do từ chối
            </label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Nhập lý do từ chối..."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false)
                setResponseNote('')
              }}
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Detail Modal */}
      <Dialog open={showBatchDetailModal} onOpenChange={setShowBatchDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết lô hàng</DialogTitle>
          </DialogHeader>
          {selectedBatch ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mã lô</p>
                  <p className="font-medium">{selectedBatch.batchCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tên sách</p>
                  <p className="font-medium">{selectedBatch.bookTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Định dạng</p>
                  <p className="font-medium">{selectedBatch.variant?.formatName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhà cung cấp</p>
                  <p className="font-medium">{selectedBatch.supplierName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số lượng nhập</p>
                  <p className="font-medium">{selectedBatch.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số lượng còn lại</p>
                  <p className="font-medium">{selectedBatch.remainingQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá nhập</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBatch.importPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá bán</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBatch.sellingPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày sản xuất</p>
                  <p className="font-medium">
                    {selectedBatch.productionDate
                      ? new Date(selectedBatch.productionDate).toLocaleDateString('vi-VN')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày nhập kho</p>
                  <p className="font-medium">
                    {selectedBatch.createdAt
                      ? new Date(selectedBatch.createdAt).toLocaleString('vi-VN')
                      : '-'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowBatchDetailModal(false)}
                  className="cursor-pointer"
                >
                  Đóng
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Không có thông tin chi tiết lô hàng
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
