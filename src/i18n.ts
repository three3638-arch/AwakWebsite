import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCommon from './locales/zh/common.json';
import enCommon from './locales/en/common.json';

void i18n.use(initReactI18next).init({
  lng: 'zh',
  fallbackLng: 'zh',
  supportedLngs: ['zh', 'en'],
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    zh: { common: zhCommon },
    en: { common: enCommon },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
