import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import i18n from '../../i18n';
import Navbar from '../../components/Navbar';
import FooterSections from '../../components/FooterSections';
import LanguageMenu from '../../components/LanguageMenu';
import BetaDownloadView from '@shared/features/beta-download/BetaDownloadView';
import { DEFAULT_LOCALE, isEmbedMode, isSupportedLocale } from '@shared/lib/locale';

/** Top-level /:lang/beta-download route (avoids nested-route + LegacyRedirect edge cases). */
export default function BetaDownloadRoute() {
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
    return <Navigate to={`/${DEFAULT_LOCALE}/beta-download${location.search}`} replace />;
  }

  return (
    <>
      {!embed && <Navbar />}
      <BetaDownloadView Footer={FooterSections} LanguageMenu={LanguageMenu} />
    </>
  );
}
