import { useTranslation } from 'react-i18next';

export default function TrustBanner() {
  const { t } = useTranslation('common');
  const stats = t('home.trust.stats', { returnObjects: true }) as { value: string; label: string }[];

  return (
    <section className="shrink-0 border-t border-white/10 bg-[#080808] py-10 md:py-14 lg:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-12 md:gap-x-10 md:gap-y-12 lg:grid-cols-8 lg:gap-x-5 lg:gap-y-0 xl:gap-x-10">
        {stats.map((stat, i) => (
          <div key={i} className="flex min-h-[88px] flex-col justify-center px-1 py-5 text-center sm:min-h-[96px] sm:py-6 md:min-h-[104px] lg:min-h-0 lg:px-2 lg:py-8">
            <div className="mb-2 text-3xl font-black leading-none text-white md:mb-3 md:text-4xl lg:text-[2.5rem] lg:leading-none">
              {stat.value}
            </div>
            <div className="text-xs uppercase leading-snug tracking-widest text-white/95 sm:text-sm md:text-[15px] md:leading-relaxed">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
