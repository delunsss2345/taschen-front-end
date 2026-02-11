"use client";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import useTranslator from "@/hooks/use-translator";

const ResetPassword = () => {
  const { t } = useTranslator();

  const onSubmit = async () => {};

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.verifyTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.verifySubtitle")}
        </p>
      </div>

      <ResetPasswordForm onSubmit={onSubmit} />
    </div>
  );
};

export default ResetPassword;
