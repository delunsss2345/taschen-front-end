import RegisterForm, { type RegisterValues } from "@/components/auth/RegisterForm";
import useTranslator from "@/hooks/use-translator";
import * as React from "react";

const Register = () => {
  const { t } = useTranslator();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit = async (values: RegisterValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message =
          data && typeof data.message === "string"
            ? data.message
            : t("auth.errors.requestFailed");
        throw new Error(message);
      }

      setSuccess(t("auth.success.register"));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("auth.errors.requestFailed");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <RegisterForm isLoading={isLoading} onSubmit={onSubmit} />
    </div>
  );
};

export default Register;
