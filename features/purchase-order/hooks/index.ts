"use client";

import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { purchaseOrderService } from "@/services/purchase-order.service";
import type { PurchaseOrder } from "@/types/response/purchase-order.response";

export const purchaseOrderQueryKeys = {
  detail: (orderId: number | string) =>
    ["purchase-orders", "detail", orderId] as const,
};

export const usePurchaseOrderDetailQuery = (
  orderId: number | string | null | undefined,
  options?: Omit<
    UseQueryOptions<PurchaseOrder | null, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: purchaseOrderQueryKeys.detail(orderId ?? "unknown"),
    queryFn: () => purchaseOrderService.getPurchaseOrderById(orderId as number | string),
    enabled: Boolean(orderId),
    ...options,
  });
};

export const useApprovePurchaseOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, userId }: { orderId: number; userId: number }) =>
      purchaseOrderService.approvePurchaseOrder(orderId, userId),
  });
};

export const useRejectPurchaseOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      userId,
      reason,
    }: {
      orderId: number;
      userId: number;
      reason: string;
    }) => purchaseOrderService.rejectPurchaseOrder(orderId, userId, reason),
  });
};

export const useCancelPurchaseOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      userId,
    }: {
      orderId: number;
      reason: string;
      userId: number;
    }) => purchaseOrderService.cancelPurchaseOrder(orderId, reason, userId),
  });
};

export const usePayPurchaseOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, userId }: { orderId: number; userId: number }) =>
      purchaseOrderService.payPurchaseOrder(orderId, userId),
  });
};
