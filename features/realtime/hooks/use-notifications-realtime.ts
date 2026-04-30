"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRealtimeContext } from "../RealtimeProvider";
import type { WsEvent } from "../types";

export function useNotificationsRealtime() {
  const { client, connected } = useRealtimeContext();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.currentUser?.id);

  useEffect(() => {
    if (!connected || !client || !userId) return;

    const sub = client.subscribe(
      `/topic/notifications/${userId}`,
      (message) => {
        const event: WsEvent = JSON.parse(message.body);
        if (event.type === "CREATED") {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      }
    );

    return () => sub.unsubscribe();
  }, [connected, client, userId, queryClient]);
}
