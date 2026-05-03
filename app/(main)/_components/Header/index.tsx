"use client";
import CartSheet from "@/app/(main)/_components/Header/CartSheet";
import ProfileButton from "@/app/(main)/_components/Header/ProfileButton";
import SearchBar from "@/app/(main)/_components/Header/Search";
import Nav from "@/app/(main)/_components/Nav";
import { NotificationBell } from "@/features/notifications/NotificationBell";

const Header = () => {

  return (
    <header className="relative z-50 w-full bg-white">
      <div className="container-main flex h-16 w-full items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="font-serif text-3xl font-black">TASCHEN</div>
          <div className="hidden md:block">
            <Nav />
          </div>
        </div>

        <div className="hidden flex-1 md:block md:max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <CartSheet />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;