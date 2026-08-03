import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import { PRODUCT_BRAND_NAME } from '../../../shared/lib/companyIdentity';
import { VISIBLE_PRODUCT_IDS } from '../lib/visibleProducts';

type FooterSectionsProps = { /** 仅首页：应用原子视觉（细线 / 去粗 / 荧光点缀交互） */ homeAtomic?: boolean };

export default function FooterSections({ homeAtomic = false }: FooterSectionsProps) {
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');

  const footerGroups = useMemo(
    () => [
      {
        title: t('footer.groups.products'),
        links: VISIBLE_PRODUCT_IDS.map((id) => ({
          name: t(`footer.links.${id}`),
          path: `/products/${id}`,
        })),
      },
      {
        title: t('footer.groups.company'),
        links: [
          { name: t('footer.links.about'), path: '/' },
          { name: t('footer.links.news'), path: '/news' },
          { name: t('footer.links.contact'), path: '/contact' },
        ],
      },
      {
        title: t('footer.groups.support'),
        links: [
          { name: t('footer.links.help'), path: '/' },
          { name: t('footer.legal'), path: '/legal' },
          { name: t('footer.links.manual'), path: '/' },
          { name: t('footer.links.warranty'), path: '/' },
        ],
      },
      {
        title: t('footer.groups.download'),
        links: [
          { name: t('footer.links.ios'), path: '/' },
          { name: t('footer.links.android'), path: '/' },
          { name: t('footer.links.web'), path: '/' },
        ],
      },
    ],
    [t],
  );

  const socialBtnClass = homeAtomic
    ? 'flex h-10 w-10 cursor-pointer items-center justify-center rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-transparent transition-colors hover:border-[#DDF700] hover:text-[#DDF700]'
    : 'flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white/5 transition-all hover:bg-[#C8FF00] hover:text-[#080808]';

  const linkClass = homeAtomic
    ? 'text-sm text-[#a1a1aa] transition-colors hover:text-[#DDF700]'
    : 'text-sm text-white/40 transition-colors hover:text-[#C8FF00]';

  const groupTitleClass = homeAtomic ? 'text-sm font-medium tracking-wider text-white' : 'text-sm font-bold tracking-wider text-white';

  return (
    <footer
      className={`border-t pb-24 pt-24 ${
        homeAtomic ? 'border-[rgba(255,255,255,0.1)] bg-[#09090b]' : 'border-white/5 bg-[#030303]'
      }`}
    >
      <div className={`mx-auto w-full px-6 ${homeAtomic ? 'md:px-[168px]' : 'md:px-[170px]'}`}>
        <div className="mb-32 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-1">
            <div className="space-y-4">
              <h2 className="text-3xl font-medium tracking-[-0.02em] text-white">{PRODUCT_BRAND_NAME}</h2>
              <p
                className={`text-sm font-medium uppercase tracking-widest ${
                  homeAtomic ? 'text-[#a1a1aa]' : 'text-white/40'
                }`}
              >
                {t('footer.tagline')}
              </p>
            </div>
            <div className="flex gap-4">
              <div className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </div>
              <div className={socialBtnClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {footerGroups.map((group) => (
              <div key={group.title} className="space-y-8">
                <h4 className={groupTitleClass}>{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link to={withPath(link.path)} className={linkClass}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row ${
            homeAtomic ? 'border-[rgba(255,255,255,0.1)]' : 'border-white/5'
          }`}
        >
          <p
            className={`font-mono text-xs uppercase tracking-[0.2em] ${homeAtomic ? 'text-[#a1a1aa]' : 'text-white/20'}`}
          >
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-8">
            <Link
              to={withPath('/legal/privacy')}
              className={`font-mono text-xs uppercase transition-colors ${
                homeAtomic ? 'text-[#a1a1aa] hover:text-[#DDF700]' : 'text-white/20 hover:text-white'
              }`}
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to={withPath('/legal/terms')}
              className={`font-mono text-xs uppercase transition-colors ${
                homeAtomic ? 'text-[#a1a1aa] hover:text-[#DDF700]' : 'text-white/20 hover:text-white'
              }`}
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
