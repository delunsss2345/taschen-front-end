import RegisterForm from "@/components/auth/RegisterForm";
import useTranslator from "@/hooks/use-translator";

const Register = () => {
  const { t } = useTranslator();

  const onSubmit = async () => {};

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      <RegisterForm onSubmit={onSubmit} />
    </div>
  );
};

export default Register;
