import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import ur from './ur.json';

export const RTL_LANGS = ['ur'];

function applyDirection(lng) {
  const dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ur: { translation: ur } },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur'],
    detection: {
      // ?lang=ur in shared/hreflang URLs wins, then the remembered choice.
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
      lookupLocalStorage: 'lang',
    },
    interpolation: { escapeValue: false },
  });

applyDirection(i18n.resolvedLanguage || 'en');
i18n.on('languageChanged', applyDirection);

export default i18n;
