"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";
import type { WsEvent } from "../types";

export function useOrdersRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/orders", (message) => {
      const event: WsEvent = JSON.parse(message.body);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (event.type === "UPDATED") {
        queryClient.invalidateQueries({ queryKey: ["orders", event.id] });
      }
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
