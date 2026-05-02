"use client";

import { useAuthStore } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) {
      toast.error("Vui lòng đăng nhập để truy cập trang này");
      router.push("/");
      return;
    }

    const hasAccess = allowedRoles.some((role) =>
      currentUser.roles.includes(role),
    );

    if (!hasAccess) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
    // allowedRoles is static per layout — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, router]);

  return <>{children}</>;
}
