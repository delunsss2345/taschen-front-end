"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth";
import useTranslator from "@/hooks/use-translator";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const { t } = useTranslator();
  const currentUser = useAuthStore((s) => s.currentUser);
  const clearSession = useAuthStore((s) => s.clearSession);
  const router = useRouter();

  const roles = currentUser?.roles ?? [];
  const isAdmin = roles.includes("ADMIN");
  const isSeller = roles.includes("SELLER");
  const isWarehouse = roles.includes("WAREHOUSE");

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted cursor-pointer"
          aria-label={t("header.aria.account")}
        >
          <User className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {currentUser ? (
          <>
            <div className="px-3 py-2">
              <p className="truncate text-sm font-medium">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Trang cá nhân
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/orders" className="cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Đơn hàng của tôi
              </Link>
            </DropdownMenuItem>

            {(isAdmin || isSeller || isWarehouse) && (
              <>
                <DropdownMenuSeparator />

                {(isAdmin || isSeller) && (
                  <DropdownMenuItem asChild>
                    <Link href="/seller/dashboard" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Seller Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                {(isAdmin || isWarehouse) && (
                  <DropdownMenuItem asChild>
                    <Link href="/warehouse/dashboard" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Warehouse Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" className="cursor-pointer">
              <LogIn className="mr-2 h-4 w-4" />
              Đăng nhập
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
