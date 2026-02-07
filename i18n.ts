import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import vnTranslation from "./public/locales/vn/translation.json";
import enTranslation from "./public/locales/en/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vn",
    supportedLngs: ["vn", "en"],
    nonExplicitSupportedLngs: true,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      vn: {
        translation: vnTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "appLanguage",
    },
  });

export default i18n;
