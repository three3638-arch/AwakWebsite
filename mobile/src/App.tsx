import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Hero, { HERO_BACKGROUND_IMAGE_URL } from './components/Hero';
import TeamSection, {
  HOME_HERO_CARD_IMAGE_URLS,
  HOME_TEAM_PRODUCT_CARD_IMAGE_URLS,
} from './components/TeamSection';
import ImmersiveScenarios, { getImmersiveFeatureImageUrls } from './components/ImmersiveScenarios';
import BrandDynamics, { BRAND_DYNAMICS_IMAGE_URLS } from './components/BrandDynamics';
import BrandSlogan from './components/BrandSlogan';
import DataInsights from './components/DataInsights';
import ValueProposition from './components/ValueProposition';
import IntroSection, { INTRO_APP_TAB_IMAGE_URLS } from './components/IntroSection';
import { DATA_INSIGHTS_IMAGE_URLS } from './components/DataInsights';
import HomeLifecycleStrip from './components/HomeLifecycleStrip';
import FooterSections from './components/FooterSections';
import LocaleLayout from './components/LocaleLayout';
import SmartRingPage from './pages/SmartRingPage';
import SmartBraceletPage from './pages/SmartBraceletPage';
import SmartGlassesPage from './pages/SmartGlassesPage';
import SmartWatchPage from './pages/SmartWatchPage';
import BrandNewsPage from './pages/BrandNewsPage';
import NewsPage from './pages/NewsPage';
import StorePage from './pages/StorePage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import LegalIndexPage from './pages/legal/LegalIndexPage';
import LegalDocumentPage from './pages/legal/LegalDocumentPage';
import EcosystemPage from './pages/EcosystemPage';
import { DEFAULT_LOCALE, isSupportedLocale, ROUTER_BASENAME } from './lib/locale';

function uniqStrings(urls: string[]) {
  return [...new Set(urls.filter(Boolean))];
}

/** 首页所有远程配图：`<link rel="preload" as="image">`，避免滚动到模块才触发加载 */
function useHomePageImagePreload() {
  useEffect(() => {
    const urls = uniqStrings([
      HERO_BACKGROUND_IMAGE_URL,
      ...HOME_HERO_CARD_IMAGE_URLS,
      ...HOME_TEAM_PRODUCT_CARD_IMAGE_URLS,
      ...getImmersiveFeatureImageUrls(),
      ...INTRO_APP_TAB_IMAGE_URLS,
      ...DATA_INSIGHTS_IMAGE_URLS,
      ...BRAND_DYNAMICS_IMAGE_URLS,
    ]);
    const links: HTMLLinkElement[] = [];
    for (const href of urls) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    }
    return () => {
      for (const el of links) {
        el.remove();
      }
    };
  }, []);
}

function HomePage() {
  useHomePageImagePreload();
  return (
    <div className="home-atomic hds-home font-sans antialiased selection:bg-[#DDF700] selection:text-black">
      <div className="flex min-h-[100dvh] flex-col">
        <Hero />
      </div>
      <HomeLifecycleStrip />
      <TeamSection />
      <ImmersiveScenarios />
      <IntroSection />
      <ValueProposition />
      <DataInsights />
      <BrandDynamics />
      <BrandSlogan />
      <FooterSections homeAtomic />
    </div>
  );
}

function LegacyRedirect() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const search = location.search;
  if (parts.length === 0) return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  if (!isSupportedLocale(parts[0])) {
    return <Navigate to={`/${DEFAULT_LOCALE}${location.pathname}${search}`} replace />;
  }
  return <Navigate to={`/${parts[0]}`} replace />;
}

export default function App() {
  return (
    <Router basename={ROUTER_BASENAME}>
      <main className="min-h-screen bg-white overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
          <Route path="/:lang" element={<LocaleLayout />}>
            <Route index element={<HomePage />} />
            <Route path="ecosystem" element={<EcosystemPage />} />
            <Route path="products/ring" element={<SmartRingPage />} />
            <Route path="products/band" element={<SmartBraceletPage />} />
            <Route path="products/glasses" element={<SmartGlassesPage />} />
            <Route path="products/watch" element={<SmartWatchPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsPage />} />
            <Route path="brand-news" element={<BrandNewsPage />} />
            <Route path="store" element={<StorePage />} />
            <Route path="store/:category" element={<StorePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="legal" element={<LegalIndexPage />} />
            <Route path="legal/:slug" element={<LegalDocumentPage />} />
          </Route>
          <Route path="*" element={<LegacyRedirect />} />
        </Routes>
      </main>
    </Router>
  );
}
