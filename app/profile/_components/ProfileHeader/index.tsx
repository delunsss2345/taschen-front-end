"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useLogoutMutation } from "@/features/auth";
import useTranslator from "@/hooks/use-translator";
import { useEffect, useState } from "react";

const CURRENT_USER_KEY = "currentUser";

function getStoredUser(): { firstName: string; lastName: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function ProfileHeader() {
  const { t } = useTranslator();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogoutMutation();
  const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // error handled by mutation
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-lg font-semibold tracking-wide"
          >
            <BookOpen className="h-5 w-5" />
            <span>TASCHEN</span>
          </Link>

          <Link
            href="/profile"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("profile.header.myAccount")}
          </Link>
        </div>

        {currentUser && (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {isLoggingOut
                ? t("profile.header.signingOut")
                : t("profile.header.signOut")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
