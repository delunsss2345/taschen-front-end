import useTranslator from "@/hooks/use-translator";
import { User } from "lucide-react";

const ProfileButton = () => {
  const { t } = useTranslator();

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted"
      aria-label={t("header.aria.account")}
    >
      <User className="h-5 w-5" />
    </button>
  );
};

export default ProfileButton;
