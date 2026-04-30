"use client";

import {
  useNotificationsRealtime,
  useOrdersRealtime,
  useReturnRequestsRealtime,
  useStockRequestsRealtime,
} from "@/features/realtime";

export function SellerRealtimeSubscriptions() {
  useOrdersRealtime();
  useReturnRequestsRealtime();
  useStockRequestsRealtime();
  useNotificationsRealtime();
  return null;
}
