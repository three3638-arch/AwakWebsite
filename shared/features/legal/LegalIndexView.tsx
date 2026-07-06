import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { DEFAULT_LOCALE, isSupportedLocale, withLocale } from '../../lib/locale';
import { legalDocumentMeta, legalGlobalMeta } from './registry';

type LanguageMenuProps = {
  tone: 'onDark' | 'onLight';
  onNavigate?: () => void;
};

type LegalIndexViewProps = {
  Footer?: ComponentType;
  LanguageMenu?: ComponentType<LanguageMenuProps>;
};

export default function LegalIndexView({ Footer, LanguageMenu }: LegalIndexViewProps) {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation('common');
  const locale = lang && isSupportedLocale(lang) ? lang : DEFAULT_LOCALE;
  const withPath = (path: string) => withLocale(locale, path);

  return (
    <div className="min-h-screen bg-[#050508] text-[#F5F5F5]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 15%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 70%, rgba(221,247,0,0.04) 0%, transparent 50%), #050508',
        }}
        aria-hidden
      />

      <header className="relative z-[2] border-b border-white/[0.08] bg-[#050508]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <h1 className="text-base font-medium text-[#F5F5F5] md:text-lg">{t('legal.indexTitle')}</h1>
          {LanguageMenu ? <LanguageMenu tone="onDark" /> : null}
        </div>
      </header>

      <main className="relative z-[1] mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <p className="mb-2 text-[15px] leading-relaxed text-[#A7A7B2]">{t('legal.indexDescription')}</p>
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6F7078]">
          {t('legal.versionLabel', { version: legalGlobalMeta.version, date: legalGlobalMeta.updatedAt })}
        </p>

        <ul className="space-y-3">
          {legalDocumentMeta.map((doc) => (
            <li key={doc.slug}>
              <Link
                to={withPath(`/legal/${doc.slug}`)}
                className="group flex items-center justify-between gap-4 rounded-[14px] border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-colors hover:border-[#DDF700]/30 hover:bg-white/[0.05]"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#6F7078] group-hover:text-[#DDF700]" aria-hidden />
                  <div className="min-w-0">
                    <span className="block text-[15px] font-medium text-[#F5F5F5]">{t(doc.titleKey)}</span>
                    <span className="mt-1 block font-mono text-[11px] text-[#6F7078]">
                      v{doc.version} · {doc.updatedAt}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-[#6F7078] group-hover:text-[#DDF700]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-[#6F7078]">
          {t('legal.contactHint')}{' '}
          <a href="mailto:support@awakwill.com" className="text-[#DDF700] hover:underline">
            support@awakwill.com
          </a>
        </p>
      </main>

      {Footer ? (
        <div className="relative z-[1] bg-white">
          <Footer />
        </div>
      ) : null}
    </div>
  );
}
