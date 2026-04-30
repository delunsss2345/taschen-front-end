"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";

export function useDisposalRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/disposal-requests", () => {
      queryClient.invalidateQueries({ queryKey: ["disposal-requests"] });
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
