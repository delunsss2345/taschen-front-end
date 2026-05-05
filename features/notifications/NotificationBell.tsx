"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, X } from "lucide-react";
import { useNotifications } from "./useNotifications";

function formatRelativeTime(dateString: string): string {
  const dateMs = new Date(dateString).getTime();
  const nowMs = Date.now();
  const diffMs = nowMs - dateMs;
  const diffTz = new Date().getTimezoneOffset() * 60000;
  const diff = diffMs + diffTz;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hôm qua";
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateString).toLocaleDateString("vi-VN");
}

export function NotificationBell() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteOne, deleteAll } =
    useNotifications();

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const hasItems = notifications.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-[3px] rounded-full bg-red-500 text-white text-[10px] font-bold leading-4 text-center">
              {badgeLabel}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 font-sans shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Thông báo</span>
          {hasItems && (
            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Đọc tất cả
              </button>
              <button
                onClick={deleteAll}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">Đang tải...</div>
          ) : !hasItems ? (
            <div className="py-10 text-center text-sm text-gray-400">Không có thông báo nào</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`relative border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 ${
                  n.isRead ? "opacity-60" : "bg-blue-50/40"
                }`}
              >
                <button
                  className="w-full text-left px-4 py-3 pr-8"
                  onClick={() => { if (!n.isRead) markAsRead(n.id) }}
                >
                  <div className="flex items-start gap-2">
                    <p
                      className={`text-sm leading-snug flex-1 ${
                        n.isRead ? "font-normal text-gray-600" : "font-semibold text-gray-900"
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">{n.content}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{formatRelativeTime(n.createdAt)}</p>
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteOne(n.id) }}
                  className="absolute top-2.5 right-2.5 h-5 w-5 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Xóa thông báo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
