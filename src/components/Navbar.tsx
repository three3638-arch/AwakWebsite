import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, User, Search, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import { stripLocalePrefix } from '../lib/locale';
import LanguageMenu from './LanguageMenu';

const HW_ITEMS = [
  { id: 'ring' as const, path: '/products/ring' },
  { id: 'band' as const, path: '/products/band' },
  { id: 'watch' as const, path: '/products/watch' },
  { id: 'glasses' as const, path: '/products/glasses' },
];

type NavRow =
  | { kind: 'dropdown'; key: 'hardware' }
  | {
      kind: 'link';
      key: 'brandStory' | 'ecosystem' | 'news' | 'contact';
      path: '/brand-story' | '/ecosystem' | '/news' | '/contact';
    };

const NAV_ROWS: NavRow[] = [
  { kind: 'link', key: 'brandStory', path: '/brand-story' },
  { kind: 'dropdown', key: 'hardware' },
  { kind: 'link', key: 'ecosystem', path: '/ecosystem' },
  { kind: 'link', key: 'news', path: '/news' },
  { kind: 'link', key: 'contact', path: '/contact' },
];

export default function Navbar() {
  const { t } = useTranslation('common');
  const [isHardwareOpen, setIsHardwareOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { withPath } = useLocalePath();
  const basePath = stripLocalePrefix(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isStoreOrProduct = basePath.startsWith('/products/') || basePath === '/store';
  const isCheckout = basePath === '/checkout';
  const isAuth = basePath === '/auth';
  const isLightPage = isStoreOrProduct || isCheckout || isAuth;
  const isHomeIndex = basePath === '/';

  const navPaddingDefault = 'px-6 md:px-[170px]';
  const navSurfaceDefault = scrolled
    ? isLightPage
      ? 'h-[72px] bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] border-b border-black/5'
      : 'h-[72px] bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-[#1A1A1A]'
    : 'h-[90px] bg-transparent';
  const linkRadius = isHomeIndex ? 'rounded-[12px]' : 'rounded-full';

  if (isAuth) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[9997] flex items-center justify-between px-6 md:px-[170px] h-[72px] bg-transparent">
        <Link to={withPath('/')} className="flex items-center">
          <span className="font-extrabold text-2xl tracking-[1px] text-[#080808]">AWAK</span>
        </Link>
        <LanguageMenu tone="onLight" />
      </nav>
    );
  }

  const NavListTag = isHomeIndex ? 'ul' : 'div';
  const NavItemTag = isHomeIndex ? 'li' : 'div';

  const navListClass = isHomeIndex
    ? 'nav-links m-0 hidden list-none p-0 lg:flex lg:items-center'
    : 'hidden md:flex items-center gap-2 lg:gap-4';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9997] flex items-center justify-between ${
        isHomeIndex
          ? `nav-home-spec nav-home-typography px-6 max-lg:h-14 max-lg:min-h-[56px] max-lg:bg-[rgba(0,0,0,0.8)] max-lg:backdrop-blur-[20px] max-lg:border-b max-lg:border-[rgba(255,255,255,0.1)] ${scrolled ? 'sx' : ''}`
          : `${navPaddingDefault} ${navSurfaceDefault}`
      }`}
      style={{
        transform: isStoreOrProduct ? (scrolled ? 'translateY(-100%)' : 'translateY(0)') : 'translateY(0)',
        opacity: isStoreOrProduct ? (scrolled ? 0 : 1) : 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isStoreOrProduct && scrolled ? 'none' : 'auto',
      }}
    >
      <Link to={withPath('/')} className="nav-logo relative z-10 flex items-center">
        <span
          className={`${isHomeIndex ? 'max-lg:text-2xl max-lg:font-medium max-lg:tracking-[-0.03em] max-lg:text-[#F5F5F5]' : 'text-2xl font-extrabold tracking-[1px]'} ${isLightPage && scrolled ? 'text-black' : !isHomeIndex ? 'text-white' : ''}`}
        >
          AWAK
        </span>
      </Link>

      <NavListTag className={navListClass}>
        {NAV_ROWS.map((item) => (
          <NavItemTag
            key={item.key}
            className="relative"
            onMouseEnter={() => item.kind === 'dropdown' && setIsHardwareOpen(true)}
            onMouseLeave={() => item.kind === 'dropdown' && setIsHardwareOpen(false)}
          >
            {item.kind === 'dropdown' ? (
              <button
                type="button"
                className={`flex items-center font-medium transition-colors ${isHomeIndex ? 'gap-2 px-4 py-2 lg:gap-2 lg:p-0' : 'gap-1.5 px-4 py-2'} ${linkRadius} ${
                  isLightPage && scrolled
                    ? 'text-[15px] text-black/70 hover:text-black'
                    : isHomeIndex
                      ? 'max-lg:text-[16px] lg:text-[26px] text-[#A7A7B2] hover:text-[#F5F5F5] max-lg:rounded-[12px] max-lg:border max-lg:border-[rgba(255,255,255,0.1)] max-lg:bg-transparent'
                      : 'text-[15px] text-white/70 hover:text-white'
                }`}
              >
                {t(`nav.${item.key}`)}
                <ChevronDown className={`w-[14px] h-[14px] transition-transform duration-300 ${isHardwareOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link
                to={withPath(item.path)}
                aria-current={basePath === item.path ? 'page' : undefined}
                className={`transition-all relative flex items-center font-medium ${isHomeIndex ? 'px-4 py-2 lg:px-0 lg:py-0' : 'px-4 py-2'} ${linkRadius} ${
                  basePath === item.path
                    ? isLightPage && scrolled
                      ? 'text-[15px] bg-black/5 text-black'
                      : isHomeIndex
                        ? 'max-lg:text-[16px] lg:text-[26px] border border-[rgba(255,255,255,0.1)] bg-transparent text-[#F5F5F5] max-lg:rounded-[12px] lg:border-0 lg:text-[#ffffff]'
                        : 'text-[15px] bg-white/10 text-white'
                    : isLightPage && scrolled
                      ? 'text-[15px] text-black/70 hover:text-black'
                      : isHomeIndex
                        ? 'max-lg:text-[16px] lg:text-[26px] text-[#A7A7B2] hover:text-[#F5F5F5] max-lg:rounded-[12px]'
                        : 'text-[15px] text-white/70 hover:text-white'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            )}

            {item.kind === 'dropdown' && (
              <AnimatePresence>
                {isHardwareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-[320px] ${isHomeIndex ? 'pt-6' : 'pt-4'}`}
                  >
                    <div
                      className={`overflow-hidden grid ${isHomeIndex ? 'gap-2 p-4' : 'gap-1 p-3'} ${
                        isHomeIndex
                          ? 'rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[#09090b]'
                          : 'rounded-2xl border border-white/5 bg-[#111111]'
                      }`}
                    >
                      {HW_ITEMS.map((hw) => (
                        <Link
                          key={hw.id}
                          to={withPath(hw.path)}
                          className={`flex flex-col p-4 transition-colors hover:bg-white/5 group ${isHomeIndex ? 'rounded-[12px]' : 'rounded-xl'}`}
                        >
                          <span className={`text-white text-sm block ${isHomeIndex ? 'font-medium' : 'font-bold'}`}>
                            {t(`navHw.${hw.id}.title`)}
                          </span>
                          <span className={`block mt-1 text-[12px] leading-[1.4] ${isHomeIndex ? 'text-[#6F7078]' : 'text-white/40'}`}>
                            {t(`navHw.${hw.id}.desc`)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </NavItemTag>
        ))}
      </NavListTag>

      <div className={`nav-cta relative z-10 flex items-center ${isHomeIndex ? 'gap-2 sm:gap-3' : 'gap-1 sm:gap-2 md:gap-4'}`}>
        <LanguageMenu
          tone={isLightPage && scrolled ? 'onLight' : 'onDark'}
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
        <button
          type="button"
          className={`nav-cta-icon p-2 transition-colors ${isHomeIndex ? 'inline-flex' : 'max-lg:inline-flex lg:hidden'} ${isLightPage && scrolled ? 'text-black/70 hover:text-black' : isHomeIndex ? 'text-[#A7A7B2] hover:text-[#F5F5F5] lg:text-inherit' : 'text-white/70 hover:text-white'}`}
          aria-label={t('nav.search')}
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
        <Link
          to={withPath('/auth')}
          className={`nav-cta-icon p-2 transition-colors ${isHomeIndex ? 'inline-flex' : 'max-lg:inline-flex lg:hidden'} ${isLightPage && scrolled ? 'text-black/70 hover:text-black' : isHomeIndex ? 'text-[#A7A7B2] hover:text-[#F5F5F5] lg:text-inherit' : 'text-white/70 hover:text-white'}`}
          aria-label={t('nav.account')}
        >
          <User className="w-[18px] h-[18px]" />
        </Link>
        {!['/store', '/checkout'].includes(basePath) && (
          <Link
            to={withPath('/store')}
            className={`hidden md:flex items-center gap-2 font-medium transition-colors ${
              isHomeIndex ? 'nav-home-store btn btn-w ml-2' : 'ml-2 h-12 min-h-[48px] rounded-full bg-[#DDF700] px-6 py-2.5 text-[15px] font-semibold text-[#080808] transition-all hover:bg-[#E6FF00]'
            }`}
          >
            {!isHomeIndex ? (
              <ShoppingCart className="h-4 w-4 shrink-0 lg:h-[27px] lg:w-[27px]" style={{ strokeWidth: 2.5 }} />
            ) : null}
            {t('nav.store')}
          </Link>
        )}

        <button
          type="button"
          className={`md:hidden p-2 ${isLightPage && scrolled ? 'text-black' : isHomeIndex ? 'text-[#A7A7B2]' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 right-0 flex flex-col gap-6 p-6 md:hidden ${
              isHomeIndex ? 'border-b border-[rgba(255,255,255,0.1)] bg-[#09090b]' : 'border-b border-white/5 bg-[#080808]'
            }`}
          >
            {NAV_ROWS.map((item) => (
              <div key={item.key} className="space-y-4">
                <span className={`text-[12px] uppercase leading-[1.4] tracking-widest ${isHomeIndex ? 'text-[#6F7078]' : 'text-white/40'}`}>
                  {t(`nav.${item.key}`)}
                </span>
                {item.kind === 'dropdown' ? (
                  <div className="grid gap-4 pl-4">
                    {HW_ITEMS.map((hw) => (
                      <Link
                        key={hw.id}
                        to={withPath(hw.path)}
                        className={`text-lg ${isHomeIndex ? 'font-medium text-[#F5F5F5]' : 'font-bold text-white'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(`navHw.${hw.id}.title`)}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={withPath(item.path)}
                    className={`block pl-4 text-lg ${isHomeIndex ? 'font-medium text-[#F5F5F5]' : 'font-bold text-white'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
