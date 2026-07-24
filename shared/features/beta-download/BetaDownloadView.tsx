import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Download, ExternalLink } from 'lucide-react';
import {
  BETA_DOWNLOAD_APK_URL,
  BETA_DOWNLOAD_LOGO_URL,
  BETA_DOWNLOAD_RELEASED_AT,
  BETA_DOWNLOAD_VERSION,
} from './config';
import { copyText, isWeChatBrowser, resolveApkUrl } from './wechat';
import './beta-download.css';

type LanguageMenuProps = {
  tone: 'onDark' | 'onLight';
  onNavigate?: () => void;
};

type BetaDownloadViewProps = {
  Footer?: ComponentType;
  LanguageMenu?: ComponentType<LanguageMenuProps>;
};

const ROBOTS_META = 'robots';

export default function BetaDownloadView({ Footer, LanguageMenu }: BetaDownloadViewProps) {
  const { t } = useTranslation('common');
  const disclaimerItems = t('betaDownload.disclaimerItems', {
    returnObjects: true,
  }) as string[];
  const [inWeChat, setInWeChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setInWeChat(isWeChatBrowser());
    setPageUrl(window.location.href);
  }, []);

  useEffect(() => {
    let meta = document.querySelector(`meta[name="${ROBOTS_META}"]`) as HTMLMetaElement | null;
    const previous = meta?.getAttribute('content') ?? null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = ROBOTS_META;
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
    return () => {
      if (!meta) return;
      if (previous != null) {
        meta.content = previous;
      } else {
        meta.remove();
      }
    };
  }, []);

  const handleCopyPageLink = async () => {
    const ok = await copyText(pageUrl || window.location.href);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const apkHref = resolveApkUrl(BETA_DOWNLOAD_APK_URL);

  return (
    <div className="beta-download-page min-h-screen bg-[#050508] text-[#F5F5F5]">
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
          <h1 className="text-base font-medium text-[#F5F5F5] md:text-lg">{t('betaDownload.title')}</h1>
          {LanguageMenu ? <LanguageMenu tone="onDark" /> : null}
        </div>
      </header>

      <main className="relative z-[1] mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <p className="mb-8 text-[15px] leading-relaxed text-[#A7A7B2]">{t('betaDownload.lede')}</p>

        <section
          className="mb-10 rounded-[14px] bg-white/[0.03] px-5 py-5 md:px-6 md:py-6"
          aria-labelledby="beta-disclaimer-heading"
        >
          <h2
            id="beta-disclaimer-heading"
            className="mb-4 text-[13px] font-medium uppercase tracking-[0.12em] text-[#DDF700]"
          >
            {t('betaDownload.disclaimerTitle')}
          </h2>
          <ul className="space-y-3 text-[14px] leading-relaxed text-[#A7A7B2]">
            {disclaimerItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#DDF700]/80" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-[14px] bg-white/[0.03] px-5 py-8 text-center md:px-8"
          aria-labelledby="beta-android-heading"
        >
          <h2 id="beta-android-heading" className="sr-only">
            {t('betaDownload.androidSectionTitle')}
          </h2>
          <img
            src={BETA_DOWNLOAD_LOGO_URL}
            alt={t('betaDownload.androidLogoAlt')}
            width={96}
            height={96}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="mx-auto mb-6 h-24 w-24 rounded-[22px] object-cover shadow-lg shadow-black/40"
          />

          {inWeChat ? (
            <div className="beta-download-wechat-notice mx-auto max-w-md text-left">
              <div className="mb-5 flex items-start gap-3 rounded-[12px] border border-[#DDF700]/25 bg-[#DDF700]/10 px-4 py-4">
                <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-[#DDF700]" aria-hidden />
                <div>
                  <p className="mb-2 text-[15px] font-semibold text-[#F5F5F5]">
                    {t('betaDownload.wechatNoticeTitle')}
                  </p>
                  <p className="text-[14px] leading-relaxed text-[#A7A7B2]">
                    {t('betaDownload.wechatNoticeBody')}
                  </p>
                </div>
              </div>
              <ol className="mb-6 space-y-3 text-[14px] leading-relaxed text-[#A7A7B2]">
                <li className="flex gap-3">
                  <span className="beta-download-step-num" aria-hidden>1</span>
                  <span>{t('betaDownload.wechatStepBrowser')}</span>
                </li>
                <li className="flex gap-3">
                  <span className="beta-download-step-num" aria-hidden>2</span>
                  <span>{t('betaDownload.wechatStepCopy')}</span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => void handleCopyPageLink()}
                className="beta-download-cta inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#DDF700] px-8 py-3.5 text-[15px] font-semibold transition-opacity hover:opacity-90"
              >
                <Copy className="h-5 w-5 shrink-0" aria-hidden />
                {copied ? t('betaDownload.copied') : t('betaDownload.copyPageLink')}
              </button>
              <p className="mt-4 break-all font-mono text-[11px] leading-relaxed text-[#6F7078]">{pageUrl}</p>
            </div>
          ) : (
            <a
              href={apkHref}
              rel="noopener noreferrer"
              className="beta-download-cta inline-flex items-center justify-center gap-2 rounded-full bg-[#DDF700] px-8 py-3.5 text-[15px] font-semibold no-underline transition-opacity hover:opacity-90"
            >
              <Download className="h-5 w-5 shrink-0" aria-hidden />
              {t('betaDownload.downloadCta')}
            </a>
          )}

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[#6F7078]">
            {t('betaDownload.versionHint', {
              version: BETA_DOWNLOAD_VERSION,
              date: BETA_DOWNLOAD_RELEASED_AT,
            })}
          </p>
        </section>
      </main>

      {Footer ? (
        <div className="relative z-[1] bg-white">
          <Footer />
        </div>
      ) : null}
    </div>
  );
}
