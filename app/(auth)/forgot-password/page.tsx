"use client";

import ForgotPasswordForm from "@/app/(auth)/_components/ForgotPasswordForm";
import useTranslator from "@/hooks/use-translator";

const ForgotPassword = () => {
  const { t } = useTranslator();

  const onSubmit = async () => { };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.forgotTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.forgotSubtitle")}
        </p>
      </div>

      <ForgotPasswordForm onSubmit={onSubmit} />
    </div>
  );
};

export default ForgotPassword;
