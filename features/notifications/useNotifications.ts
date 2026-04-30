"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRealtimeContext } from "@/features/realtime/RealtimeProvider";
import type { WsEvent } from "@/features/realtime/types";
import type { NotificationResponse } from "@/types/response/notification.response";
import { useCallback, useEffect, useRef, useState } from "react";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

type ApiEnvelope<T> = { data: T };

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { client, connected } = useRealtimeContext();
  const currentUser = useAuthStore((state) => state.currentUser);
  const userId = currentUser?.id;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await apiFetch<ApiEnvelope<NotificationResponse[]>>("/api/notifications");
      setNotifications(res.data ?? []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await apiFetch<ApiEnvelope<{ unreadCount: number }>>("/api/notifications/unread-count");
      setUnreadCount(res.data?.unreadCount ?? 0);
    } catch {
      // silent
    }
  }, [userId]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  }, []);

  const deleteOne = useCallback(async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
    } catch {
      // silent
    }
  }, []);

  const deleteAll = useCallback(async () => {
    try {
      await apiFetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
      setUnreadCount(0);
    } catch {
      // silent
    }
  }, []);

  // Initial fetch only when logged in
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    fetchUnreadCount();
  }, [userId, fetchNotifications, fetchUnreadCount]);

  // WebSocket subscription
  const subRef = useRef<{ unsubscribe: () => void } | null>(null);
  useEffect(() => {
    if (!connected || !client || !userId) return;

    subRef.current = client.subscribe(
      `/topic/notifications/${userId}`,
      (_message) => {
        const event: WsEvent = JSON.parse(_message.body);
        if (event) {
          fetchNotifications();
          fetchUnreadCount();
        }
      }
    );

    return () => {
      subRef.current?.unsubscribe();
      subRef.current = null;
    };
  }, [connected, client, userId, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteOne,
    deleteAll,
  };
}
