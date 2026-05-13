import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import TrustBanner from './components/TrustBanner';
import HomeLifecycleStrip from './components/HomeLifecycleStrip';
import TeamSection from './components/TeamSection';
import ImmersiveScenarios from './components/ImmersiveScenarios';
import HomeTechnologySection from './components/HomeTechnologySection';
import BrandDynamics from './components/BrandDynamics';
import HomeFamilySection from './components/HomeFamilySection';
import HomeEcosystemSection from './components/HomeEcosystemSection';
import DataInsights from './components/DataInsights';
import ValueProposition from './components/ValueProposition';
import IntroSection from './components/IntroSection';
import FooterSections from './components/FooterSections';
import HomeCursor from './components/HomeCursor';
import HomeRevealObserver from './components/HomeRevealObserver';
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
import BrandStoryPage from './pages/BrandStoryPage';
import { DEFAULT_LOCALE, isSupportedLocale } from './lib/locale';

function HomePage() {
  return (
    <div className="home-atomic home-page-root">
      <div className="home-atmosphere" aria-hidden />
      <div className="home-atmosphere-particles" aria-hidden />
      <div className="grain" aria-hidden />
      <HomeCursor />
      <HomeRevealObserver />
      <div className="home-page-content">
      {/* 移动端：80/20 首屏；PC：Hero 独占 100vh（min 680），TrustBanner 紧随其后 */}
      <div className="m-0 flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden p-0 lg:h-auto lg:max-h-none lg:overflow-visible">
        <div className="min-h-0 h-[80%] shrink-0 overflow-hidden lg:h-auto lg:min-h-0 lg:w-full lg:shrink-0 lg:basis-auto lg:overflow-visible">
          <Hero />
        </div>
        <TrustBanner className="h-[20%] shrink-0 lg:hidden" />
      </div>
      <TeamSection />
      <HomeLifecycleStrip />
      <section className="bg-transparent p-0 lg:bg-transparent">
        <ImmersiveScenarios />
      </section>
      <HomeTechnologySection />
      <DataInsights />
      <IntroSection />
      <ValueProposition />
      <HomeFamilySection />
      <BrandDynamics />
      <HomeEcosystemSection />
      <FooterSections homeAtomic />
      </div>
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
    <Router>
      <main className="min-h-screen bg-white overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
          <Route path="/:lang" element={<LocaleLayout />}>
            <Route index element={<HomePage />} />
            <Route path="brand-story" element={<BrandStoryPage />} />
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
