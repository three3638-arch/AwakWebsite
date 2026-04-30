import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import TrustBanner from './components/TrustBanner';
import TeamSection from './components/TeamSection';
import ImmersiveScenarios from './components/ImmersiveScenarios';
import BrandDynamics from './components/BrandDynamics';
import BrandSlogan from './components/BrandSlogan';
import DataInsights from './components/DataInsights';
import ValueProposition from './components/ValueProposition';
import IntroSection from './components/IntroSection';
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
import { DEFAULT_LOCALE, isSupportedLocale } from './lib/locale';

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <TeamSection />
      <section className="bg-[#F5F5F3]">
        <ImmersiveScenarios />
      </section>
      <IntroSection />
      <ValueProposition />
      <BrandDynamics />
      <BrandSlogan />
      <DataInsights />
      <FooterSections />
    </>
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
