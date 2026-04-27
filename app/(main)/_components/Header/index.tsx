"use client";
import CartSheet from "@/app/(main)/_components/Header/CartSheet";
import ProfileButton from "@/app/(main)/_components/Header/ProfileButton";
import SearchBar from "@/app/(main)/_components/Header/Search";
import SettingsTranslation from "@/app/(main)/_components/Header/SettingTranslation";
import Nav from "@/app/(main)/_components/Nav";
import useTranslator from "@/hooks/use-translator";
import { Bell } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { t } = useTranslator();


  return (
    <header className="relative z-50 w-full bg-white">
      <div className="container-main flex h-16 w-full items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="text-3xl font-black">TASCHEN</div>
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>

        <div className="hidden flex-1 md:block md:max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted"
            aria-label={t("header.aria.notifications")}
          >
            <Bell className="h-5 w-5" />
          </Link>

          <CartSheet />
          <ProfileButton />
          <SettingsTranslation />
        </div>
      </div>
    </header>
  );
};

export default Header;