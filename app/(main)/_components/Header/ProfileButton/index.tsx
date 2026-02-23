import useTranslator from "@/hooks/use-translator";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const { t } = useTranslator();
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/profile")}
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted cursor-pointer"
      aria-label={t("header.aria.account")}
    >
      <User className="h-5 w-5" />
    </button>
  );
};

export default ProfileButton;
