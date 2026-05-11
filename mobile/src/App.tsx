import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Hero, { HERO_BACKGROUND_IMAGE_URL } from './components/Hero';
import TeamSection, { HOME_HERO_CARD_IMAGE_URLS } from './components/TeamSection';
import ImmersiveScenarios, { getImmersiveFeatureImageUrls } from './components/ImmersiveScenarios';
import BrandDynamics from './components/BrandDynamics';
import BrandSlogan from './components/BrandSlogan';
import DataInsights from './components/DataInsights';
import ValueProposition from './components/ValueProposition';
import IntroSection, { INTRO_APP_TAB_IMAGE_URLS } from './components/IntroSection';
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
import EcosystemPage from './pages/EcosystemPage';
import { DEFAULT_LOCALE, isSupportedLocale, ROUTER_BASENAME } from './lib/locale';

function useHomeAboveIntroImageWarmup() {
  useEffect(() => {
    const urls = [
      HERO_BACKGROUND_IMAGE_URL,
      ...HOME_HERO_CARD_IMAGE_URLS,
      ...getImmersiveFeatureImageUrls(),
      ...INTRO_APP_TAB_IMAGE_URLS,
    ];
    const links: HTMLLinkElement[] = [];
    for (const href of urls) {
      const img = new Image();
      img.src = href;
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
  useHomeAboveIntroImageWarmup();
  return (
    <div className="hds-home bg-base text-fg-primary font-sans antialiased selection:bg-accent selection:text-ink">
      <div className="flex min-h-[100dvh] flex-col">
        <Hero />
      </div>
      <TeamSection />
      <ImmersiveScenarios />
      <IntroSection />
      <ValueProposition />
      <DataInsights />
      <BrandDynamics />
      <BrandSlogan />
      <FooterSections />
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
          </Route>
          <Route path="*" element={<LegacyRedirect />} />
        </Routes>
      </main>
    </Router>
  );
}
