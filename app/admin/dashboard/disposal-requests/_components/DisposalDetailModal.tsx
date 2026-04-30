'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { DisposalRequest } from '@/services/disposal-request.service';
import { useApproveDisposalRequestMutation, useRejectDisposalRequestMutation } from '@/features/disposal/hooks';

interface DisposalDetailModalProps {
  request: DisposalRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 shadow-none font-normal">
          Chờ duyệt
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 shadow-none font-normal">
          Đã duyệt
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal">
          Từ chối
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function DisposalDetailModal({ request, open, onOpenChange }: DisposalDetailModalProps) {
  const [responseNote, setResponseNote] = useState('');

  const approveMutation = useApproveDisposalRequestMutation();
  const rejectMutation = useRejectDisposalRequestMutation();

  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = async () => {
    if (!request) return;
    const toastId = toast.loading('Đang duyệt...');
    try {
      await approveMutation.mutateAsync({ id: request.id, responseNote });
      toast.success('Đã duyệt yêu cầu xuất hủy', { id: toastId, duration: 4000 });
      setResponseNote('');
      onOpenChange(false);
    } catch {
      toast.error('Không thể duyệt yêu cầu', { id: toastId, duration: 4000 });
    }
  };

  const handleReject = async () => {
    if (!request) return;
    const toastId = toast.loading('Đang từ chối...');
    try {
      await rejectMutation.mutateAsync({ id: request.id, responseNote });
      toast.success('Đã từ chối yêu cầu xuất hủy', { id: toastId, duration: 4000 });
      setResponseNote('');
      onOpenChange(false);
    } catch {
      toast.error('Không thể từ chối yêu cầu', { id: toastId, duration: 4000 });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu xuất hủy #{request?.id}</DialogTitle>
        </DialogHeader>

        {request && (
          <div className="space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <div className="mt-1">
                  <StatusBadge status={request.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Người tạo</p>
                <p className="font-medium">{request.createdBy?.email ?? '—'}</p>
              </div>
              {request.processedAt && (
                <div>
                  <p className="text-sm text-gray-500">Ngày xử lý</p>
                  <p className="font-medium">{formatDate(request.processedAt)}</p>
                </div>
              )}
              {request.processedBy && (
                <div>
                  <p className="text-sm text-gray-500">Người xử lý</p>
                  <p className="font-medium">{request.processedBy.email}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Lý do xuất hủy</p>
                <p className="font-medium">{request.reason || '—'}</p>
              </div>
              {request.responseNote && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Ghi chú phản hồi</p>
                  <p className="font-medium">{request.responseNote}</p>
                </div>
              )}
            </div>

            {/* Items table */}
            <div>
              <p className="text-sm font-medium mb-3">Danh sách lô hàng xuất hủy</p>
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
                    {request.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-4 font-mono text-xs text-gray-600">
                          {item.batch?.batchCode ?? `#${item.batchId}`}
                        </td>
                        <td className="py-3 px-4">{item.batch?.bookTitle ?? '—'}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {item.batch?.variant?.formatName ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-red-600">
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

            {/* Approve / Reject actions (only for PENDING) */}
            {request.status === 'PENDING' && (
              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-medium">Ghi chú phản hồi (tuỳ chọn)</p>
                <Textarea
                  placeholder="Nhập ghi chú phản hồi..."
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleReject}
                    disabled={isProcessing}
                  >
                    Từ chối
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                    disabled={isProcessing}
                  >
                    Duyệt yêu cầu
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
