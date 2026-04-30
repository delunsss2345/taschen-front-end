'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import type { DisposalRequest } from '@/services/disposal-request.service'
import { disposalRequestService } from '@/services/disposal-request.service'

interface DisposalTableProps {
  requests: DisposalRequest[]
  onRefresh?: () => void
  canUpdateStatus?: boolean
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-orange-100 shadow-none font-normal">
          Chờ duyệt
        </Badge>
      )
    case 'APPROVED':
      return (
        <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-green-100 shadow-none font-normal">
          Đã duyệt
        </Badge>
      )
    case 'REJECTED':
      return (
        <Badge className="bg-red-50 text-red-500 hover:bg-red-50 border-red-100 shadow-none font-normal">
          Từ chối
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function DisposalTable({ requests, onRefresh, canUpdateStatus = true }: DisposalTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<DisposalRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [responseRequest, setResponseRequest] = useState<DisposalRequest | null>(null)
  const [responseType, setResponseType] = useState<'approve' | 'reject' | null>(null)
  const [responseNote, setResponseNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const handleViewDetails = (request: DisposalRequest) => {
    setSelectedRequest(request)
    setIsDetailOpen(true)
  }

  const openResponseDialog = (request: DisposalRequest, type: 'approve' | 'reject') => {
    setResponseRequest(request)
    setResponseType(type)
    setResponseNote('')
    setIsResponseOpen(true)
  }

  const handleConfirmResponse = async () => {
    if (!responseRequest || !responseType) return

    const loadingToast = toast.loading(
      responseType === 'approve' ? 'Đang duyệt yêu cầu...' : 'Đang từ chối yêu cầu...',
    )
    setIsSubmitting(true)
    try {
      if (responseType === 'approve') {
        await disposalRequestService.approveDisposalRequest(responseRequest.id, responseNote)
        toast.success('Duyệt yêu cầu xuất hủy thành công', { id: loadingToast, duration: 4000 })
      } else {
        await disposalRequestService.rejectDisposalRequest(responseRequest.id, responseNote)
        toast.success('Đã từ chối yêu cầu xuất hủy', { id: loadingToast, duration: 4000 })
      }
      setIsResponseOpen(false)
      setIsDetailOpen(false)
      onRefresh?.()
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Thao tác thất bại', {
        id: loadingToast,
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderActionButtons = (item: DisposalRequest) => {
    if (item.status === 'PENDING' && canUpdateStatus) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            className="h-8 cursor-pointer bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 gap-1"
            onClick={(e) => { e.stopPropagation(); openResponseDialog(item, 'approve') }}
          >
            <Check className="h-3.5 w-3.5" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 cursor-pointer shadow-sm transition-all duration-200 gap-1"
            onClick={(e) => { e.stopPropagation(); openResponseDialog(item, 'reject') }}
          >
            <X className="h-3.5 w-3.5" />
            Từ chối
          </Button>
          <Button
            size="sm"
            className="h-8 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); handleViewDetails(item) }}
          >
            Chi tiết
          </Button>
        </div>
      )
    }

    return (
      <Button
        size="sm"
        className="h-8 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200"
        onClick={(e) => { e.stopPropagation(); handleViewDetails(item) }}
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
              <TableHeaderCell>Lý do</TableHeaderCell>
              <TableHeaderCell>Người tạo</TableHeaderCell>
              <TableHeaderCell>Người xử lý</TableHeaderCell>
              <TableHeaderCell>Ngày tạo</TableHeaderCell>
              <TableHeaderCell>Ngày xử lý</TableHeaderCell>
              <TableHeaderCell className="text-center">Số lô</TableHeaderCell>
              <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-center w-48">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                  Không có yêu cầu xuất hủy nào
                </td>
              </tr>
            ) : (
              requests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell variant="primary">#{item.id}</TableCell>
                  <TableCell className="max-w-45 truncate" title={item.reason}>
                    {item.reason}
                  </TableCell>
                  <TableCell variant="secondary">{item.createdBy?.email ?? '—'}</TableCell>
                  <TableCell variant="secondary">{item.processedBy?.email ?? '—'}</TableCell>
                  <TableCell variant="muted">{formatDate(item.createdAt)}</TableCell>
                  <TableCell variant="muted">{formatDate(item.processedAt)}</TableCell>
                  <TableCell className="text-center">{item.items.length}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-center">{renderActionButtons(item)}</TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="min-w-200 max-w-200 max-h-[90vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Chi tiết yêu cầu xuất hủy #{selectedRequest?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Ngày tạo</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người tạo</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedRequest.createdBy?.email ?? '—'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Người xử lý</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedRequest.processedBy?.email ?? '—'}
                  </p>
                </div>
                {selectedRequest.processedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Ngày xử lý</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(selectedRequest.processedAt)}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Lý do xuất hủy</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.reason}</p>
                </div>
                {selectedRequest.responseNote && (
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase">Ghi chú phản hồi</label>
                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.responseNote}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-3 block">
                  Danh sách lô hàng xuất hủy
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Mã lô</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Tên sách</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Định dạng</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">SL xuất hủy</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">Tồn trong lô</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedRequest.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 px-4 font-mono text-xs text-gray-600">
                            {item.batch?.batchCode ?? `#${item.batchId}`}
                          </td>
                          <td className="py-3 px-4 text-gray-900">{item.batch?.bookTitle ?? '—'}</td>
                          <td className="py-3 px-4 text-gray-500">
                            {item.batch?.variant?.formatName ?? '—'}
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-red-500">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {item.batch?.remainingQuantity ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 border-t pt-4 mt-4">
            {selectedRequest?.status === 'PENDING' && canUpdateStatus ? (
              <>
                <Button
                  className="cursor-pointer bg-blue-600! hover:bg-blue-700! text-white"
                  onClick={() => openResponseDialog(selectedRequest, 'approve')}
                >
                  Duyệt
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => openResponseDialog(selectedRequest, 'reject')}
                >
                  Từ chối
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="cursor-pointer">
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent className="sm:max-w-md font-sans">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {responseType === 'approve' ? 'Duyệt yêu cầu xuất hủy' : 'Từ chối yêu cầu xuất hủy'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ghi chú phản hồi (tuỳ chọn)
            </label>
            <Input
              placeholder={
                responseType === 'approve'
                  ? 'Nhập ghi chú duyệt...'
                  : 'Nhập lý do từ chối...'
              }
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmResponse() }}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsResponseOpen(false)}
              className="cursor-pointer"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleConfirmResponse}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Đang xử lý...'
                : responseType === 'approve'
                  ? 'Xác nhận duyệt'
                  : 'Xác nhận từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
