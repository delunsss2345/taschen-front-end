import useTranslator from "@/hooks/use-translator";

const SettingsTranslation = () => {
  const { t, i18n } = useTranslator();
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;
  const isVn = activeLanguage?.startsWith("vn");
  const nextLanguage = isVn ? "en" : "vn";

  return (
    <button
      type="button"
      className="hidden whitespace-nowrap text-sm hover:opacity-70 md:inline-flex cursor-pointer"
      aria-label={t("header.aria.language")}
      onClick={() => i18n.changeLanguage(nextLanguage)}
    >
      {t("header.languageToggle")}
    </button>
  );
};

export default SettingsTranslation;
