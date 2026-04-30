"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";

export function useReturnWarehouseRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/return-warehouse-requests", () => {
      queryClient.invalidateQueries({ queryKey: ["return-warehouse-requests"] });
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
