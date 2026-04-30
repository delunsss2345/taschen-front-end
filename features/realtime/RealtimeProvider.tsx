"use client";

import { selectorIsAuthenticated } from "@/features/auth/selectors";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { Client } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createStompClient } from "./client";

interface RealtimeContextValue {
  client: Client | null;
  connected: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  client: null,
  connected: false,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(selectorIsAuthenticated);
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      clientRef.current?.deactivate();
      clientRef.current = null;
      setConnected(false);
      return;
    }

    const client = createStompClient();

    client.onConnect = () => setConnected(true);
    client.onDisconnect = () => setConnected(false);
    client.onStompError = (frame) => {
      console.error("[Realtime] STOMP error:", frame.headers["message"]);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated]);

  return (
    <RealtimeContext.Provider value={{ client: clientRef.current, connected }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtimeContext = () => useContext(RealtimeContext);
