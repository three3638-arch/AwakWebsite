import { useTranslation } from 'react-i18next';

type Props = { className?: string };

export default function TrustBanner({ className = '' }: Props) {
  const { t } = useTranslation('common');
  const stats = t('home.trust.stats', { returnObjects: true }) as { value: string; label: string }[];

  return (
    <section
      className={`flex min-h-0 shrink-0 flex-col justify-center overflow-hidden border-t border-white/10 bg-[#080808] px-6 md:px-[170px] ${className}`}
    >
      <div className="grid w-full min-h-0 grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-3 lg:gap-y-0 xl:gap-x-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col justify-center text-center min-w-0 px-0.5 py-0.5 lg:px-1"
          >
            <div className="mb-0.5 truncate text-xl font-black leading-none text-white tabular-nums lg:mb-1 lg:text-[clamp(1rem,3.6vh,2.75rem)]">
              {stat.value}
            </div>
            <div className="break-words text-[10px] uppercase leading-tight tracking-wide text-white/90 lg:text-[clamp(0.5625rem,1.6vh,0.8125rem)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
