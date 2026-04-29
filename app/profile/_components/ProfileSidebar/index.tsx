"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Lock,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useTranslator from "@/hooks/use-translator";

const navItems = [
  {
    href: "/profile",
    labelKey: "profile.sidebar.info",
    icon: User,
  },
  {
    href: "/profile/password",
    labelKey: "profile.sidebar.password",
    icon: Lock,
  },
  {
    href: "/profile/addresses",
    labelKey: "profile.sidebar.addresses",
    icon: MapPin,
  },
  {
    href: "/profile/orders",
    labelKey: "profile.sidebar.orders",
    icon: Package,
  },
] as const;

export function ProfileSidebar() {
  const { t } = useTranslator();
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0">
      <nav className="flex flex-col gap-1 rounded-lg border bg-card p-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/profile"
              ? pathname === "/profile" || pathname === "/profile/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
