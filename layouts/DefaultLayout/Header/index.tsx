import { useIsMobile } from "@/hooks/use-mobile";
import useTranslator from "@/hooks/use-translator";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import Nav from "../Nav";
import ProfileButton from "./ProfileButton";
import SearchBar from "./Search";
import SettingsTranslation from "./SettingTranslation";

const Header = () => {
  const { t } = useTranslator();
  const isMobile = useIsMobile();
  return (
    <header className="w-full max-w-[var(--container-main)]">
      <div className="mx-auto flex h-16 w-full max-w-[var(--container-main)] items-center justify-between gap-6  px-2 sm:px-1">
        {isMobile ? (
          <>
            <div>
              <Menu />
            </div>
          </>
        ) : (
          <Nav />
        )}

        <div className="text-center">
          <div className="text-3xl font-black ">TASCHEN</div>
        </div>

        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex items-center gap-2">
              <SearchBar />
              <SettingsTranslation />
              <ProfileButton />
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted"
            aria-label={t("header.aria.wishlist")}
          >
            <Heart className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-sm px-2 hover:bg-muted"
            aria-label={t("header.aria.cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm">1</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
