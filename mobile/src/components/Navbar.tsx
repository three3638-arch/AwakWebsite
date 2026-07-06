import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import { stripLocalePrefix } from '../lib/locale';
import { NAV_HARDWARE_ITEMS, NAV_SECONDARY_PAGES } from '../lib/siteNav';
import { PRODUCT_BRAND_NAME } from '../../../shared/lib/companyIdentity';

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

  /**
   * 顶栏与页面背景对比：
   * - 深色页（默认）：未滚动时透明 + 浅色字；滚动后半透明白底 + 黑字
   * - 浅色页（资讯 / 登录）：未滚动时透明 + 黑字；滚动后半透明黑底 + 白字
   */
  const isLightUnderlying = basePath === '/auth' || basePath.startsWith('/news');
  const isHomeIndex = basePath === '/';
  /** 使用「黑字系」前景（白底栏或浅底透明） */
  const useLightInk = scrolled !== isLightUnderlying;

  const logoClass =
    isHomeIndex && !isLightUnderlying ? 'text-white' : useLightInk ? 'text-black' : 'text-white';
  const mobileToggleClass =
    isHomeIndex && !isLightUnderlying ? 'text-white' : useLightInk ? 'text-black' : 'text-white';

  const navPadding = isHomeIndex ? 'px-6 md:px-[168px]' : 'px-6 md:px-[170px]';
  const linkRadius = isHomeIndex ? 'rounded-[12px]' : 'rounded-full';

  const hardwareBtnClass = `flex items-center gap-1.5 text-[15px] font-medium transition-colors px-4 py-2 ${linkRadius} ${
    useLightInk ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
  }`;

  const navShellClass =
    isHomeIndex && !isLightUnderlying
      ? `fixed top-0 left-0 right-0 z-[var(--nav-z)] flex items-center justify-between ${navPadding} h-16 min-h-[64px] bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.1)]`
      : `fixed top-0 left-0 right-0 z-[var(--nav-z)] flex items-center justify-between ${navPadding} ${
          scrolled
            ? isLightUnderlying
              ? 'h-[var(--nav-height)] bg-[rgba(8,8,8,0.92)] backdrop-blur-[20px] border-b border-white/10'
              : 'h-[var(--nav-height)] bg-[rgba(255,255,255,0.92)] backdrop-blur-[20px] border-b border-black/10'
            : 'h-[var(--nav-height-expanded)] bg-transparent'
        }`;

  return (
    <nav
      className={navShellClass}
      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <Link to={withPath('/')} className="relative z-10 flex shrink-0 items-center">
        <span
          className={`text-2xl ${isHomeIndex && !isLightUnderlying ? 'font-medium tracking-[-0.02em]' : 'font-extrabold tracking-[1px]'} ${logoClass}`}
        >
          {PRODUCT_BRAND_NAME}
        </span>
      </Link>

      {/* Desktop: 硬件 + 服务生态 / 品牌资讯 / 联系我们 */}
      <div className="hidden md:flex flex-1 justify-center items-center">
        <div
          className="relative"
          onMouseEnter={() => setIsHardwareOpen(true)}
          onMouseLeave={() => setIsHardwareOpen(false)}
        >
          <button type="button" className={hardwareBtnClass}>
            {t('nav.hardware')}
            <ChevronDown className={`w-[14px] h-[14px] transition-transform duration-300 ${isHardwareOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isHardwareOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] pt-4"
              >
                <div
                  className={`grid gap-1 overflow-hidden p-3 ${
                    isHomeIndex
                      ? 'rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[#09090b]'
                      : 'rounded-2xl border-none bg-[#111111]'
                  }`}
                >
                  {NAV_HARDWARE_ITEMS.map((hw) => (
                    <Link
                      key={hw.id}
                      to={withPath(hw.path)}
                      className={`group flex flex-col p-4 transition-colors hover:bg-white/5 ${isHomeIndex ? 'rounded-[12px]' : 'rounded-xl'}`}
                    >
                      <span className={`block text-sm text-white ${isHomeIndex ? 'font-medium' : 'font-bold'}`}>
                        {t(`navHw.${hw.id}.title`)}
                      </span>
                      <span className={`mt-1 block text-[11px] ${isHomeIndex ? 'text-[#a1a1aa]' : 'text-white/40'}`}>
                        {t(`navHw.${hw.id}.desc`)}
                      </span>
                    </Link>
                  ))}
                  <div className="my-2 border-t border-white/10" role="separator" />
                  {NAV_SECONDARY_PAGES.map((page) => (
                    <Link
                      key={page.key}
                      to={withPath(page.path)}
                      className={`block p-4 text-sm transition-colors ${isHomeIndex ? 'rounded-[12px]' : 'rounded-xl'} ${
                        isHomeIndex ? 'font-medium' : 'font-bold'
                      } ${
                        basePath === page.path ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/5'
                      }`}
                    >
                      {t(`nav.${page.key}`)}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {!['/store', '/checkout'].includes(basePath) && (
          <Link
            to={withPath('/store')}
            className={`inline-flex items-center justify-center px-4 py-2.5 text-[14px] transition-colors sm:px-6 sm:text-[15px] ${
              isHomeIndex
                ? 'rounded-[12px] border border-white/15 bg-accent font-semibold text-ink hover:bg-accent-hover'
                : 'rounded-full bg-accent font-semibold text-ink transition-all hover:bg-accent-hover'
            }`}
          >
            <span className="whitespace-nowrap">{t('nav.store')}</span>
          </Link>
        )}

        <button
          type="button"
          className={`md:hidden p-2 ${mobileToggleClass}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 shrink-0" strokeWidth={2.5} aria-hidden />
          ) : (
            <Menu className="h-6 w-6 shrink-0" strokeWidth={2.5} aria-hidden />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute left-0 right-0 top-full flex flex-col gap-6 border-b p-6 md:hidden ${
              isHomeIndex
                ? 'border-[rgba(255,255,255,0.1)] bg-[#09090b]'
                : 'border-white/5 bg-[#080808]'
            }`}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="关闭菜单"
              >
                <X className="h-6 w-6 shrink-0" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            <div className="space-y-4">
              <span className="text-white/40 text-xs uppercase tracking-widest">{t('nav.hardware')}</span>
              <div className="grid gap-4 pl-4">
                {NAV_HARDWARE_ITEMS.map((hw) => (
                  <Link
                    key={hw.id}
                    to={withPath(hw.path)}
                    className="flex flex-col gap-1 rounded-lg py-1 text-left transition-colors hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className={`text-sm text-white ${isHomeIndex ? 'font-medium' : 'font-bold'}`}>
                      {t(`navHw.${hw.id}.title`)}
                    </span>
                    <span
                      className={`text-[11px] font-normal leading-snug ${isHomeIndex ? 'text-[#a1a1aa]' : 'text-white/40'}`}
                    >
                      {t(`navHw.${hw.id}.desc`)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="h-px bg-white/10" role="separator" />
            <div className="grid gap-4">
              {NAV_SECONDARY_PAGES.map((page) => (
                <Link
                  key={page.key}
                  to={withPath(page.path)}
                  className={`rounded-lg py-2 pl-4 text-sm transition-colors ${
                    isHomeIndex ? 'font-medium' : 'font-bold'
                  } ${basePath === page.path ? 'text-white' : 'text-white/90 hover:text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`nav.${page.key}`)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
