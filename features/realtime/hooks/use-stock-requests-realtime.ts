"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";

export function useStockRequestsRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/stock-requests", () => {
      queryClient.invalidateQueries({ queryKey: ["stock-requests"] });
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
