"use client";

import { selectorCurrentUser, useAuthStore } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const currentUser = useAuthStore(selectorCurrentUser);
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  return <>{children}</>;
};

export default AuthGuard;
