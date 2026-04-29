"use client";

import useTranslator from "@/hooks/use-translator";
import { User } from "lucide-react";

const ProfileButton = () => {
  const { t } = useTranslator();

  return (
    <a
      href="/profile"
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm hover:bg-muted cursor-pointer"
      aria-label={t("header.aria.account")}
    >
      <User className="h-5 w-5" />
    </a>
  );
};

export default ProfileButton;
