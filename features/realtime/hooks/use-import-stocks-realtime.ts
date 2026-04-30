"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";

export function useImportStocksRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected || !client) return;

    const sub = client.subscribe("/topic/import-stocks", () => {
      queryClient.invalidateQueries({ queryKey: ["import-stocks"] });
    });

    return () => sub.unsubscribe();
  }, [connected, client, queryClient]);
}
