import { Input } from "@/components/ui/input";
import useTranslator from "@/hooks/use-translator";
import { Search } from "lucide-react";

const SearchBar = () => {
  const { t } = useTranslator();

  return (
    <div className="relative hidden w-[320px] items-center md:flex">
      <Input
        className="h-10 rounded-sm pr-10 text-sm"
        placeholder={t("header.searchPlaceholder")}
      />
      <button
        type="button"
        className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-sm hover:bg-muted"
        aria-label={t("header.aria.searchButton")}
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchBar;
