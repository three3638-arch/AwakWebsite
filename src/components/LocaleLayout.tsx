import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import i18n from '../i18n';
import Navbar from './Navbar';
import { DEFAULT_LOCALE, isEmbedMode, isSupportedLocale } from '@shared/lib/locale';

export default function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const embed = isEmbedMode(location.search);

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
      {!embed && <Navbar />}
      <Outlet />
    </>
  );
}
