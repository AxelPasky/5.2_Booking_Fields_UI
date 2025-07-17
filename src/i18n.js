import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Carica le traduzioni da /public/locales
  .use(LanguageDetector) // Rileva la lingua dell'utente
  .use(initReactI18next) // Inizializza react-i18next
  .init({
    supportedLngs: ['en', 'it', 'es'],
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'cookie', 'localStorage', 'htmlTag'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;