"use client";

import { ChevronDown, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useLogoutMutation } from "@/features/auth";
import useTranslator from "@/hooks/use-translator";

const Header = () => {
  const { t } = useTranslator();
  const countryKeys = ["germany", "france", "unitedStates", "unitedKingdom"];
  const policyLinks = [
    { href: "/refund-policy", key: "refundPolicy" },
    { href: "/shipping", key: "shipping" },
    { href: "/privacy-policy", key: "privacyPolicy" },
    { href: "/legal-notice", key: "legalNotice" },
    { href: "/cancellations", key: "cancellations" },
    { href: "/contact", key: "contactInformation" },
  ];
  const activeCountryKey = "germany";
  const { mutateAsync: logout } = useLogoutMutation()
  return (
    <header className="w-full">
      <div className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold tracking-wide">
              TASCHEN
            </Link>

            <Link href="/account/orders">
              {t("profile.header.orderHistory")}
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/account/profile">
                  {t("profile.header.menu.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/orders">
                  {t("profile.header.menu.orders")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button className="p-0!" onClick={() => logout()}>{t("profile.header.menu.signOut")}</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 text-sm text-foreground"
              >
                <span>{t(`profile.header.countries.${activeCountryKey}`)}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {countryKeys.map((countryKey) => (
                <DropdownMenuItem key={countryKey}>
                  {t(`profile.header.countries.${countryKey}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-5" />

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {policyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:underline"
              >
                {t(`profile.links.${link.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
