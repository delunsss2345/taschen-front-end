import ForgotPasswordForm, {
  type ForgotPasswordValues,
} from "@/components/auth/ForgotPasswordForm";
import useTranslator from "@/hooks/use-translator";
import * as React from "react";

const ForgotPassword = () => {
  const { t } = useTranslator();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      setMessage(null);
      setMessage(t("auth.success.forgot", { email: values.email }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.forgotTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.forgotSubtitle")}
        </p>
      </div>

      {message ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <ForgotPasswordForm isLoading={isLoading} onSubmit={onSubmit} />
    </div>
  );
};

export default ForgotPassword;
