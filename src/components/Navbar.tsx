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
  | { kind: 'link'; key: 'ecosystem' | 'news' | 'contact'; path: '/ecosystem' | '/news' | '/contact' };

const NAV_ROWS: NavRow[] = [
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

  // if (['/store', '/checkout', '/auth'].includes(location.pathname)) {
  //   return null;
  // }

  const isStoreOrProduct = basePath.startsWith('/products/') || basePath === '/store';
  const isCheckout = basePath === '/checkout';
  const isAuth = basePath === '/auth';
  const isLightPage = isStoreOrProduct || isCheckout || isAuth;

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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9997] flex items-center justify-between px-6 md:px-[170px] ${
        scrolled 
          ? isLightPage 
            ? 'h-[72px] bg-[rgba(255,255,255,0.85)] backdrop-blur-[20px] border-b border-black/5'
            : 'h-[72px] bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-[#1A1A1A]' 
          : 'h-[90px] bg-transparent'
      }`}
      style={{
        transform: isStoreOrProduct ? (scrolled ? 'translateY(-100%)' : 'translateY(0)') : 'translateY(0)',
        opacity: isStoreOrProduct ? (scrolled ? 0 : 1) : 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isStoreOrProduct && scrolled ? 'none' : 'auto'
      }}
    >
      {/* Logo */}
      <Link to={withPath('/')} className="relative z-10 flex items-center">
        <span className={`font-extrabold text-2xl tracking-[1px] ${isLightPage && scrolled ? 'text-black' : 'text-white'}`}>AWAK</span>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4">
        {NAV_ROWS.map((item) => (
          <div 
            key={item.key}
            className="relative"
            onMouseEnter={() => item.kind === 'dropdown' && setIsHardwareOpen(true)}
            onMouseLeave={() => item.kind === 'dropdown' && setIsHardwareOpen(false)}
          >
            {item.kind === 'dropdown' ? (
              <button type="button" className={`flex items-center gap-1.5 text-[15px] font-medium transition-colors px-4 py-2 rounded-full ${
                isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
              }`}>
                {t(`nav.${item.key}`)}
                <ChevronDown className={`w-[14px] h-[14px] transition-transform duration-300 ${isHardwareOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link 
                to={withPath(item.path)} 
                className={`transition-all relative text-[15px] font-medium px-4 py-2 rounded-full flex items-center ${
                  basePath === item.path 
                    ? isLightPage && scrolled ? 'bg-black/5 text-black' : 'bg-white/10 text-white'
                    : isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            )}

            {/* Dropdown Menu */}
            {item.kind === 'dropdown' && (
              <AnimatePresence>
                {isHardwareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] pt-4"
                  >
                    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden p-3 grid gap-1">
                      {HW_ITEMS.map((hw) => (
                        <Link
                          key={hw.id}
                          to={withPath(hw.path)}
                          className="flex flex-col p-4 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <span className="text-white text-sm font-bold block">{t(`navHw.${hw.id}.title`)}</span>
                          <span className="text-white/40 text-[11px] block mt-1">{t(`navHw.${hw.id}.desc`)}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        <LanguageMenu
          tone={isLightPage && scrolled ? 'onLight' : 'onDark'}
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
        <button 
          type="button"
          className={`p-2 transition-colors ${isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
          aria-label={t('nav.search')}
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
        <Link 
          to={withPath('/auth')} 
          className={`p-2 transition-colors ${isLightPage && scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
          aria-label={t('nav.account')}
        >
          <User className="w-[18px] h-[18px]" />
        </Link>
        {!['/store', '/checkout'].includes(basePath) && (
          <Link 
            to={withPath('/store')} 
            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-[15px] font-semibold transition-all bg-[#DDF700] text-[#080808] hover:bg-[#E6FF00] ml-2"
          >
            <ShoppingCart className="w-[15px] h-[15px]" style={{ strokeWidth: 2.5 }} />
            {t('nav.store')}
          </Link>
        )}
        
        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${isLightPage && scrolled ? 'text-black' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#080808] border-b border-white/5 p-6 flex flex-col gap-6 md:hidden"
          >
            {NAV_ROWS.map((item) => (
              <div key={item.key} className="space-y-4">
                <span className="text-white/40 text-xs uppercase tracking-widest">{t(`nav.${item.key}`)}</span>
                {item.kind === 'dropdown' ? (
                  <div className="grid gap-4 pl-4">
                    {HW_ITEMS.map(hw => (
                      <Link key={hw.id} to={withPath(hw.path)} className="text-white text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                        {t(`navHw.${hw.id}.title`)}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link to={withPath(item.path)} className="text-white text-lg font-bold block pl-4" onClick={() => setIsMobileMenuOpen(false)}>
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

