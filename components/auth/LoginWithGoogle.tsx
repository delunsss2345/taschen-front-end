"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import * as React from "react";

export function LoginButtons() {
  const { data: session, status } = useSession() ; 
  const [loading, setLoading] = React.useState(false) ; 

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await signIn("google", { callbackUrl: "/" })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut({ callbackUrl: "/" })
    } finally {
      setLoading(false)
    }
  }

  const isBusy = loading || status === "loading"
  const isLoggedIn = !!session?.user

  return (
    <div className="mt-6 flex flex-col gap-3">
      {!isLoggedIn ? (
        <button
          type="button"
          onClick={handleSignIn}
          disabled={isBusy}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleMark />
          <span>{isBusy ? "Đang chuyển hướng..." : "Đăng nhập với Google"}</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {session.user?.name || "Đã đăng nhập"}
            </p>
            <p className="truncate text-xs text-slate-500">{session.user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isBusy}
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      )}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M44.5 20H24v8.5h11.8C34.7 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.5 0 6.4 1.3 8.7 3.4l6-6C34.9 4.8 29.8 2.5 24 2.5 12.1 2.5 2.5 12.1 2.5 24S12.1 45.5 24 45.5 44.5 35.9 44.5 24c0-1.3-.1-2.2-.3-4z"
        fill="currentColor"
        className="text-slate-900"
      />
      <path
        d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.5 0 6.4 1.3 8.7 3.4l6-6C34.9 4.8 29.8 2.5 24 2.5c-8.2 0-15.3 4.6-17.7 12.2z"
        fill="currentColor"
        className="text-slate-900 opacity-70"
      />
      <path
        d="M24 45.5c5.7 0 10.9-2.2 14.8-5.8l-6.8-5.6C29.9 35.7 27.2 37 24 37c-5.9 0-10.9-3.9-12.7-9.3l-7.2 5.5C6.6 40.9 14.7 45.5 24 45.5z"
        fill="currentColor"
        className="text-slate-900 opacity-70"
      />
      <path
        d="M11.3 27.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7-5.1C3.1 16.1 2.5 20 2.5 24s.6 7.9 1.8 11.3l7-5.6z"
        fill="currentColor"
        className="text-slate-900 opacity-50"
      />
    </svg>
  )
}
