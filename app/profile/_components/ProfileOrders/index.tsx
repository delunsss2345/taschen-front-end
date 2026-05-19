"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  MessageSquare,
  Package,
  ShoppingCart,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useOrdersQuery,
  useOrdersStore,
  useCancelOrderMutation,
  useConfirmReceivedMutation,
} from "@/features/profile";
import { returnRequestService } from "@/services/return-request.service";
import type { ReturnRequest } from "@/services/return-request.service";
import type { Order, OrderStatus } from "@/types/profile.type";
import useTranslator from "@/hooks/use-translator";

// ============================================================
// Helpers
// ============================================================
const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  UNPAID: "unpaid",
  PENDING: "pending",
  PROCESSING: "processing",
  DELIVERING: "delivering",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  RETURNED: "returned",
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  UNPAID: "#FFA500",
  PENDING: "#9B59B6",
  PROCESSING: "#3498DB",
  DELIVERING: "#1ABC9C",
  COMPLETED: "#27AE60",
  CANCELLED: "#E74C3C",
  RETURNED: "#95A5A6",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VNPAY: "VNPay",
  COD: "COD",
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ============================================================
// Order Detail Modal
// ============================================================
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

function OrderDetailModal({
  order,
  open,
  onOpenChange,
  returnRequest,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnRequest?: ReturnRequest;
}) {
  const { t } = useTranslator();

  if (!order) return null;

  const statusLabelKey = `profile.orders.statuses.${ORDER_STATUS_LABELS[order.status]}`;
  const statusColor = ORDER_STATUS_COLORS[order.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            <span>{t("profile.orders.orderDetails")}</span>
            <span className="text-sm font-normal text-muted-foreground">
              #{order.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t("profile.orders.orderDate")}:{" "}
                <span className="font-medium text-foreground">
                  {formatDate(order.orderDate)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t("profile.orders.paymentMethod")}:{" "}
                <span className="font-medium text-foreground">
                  {t(`profile.orders.paymentMethods.${order.paymentMethod}`)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {t("profile.orders.status")}:{" "}
                <Badge
                  style={{
                    backgroundColor: statusColor,
                    color: "#fff",
                  }}
                  className="ml-1"
                >
                  {t(statusLabelKey)}
                </Badge>
              </span>
            </div>
            {order.promotionCode && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {t("profile.orders.promotion")}:{" "}
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    {order.promotionCode}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">{t("profile.orders.deliveryAddress")}</p>
              <p className="font-medium">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="mb-3 text-sm font-medium">
              {t("profile.orders.items")} ({order.orderDetails.length})
            </h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("profile.orders.item")}</TableHead>
                    <TableHead className="text-right">
                      {t("profile.orders.unitPrice")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("profile.orders.quantity")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("profile.orders.total")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderDetails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.bookTitle}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatPrice(item.priceAtPurchase)}
                      </TableCell>
                      <TableCell className="text-right">x{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end border-t pt-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {t("profile.orders.totalAmount")}
              </p>
              <p className="text-xl font-semibold">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Return request info */}
          {returnRequest && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Return Request Dialog
// ============================================================
function ReturnRequestDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      toast.error("Gửi yêu cầu hoàn trả thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yêu cầu hoàn trả đơn #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="return-reason">Lý do hoàn trả</Label>
            <Textarea
              id="return-reason"
              placeholder="Mô tả lý do bạn muốn hoàn trả..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button onClick={handleSubmit} disabled={submitting || !reason.trim()}>
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Order Row
// ============================================================
function OrderRow({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
}) {
  const { t } = useTranslator();
  const cancelMutation = useCancelOrderMutation();
  const confirmMutation = useConfirmReceivedMutation();
  const [returnOpen, setReturnOpen] = useState(false);
  const statusColor = ORDER_STATUS_COLORS[order.status];
  const statusLabelKey = `profile.orders.statuses.${ORDER_STATUS_LABELS[order.status]}`;

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
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => onViewDetails(order)}>
        <TableCell className="font-medium">
          <div>#{order.id}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
            <Calendar className="h-3 w-3" />
            {formatDate(order.orderDate)}
          </div>
        </TableCell>
        <TableCell className="hidden text-muted-foreground sm:table-cell">
          {formatDate(order.orderDate)}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {order.orderDetails.length > 1 ? (
            <div>
              <p className="truncate text-sm">
                {order.orderDetails[0]?.bookTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                +{order.orderDetails.length - 1} {t("profile.orders.moreItems")}
              </p>
            </div>
          ) : (
            <p className="text-sm">{order.orderDetails[0]?.bookTitle}</p>
          )}
        </TableCell>
        <TableCell className="text-right font-medium">
          {formatPrice(order.totalAmount)}
        </TableCell>
        <TableCell>
          <Badge
            style={{ backgroundColor: statusColor, color: "#fff" }}
            className="hidden sm:flex w-fit ml-auto"
          >
            {t(statusLabelKey)}
          </Badge>
          <Badge
            style={{ backgroundColor: statusColor, color: "#fff" }}
            className="sm:hidden"
          >
            {t(statusLabelKey)}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex flex-wrap items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-red-600 hover:bg-red-50"
                    disabled={cancelMutation.isPending}
                  >
                    <XCircle className="h-3 w-3" />
                    Hủy
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận hủy đơn hàng?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc muốn hủy đơn hàng #{order.id}?
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
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-green-600 hover:bg-green-50"
                onClick={handleConfirm}
                disabled={confirmMutation.isPending}
              >
                Đã nhận
              </Button>
            )}
            {canReturn && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setReturnOpen(true)}
              >
                Hoàn trả
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1"
              onClick={() => onViewDetails(order)}
            >
              {t("profile.orders.viewDetails")}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <ReturnRequestDialog order={order} open={returnOpen} onOpenChange={setReturnOpen} />
    </>
  );
}

// ============================================================
// Main Component
// ============================================================
export function ProfileOrders() {
  const { t } = useTranslator();
  const { data: orders, isLoading } = useOrdersQuery();
  const { orders: storeOrders, loading } = useOrdersStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [returnRequestMap, setReturnRequestMap] = useState<Record<number, ReturnRequest>>({});

  const displayOrders = isLoading ? [] : storeOrders.length ? storeOrders : orders ?? [];

  useEffect(() => {
    returnRequestService.getMyRequests().then((reqs) => {
      const map: Record<number, ReturnRequest> = {};
      reqs.forEach((r) => { map[r.orderId] = r; });
      setReturnRequestMap(map);
    });
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  if (isLoading || loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">{t("profile.orders.title")}</h1>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">{t("profile.orders.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("profile.orders.subtitle")}
      </p>

      {displayOrders.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed py-12 text-center">
          <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("profile.orders.noOrders")}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => (window.location.href = "/")}
          >
            {t("profile.orders.continueShopping")}
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">{t("profile.orders.orderId")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("profile.orders.date")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("profile.orders.items")}</TableHead>
                  <TableHead className="text-right">{t("profile.orders.total")}</TableHead>
                  <TableHead>{t("profile.orders.status")}</TableHead>
                  <TableHead className="text-right">{t("profile.orders.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        returnRequest={selectedOrder ? returnRequestMap[selectedOrder.id] : undefined}
      />
    </div>
  );
}
