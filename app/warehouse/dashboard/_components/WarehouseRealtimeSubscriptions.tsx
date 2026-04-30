"use client";

import {
  useImportStocksRealtime,
  useNotificationsRealtime,
  usePurchaseOrdersRealtime,
  useReturnWarehouseRealtime,
  useStockRequestsRealtime,
} from "@/features/realtime";

export function WarehouseRealtimeSubscriptions() {
  useStockRequestsRealtime();
  usePurchaseOrdersRealtime();
  useImportStocksRealtime();
  useReturnWarehouseRealtime();
  useNotificationsRealtime();
  return null;
}
