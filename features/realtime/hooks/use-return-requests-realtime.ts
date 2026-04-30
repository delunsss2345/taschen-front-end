"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";

export function useReturnRequestsRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/return-requests", () => {
      queryClient.invalidateQueries({ queryKey: ["return-requests"] });
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
