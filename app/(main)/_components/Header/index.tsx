"use client";
import CartSheet from "@/app/(main)/_components/Header/CartSheet";
import ProfileButton from "@/app/(main)/_components/Header/ProfileButton";
import SearchBar from "@/app/(main)/_components/Header/Search";
import SettingsTranslation from "@/app/(main)/_components/Header/SettingTranslation";
import Nav from "@/app/(main)/_components/Nav";
import useTranslator from "@/hooks/use-translator";
import { Heart, Menu } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { t } = useTranslator();


  return (
    <header className="relative z-50 w-full bg-white px-4">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-6 px-2 sm:px-1">
        <div className="block md:hidden">
          <Menu />
        </div>
        <div className="hidden md:block">
          <Nav />
        </div>

        <div className="text-center">
          <div className="text-3xl font-black">TASCHEN</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <SearchBar />
            <SettingsTranslation />
            <ProfileButton />
          </div>

          <Link
            href="/wishlist"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted"
            aria-label={t("header.aria.wishlist")}
          >
            <Heart className="h-5 w-5" />
          </Link>

          <CartSheet />
        </div>
      </div>
    </header>
  );
};

export default Header;