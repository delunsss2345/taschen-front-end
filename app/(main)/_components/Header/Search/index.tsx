"use client";

import { Input } from "@/components/ui/input";
import useTranslator from "@/hooks/use-translator";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const { t } = useTranslator();
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/books?q=${encodeURIComponent(q)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative hidden w-full items-center md:flex"
    >
      <Input
        className="h-10 rounded-sm pr-10 text-sm"
        placeholder={t("header.searchPlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-sm hover:bg-muted"
        aria-label={t("header.aria.searchButton")}
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
};

export default SearchBar;
