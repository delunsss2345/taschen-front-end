"use client";

import {
  useDisposalRealtime,
  useImportStocksRealtime,
  useNotificationsRealtime,
  useOrdersRealtime,
  usePurchaseOrdersRealtime,
  useReturnRequestsRealtime,
  useReturnWarehouseRealtime,
} from "@/features/realtime";

export function AdminRealtimeSubscriptions() {
  useOrdersRealtime();
  useReturnRequestsRealtime();
  usePurchaseOrdersRealtime();
  useDisposalRealtime();
  useImportStocksRealtime();
  useReturnWarehouseRealtime();
  useNotificationsRealtime();
  return null;
}
