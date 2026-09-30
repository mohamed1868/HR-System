import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const languages = ["en", "ar"];

let initPromise: ReturnType<typeof i18n.init> | undefined;

export const initI18n = () =>
  (initPromise ??= i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      supportedLngs: languages,
      backend: { loadPath: "/locales/{{lng}}/common.json" },
      ns: "common",
      detection: { order: ["localStorage"], lookupLocalStorage: "lang", caches: ["localStorage"] },
      react: { useSuspense: false },
    }));

export default i18n;
