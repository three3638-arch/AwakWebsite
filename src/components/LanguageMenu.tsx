import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import { SUPPORTED_LOCALES, swapLocalePath, type AppLocale } from '../lib/locale';

type Tone = 'onDark' | 'onLight';

type Props = {
  tone: Tone;
  /** Optional: e.g. close mobile nav after picking a language */
  onNavigate?: () => void;
};

export default function LanguageMenu({ tone, onNavigate }: Props) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { locale } = useLocalePath();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const buttonTone =
    tone === 'onLight'
      ? 'border-black/10 bg-white/90 text-black/85 hover:text-black hover:bg-white'
      : 'border-white/20 bg-black/25 text-white/85 hover:text-white hover:bg-black/35';

  const panelTone =
    tone === 'onLight'
      ? 'border-black/10 bg-white text-[#1D1D1F] shadow-xl shadow-black/10'
      : 'border-white/10 bg-[#111111] text-white shadow-xl shadow-black/40';

  const rowInactive = tone === 'onLight' ? 'hover:bg-black/[0.04]' : 'hover:bg-white/5';
  const rowActive = tone === 'onLight' ? 'bg-black/[0.06]' : 'bg-white/10';

  const handlePick = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.chooseLanguage')}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium transition-colors ${buttonTone}`}
      >
        <Globe className="h-[15px] w-[15px] shrink-0 opacity-90" aria-hidden />
        <span className="max-w-[120px] truncate sm:max-w-none">{t(`localeMenu.${locale}`)}</span>
        <ChevronDown
          className={`h-[14px] w-[14px] shrink-0 opacity-70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={t('nav.chooseLanguage')}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-[calc(100%+8px)] z-[10001] min-w-[188px] overflow-hidden rounded-xl border py-1 ${panelTone}`}
          >
            {SUPPORTED_LOCALES.map((code: AppLocale) => {
              const active = locale === code;
              return (
                <Link
                  key={code}
                  role="option"
                  aria-selected={active}
                  to={swapLocalePath(location.pathname, location.search, code)}
                  onClick={handlePick}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13px] transition-colors ${active ? `${rowActive} font-semibold` : rowInactive}`}
                >
                  <span>{t(`localeMenu.${code}`)}</span>
                  {active ? <Check className="h-4 w-4 shrink-0 opacity-90" aria-hidden /> : <span className="w-4 shrink-0" aria-hidden />}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
