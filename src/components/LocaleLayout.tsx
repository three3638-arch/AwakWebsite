import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import i18n from '../i18n';
import Navbar from './Navbar';
import { DEFAULT_LOCALE, isSupportedLocale } from '../lib/locale';

export default function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  useEffect(() => {
    if (lang && isSupportedLocale(lang)) {
      void i18n.changeLanguage(lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    }
  }, [lang]);

  if (!lang || !isSupportedLocale(lang)) {
    const parts = location.pathname.split('/').filter(Boolean);
    const rest = parts.slice(1).join('/');
    const target = rest ? `/${DEFAULT_LOCALE}/${rest}` : `/${DEFAULT_LOCALE}`;
    return <Navigate to={`${target}${location.search}`} replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
