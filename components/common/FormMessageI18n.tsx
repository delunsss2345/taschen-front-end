import { useFormField } from "@/components/ui/form";
import { useTranslation } from "react-i18next";

export function FormMessageI18n() {
  const { error } = useFormField();
  const { t } = useTranslation();

  if (!error) return null;

  return (
    <p className="text-sm font-medium text-destructive">{t(error.message!)}</p>
  );
}
