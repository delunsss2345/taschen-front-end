"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  ShoppingCart,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/features/profile";
import type { Order, OrderDetail, OrderStatus } from "@/types/profile.type";
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
function OrderDetailModal({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const [expanded, setExpanded] = useState(false);
  const statusColor = ORDER_STATUS_COLORS[order.status];
  const statusLabelKey = `profile.orders.statuses.${ORDER_STATUS_LABELS[order.status]}`;

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
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(order);
            }}
          >
            {t("profile.orders.viewDetails")}
          </Button>
        </TableCell>
      </TableRow>
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

  const displayOrders = isLoading ? [] : storeOrders.length ? storeOrders : orders ?? [];

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
      />
    </div>
  );
}
