"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronRight, MapPin, MessageSquare, Package, ShoppingCart, XCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import { useOrdersQuery } from "@/features/profile";
import { useCancelOrderMutation, useConfirmReceivedMutation } from "@/features/profile";
import { returnRequestService } from "@/services/return-request.service";
import type { ReturnRequest } from "@/services/return-request.service";
import type { Order, OrderStatus } from "@/types/profile.type";

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const STATUS_LABELS: Record<OrderStatus, string> = {
  UNPAID: "Chờ thanh toán",
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  DELIVERING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RETURNED: "Đã hoàn trả",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  UNPAID: "bg-orange-50 text-orange-700 border-orange-200",
  PENDING: "bg-purple-50 text-purple-700 border-purple-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERING: "bg-teal-50 text-teal-700 border-teal-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNED: "bg-gray-50 text-gray-600 border-gray-200",
};

const TABS = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"] as const;

function filterByTab(orders: Order[], tab: string): Order[] {
  if (tab === "Tất cả") return orders;
  if (tab === "Đang xử lý") return orders.filter((o) => ["UNPAID", "PENDING", "PROCESSING"].includes(o.status));
  if (tab === "Đang giao") return orders.filter((o) => o.status === "DELIVERING");
  if (tab === "Hoàn thành") return orders.filter((o) => ["COMPLETED", "RETURNED"].includes(o.status));
  if (tab === "Đã hủy") return orders.filter((o) => o.status === "CANCELLED");
  return orders;
}

function ReturnRequestDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do hoàn trả");
      return;
    }
    setSubmitting(true);
    try {
      await returnRequestService.create({ orderId: order.id, reason: reason.trim() });
      toast.success("Yêu cầu hoàn trả đã được gửi");
      onOpenChange(false);
      setReason("");
    } catch {
      toast.error("Gửi yêu cầu hoàn trả thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yêu cầu hoàn trả đơn hàng #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reason">Lý do hoàn trả</Label>
            <Textarea
              id="reason"
              placeholder="Mô tả lý do bạn muốn hoàn trả..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !reason.trim()}>
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const RETURN_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const RETURN_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

function OrderCard({ order, returnRequest }: { order: Order; returnRequest?: ReturnRequest }) {
  const cancelMutation = useCancelOrderMutation();
  const confirmMutation = useConfirmReceivedMutation();
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [returnOpen, setReturnOpen] = React.useState(false);

  const statusClass = STATUS_COLORS[order.status] ?? "bg-gray-50 text-gray-600 border-gray-200";
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;

  const canCancel = ["UNPAID", "PENDING"].includes(order.status);
  const canConfirm = order.status === "DELIVERING";
  const canReturn = order.status === "COMPLETED";

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(order.id);
      toast.success("Đã hủy đơn hàng");
    } catch {
      toast.error("Không thể hủy đơn hàng");
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmMutation.mutateAsync(order.id);
      toast.success("Đã xác nhận nhận hàng");
    } catch {
      toast.error("Không thể xác nhận nhận hàng");
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-neutral-100 bg-neutral-50/60 px-6 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
            <div>
              <p className="text-xs text-neutral-400">Ngày đặt</p>
              <p className="font-medium">{fmtDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Mã đơn hàng</p>
              <p className="font-medium">#{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Tổng tiền</p>
              <p className="font-medium">{fmtVND(order.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Thanh toán</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
          </div>
          <Badge variant="outline" className={`rounded-full px-3 py-1 text-xs font-medium border ${statusClass}`}>
            {statusLabel}
          </Badge>
        </div>

        {/* Delivery info */}
        <div className="flex items-start gap-3 px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <MapPin className="h-4 w-4 text-neutral-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-400">Địa chỉ giao hàng</p>
            <p className="text-sm font-medium">{order.deliveryAddress}</p>
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div className="divide-y divide-neutral-100">
          {order.orderDetails.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-start gap-4 px-6 py-4">
              <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                <Package className="h-5 w-5 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 line-clamp-1">{item.bookTitle}</p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  x{item.quantity} · {fmtVND(item.priceAtPurchase)}
                </p>
              </div>
              <p className="text-sm font-semibold text-neutral-900">{fmtVND(item.totalPrice)}</p>
            </div>
          ))}
          {order.orderDetails.length > 3 && (
            <p className="px-6 py-2 text-xs text-neutral-400">
              +{order.orderDetails.length - 3} sản phẩm khác
            </p>
          )}
        </div>

        {/* Shop message (return request response) */}
        {returnRequest && (
          <div className="border-t border-neutral-100 px-6 py-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>Yêu cầu hoàn trả:</span>
              <Badge
                variant="outline"
                className={`rounded-full px-2 py-0.5 text-xs border ${RETURN_STATUS_COLORS[returnRequest.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
              >
                {RETURN_STATUS_LABELS[returnRequest.status] ?? returnRequest.status}
              </Badge>
            </div>
            {returnRequest.responseNote && (
              <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-0.5">Tin nhắn từ shop</p>
                  <p className="text-sm text-blue-800">{returnRequest.responseNote}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 px-6 py-3">
          <button
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            onClick={() => setDetailOpen(true)}
          >
            Xem chi tiết <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <div className="flex flex-wrap gap-2">
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    disabled={cancelMutation.isPending}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Hủy đơn
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc muốn hủy đơn hàng #{order.id}? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Không</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                      Hủy đơn
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canConfirm && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirm}
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? "Đang xử lý..." : "Đã nhận hàng"}
              </Button>
            )}

            {canReturn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReturnOpen(true)}
              >
                Yêu cầu hoàn trả
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span>Chi tiết đơn hàng</span>
              <span className="text-sm font-normal text-muted-foreground">#{order.id}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ngày đặt: <span className="font-medium text-foreground">{fmtDate(order.orderDate)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Thanh toán: <span className="font-medium text-foreground">{order.paymentMethod}</span></span>
              </div>
              <div>
                <span className="text-muted-foreground">Trạng thái: </span>
                <Badge variant="outline" className={`ml-1 border ${statusClass}`}>{statusLabel}</Badge>
              </div>
              {order.promotionCode && (
                <div>
                  <span className="text-muted-foreground">Mã giảm giá: </span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{order.promotionCode}</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Địa chỉ giao hàng</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="rounded-lg border divide-y">
              {order.orderDetails.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.bookTitle}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity} · {fmtVND(item.priceAtPurchase)}</p>
                  </div>
                  <p className="font-medium">{fmtVND(item.totalPrice)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t pt-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tổng tiền</p>
                <p className="text-xl font-semibold">{fmtVND(order.totalAmount)}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReturnRequestDialog
        order={order}
        open={returnOpen}
        onOpenChange={setReturnOpen}
      />
    </>
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrdersQuery();
  const [activeTab, setActiveTab] = React.useState<string>("Tất cả");
  const [returnRequestMap, setReturnRequestMap] = React.useState<Record<number, ReturnRequest>>({});

  React.useEffect(() => {
    returnRequestService.getMyRequests().then((reqs) => {
      const map: Record<number, ReturnRequest> = {};
      reqs.forEach((r) => { map[r.orderId] = r; });
      setReturnRequestMap(map);
    });
  }, []);

  const filtered = filterByTab(orders, activeTab);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="container-main py-10">
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng của tôi</h1>
        <p className="mt-1 text-sm text-neutral-500">Theo dõi và quản lý đơn hàng</p>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 flex-wrap">
          {TABS.map((tab) => {
            const count = filterByTab(orders, tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium transition",
                  activeTab === tab
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900",
                ].join(" ")}
              >
                {tab}
                {tab !== "Tất cả" && count > 0 && (
                  <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 text-xs">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Order list */}
        <div className="mt-8 space-y-6">
          {isLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
              <ShoppingCart className="mb-3 h-10 w-10 text-neutral-300" />
              <p className="text-sm text-neutral-500">Không có đơn hàng nào.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/books">Mua sắm ngay</Link>
              </Button>
            </div>
          ) : (
            filtered.map((order) => (
              <OrderCard key={order.id} order={order} returnRequest={returnRequestMap[order.id]} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
