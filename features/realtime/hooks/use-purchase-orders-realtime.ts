"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";

export function usePurchaseOrdersRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/purchase-orders", () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
