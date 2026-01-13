import { Input } from "@/components/ui/input";
import { Heart, Search, ShoppingBag, User } from "lucide-react";

const nav = [
  { label: "Books", to: "/books" },
  { label: "Limited Editions", to: "/limited-editions" },
  { label: "Gifts", to: "/gifts" },
  { label: "Stores", to: "/stores" },
  { label: "About Us", to: "/about" },
];

const Header = () => {
  return (
    <header className="w-full">
      <div className="mx-auto flex h-16 w-full max-w-[var(--container-main)] items-center gap-6 px-6">
        <nav className="flex gap-6">
          {nav.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className="text-xs tracking-widest uppercase hover:opacity-70"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-3xl font-black tracking-wide">TASCHEN</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-[320px] items-center md:flex">
            <Input
              className="h-10 rounded-sm pr-10 text-sm"
              placeholder="Search"
            />
            <button
              type="button"
              className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-sm hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="hidden whitespace-nowrap text-sm hover:opacity-70 md:inline-flex"
            aria-label="Language and country"
          ></button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-sm px-2 hover:bg-muted"
            aria-label="Cart"
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
