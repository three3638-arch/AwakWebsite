import { useTranslation } from 'react-i18next';

export default function TrustBanner() {
  const { t } = useTranslation('common');
  const stats = t('home.trust.stats', { returnObjects: true }) as { value: string; label: string }[];

  return (
    <section className="shrink-0 bg-[#080808] py-5 md:py-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-6 md:gap-10">
        {stats.map((stat, i) => (
          <div key={i} className="flex-1 min-w-[120px] sm:min-w-[140px] text-center border-r border-white/10 last:border-0">
            <div className="text-white text-2xl md:text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-white text-sm tracking-widest uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
