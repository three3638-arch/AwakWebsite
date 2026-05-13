import { useTranslation } from 'react-i18next';

/** 与 PC 首页一致：Hero 与 Team 之间的黑色三行文案 */
export default function HomeLifecycleStrip() {
  const { t } = useTranslation('common');

  return (
    <section className="m-0 w-full border-b border-[rgba(255,255,255,0.1)] bg-black px-6 py-10 md:px-[168px] md:py-12">
      <div className="mx-auto max-w-[min(92vw,720px)] text-center font-normal leading-[1.85] tracking-[-0.02em] text-white md:leading-[2]">
        <p className="text-[clamp(15px,3.8vw,18px)] font-normal">{t('home.immersive.desktopCollage.line1')}</p>
        <p className="mt-2 text-[clamp(15px,3.8vw,18px)] font-normal">{t('home.immersive.desktopCollage.line2')}</p>
        <p className="mt-4 text-[clamp(14px,3.4vw,16px)] font-normal text-[#a1a1aa]">{t('home.immersive.desktopCollage.line3')}</p>
      </div>
    </section>
  );
}
