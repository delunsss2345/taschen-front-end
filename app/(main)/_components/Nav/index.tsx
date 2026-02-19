"use client";
import useTranslator from "@/hooks/use-translator";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

interface DropdownColumn {
  items: { label: string; href: string }[];
}

interface NavItem {
  key: string;
  to: string;
  dropdown?: DropdownColumn[];
}

const nav: NavItem[] = [
  {
    key: "books",
    to: "/books",
    dropdown: [
      {
        items: [
          { label: "All Titles", href: "/books" },
          { label: "New & Upcoming", href: "/books?sort=new" },
          { label: "Bestsellers", href: "/books?sort=bestseller" },
        ],
      },
      {
        items: [
          { label: "Architecture & Design", href: "/books/architecture-design" },
          { label: "Art", href: "/books/art" },
          { label: "Classics", href: "/books/classics" },
          { label: "Comics", href: "/books/comics" },
          { label: "Esoterica", href: "/books/esoterica" },
          { label: "Fashion", href: "/books/fashion" },
          { label: "Film", href: "/books/film" },
          { label: "Graphic Design", href: "/books/graphic-design" },
        ],
      },
      {
        items: [
          { label: "Kids", href: "/books/kids" },
          { label: "Music", href: "/books/music" },
          { label: "Photography", href: "/books/photography" },
          { label: "Pop Culture", href: "/books/pop-culture" },
          { label: "Sexy Books", href: "/books/sexy-books" },
          { label: "Style, Food & Travel", href: "/books/style-food-travel" },
          { label: "Sports", href: "/books/sports" },
        ],
      },
      {
        items: [
          { label: "45th Edition Series", href: "/books/45th-edition" },
          { label: "Basic Art Series", href: "/books/basic-art" },
          { label: "Bibliotheca Universalis", href: "/books/bibliotheca-universalis" },
          { label: "Clothbound Classics", href: "/books/clothbound-classics" },
          { label: "Fantastic Price", href: "/books/fantastic-price" },
          { label: "Icons", href: "/books/icons" },
          { label: "Source Books", href: "/books/source-books" },
          { label: "XL Books", href: "/books/xl-books" },
        ],
      },
    ],
  },
  {
    key: "limitedEditions",
    to: "/limited-editions",
    dropdown: [
      {
        items: [
          { label: "All Limited Editions", href: "/limited-editions" },
          { label: "New Releases", href: "/limited-editions?sort=new" },
          { label: "Collector's Editions", href: "/limited-editions/collectors" },
        ],
      },
      {
        items: [
          { label: "Art Editions", href: "/limited-editions/art" },
          { label: "Photography", href: "/limited-editions/photography" },
          { label: "SUMO", href: "/limited-editions/sumo" },
        ],
      },
    ],
  },
  {
    key: "gifts",
    to: "/gifts",
    dropdown: [
      {
        items: [
          { label: "All Gifts", href: "/gifts" },
          { label: "Gift Cards", href: "/gifts/cards" },
          { label: "Under $25", href: "/gifts?price=under-25" },
          { label: "Under $50", href: "/gifts?price=under-50" },
        ],
      },
      {
        items: [
          { label: "For Him", href: "/gifts/for-him" },
          { label: "For Her", href: "/gifts/for-her" },
          { label: "For Kids", href: "/gifts/for-kids" },
          { label: "For Couples", href: "/gifts/for-couples" },
        ],
      },
    ],
  },
  { key: "stores", to: "/stores" },
  { key: "about", to: "/about" },
];

const Nav = () => {
  const { t } = useTranslator();
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(
    (key: string) => {
      clearHideTimeout();
      setActiveNav(key);
    },
    [clearHideTimeout]
  );

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveNav(null);
    }, 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    clearHideTimeout();
  }, [clearHideTimeout]);

  const handleDropdownLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveNav(null);
    }, 150);
  }, []);

  const activeItem = nav.find((item) => item.key === activeNav);
  const showDropdown = activeItem?.dropdown && activeItem.dropdown.length > 0;

  return (
    <>
      <nav className="flex gap-6">
        {nav.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`nav-link text-xs tracking-widest uppercase transition-opacity duration-200 ${activeNav === item.key ? "opacity-100" : "hover:opacity-70"
              }`}
            onMouseEnter={() => handleMouseEnter(item.key)}
            onMouseLeave={handleMouseLeave}
          >
            {t(`nav.${item.key}`)}
          </Link>
        ))}
      </nav>

      {/* Dropdown mega menu */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 z-50 w-full border-t border-zinc-200 bg-white shadow-sm"
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="mx-auto grid max-w-[var(--container-main)] grid-cols-4 gap-x-12 px-6 py-8">
            {activeItem.dropdown!.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-3">
                {col.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-700 transition-colors duration-150 hover:text-zinc-950"
                    onClick={() => setActiveNav(null)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;