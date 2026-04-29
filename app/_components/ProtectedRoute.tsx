"use client";

import { selectorCurrentUser, useAuthStore } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const currentUser = useAuthStore(selectorCurrentUser);
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentUser === null) {
      router.push("/login");
    }
  }, [currentUser, router]);

  return <>{children}</>;
}
