import type { ComponentType } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { DEFAULT_LOCALE, isEmbedMode, isSupportedLocale, withLocale } from '../../lib/locale';
import LegalMarkdown from './LegalMarkdown';
import { getLegalMeta, isLegalSlug, legalDocuments, legalGlobalMeta } from './registry';

type LanguageMenuProps = {
  tone: 'onDark' | 'onLight';
  onNavigate?: () => void;
};

type LegalDocumentViewProps = {
  Footer?: ComponentType;
  LanguageMenu?: ComponentType<LanguageMenuProps>;
};

export default function LegalDocumentView({ Footer, LanguageMenu }: LegalDocumentViewProps) {
  const { lang, slug } = useParams<{ lang: string; slug: string }>();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const { t } = useTranslation('common');

  const locale = lang && isSupportedLocale(lang) ? lang : DEFAULT_LOCALE;
  const embed = isEmbedMode(search);

  if (!slug || !isLegalSlug(slug)) {
    return <Navigate to={withLocale(locale, '/legal')} replace />;
  }

  const content = legalDocuments[locale][slug];
  const docMeta = getLegalMeta(slug);
  const title = docMeta ? t(docMeta.titleKey) : slug;

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
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {!embed && (
              <Link
                to={withPath('/legal')}
                className="flex shrink-0 items-center gap-1 text-[13px] text-[#A7A7B2] transition-colors hover:text-[#DDF700]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{t('legal.backToIndex')}</span>
              </Link>
            )}
            <h1 className="truncate text-[15px] font-medium text-[#F5F5F5] md:text-base">{title}</h1>
          </div>
          {LanguageMenu ? <LanguageMenu tone="onDark" /> : null}
        </div>
      </header>

      <main className="relative z-[1] mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6F7078]">
          {t('legal.versionLabel', {
            version: docMeta?.version ?? legalGlobalMeta.version,
            date: docMeta?.updatedAt ?? legalGlobalMeta.updatedAt,
          })}
          {locale === 'en' ? ` · ${t('legal.englishNotice')}` : ''}
        </p>
        <LegalMarkdown content={content} />
        {!embed && (
          <p className="mt-12 border-t border-white/[0.08] pt-8 text-sm text-[#6F7078]">
            {t('legal.contactHint')}{' '}
            <a href="mailto:support@awakwill.com" className="text-[#DDF700] hover:underline">
              support@awakwill.com
            </a>
          </p>
        )}
      </main>

      {!embed && Footer ? (
        <div className="relative z-[1] bg-white">
          <Footer />
        </div>
      ) : null}
    </div>
  );
}
