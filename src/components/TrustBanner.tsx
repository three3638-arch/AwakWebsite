import { useTranslation } from 'react-i18next';

type Props = { className?: string };

export default function TrustBanner({ className = '' }: Props) {
  const { t } = useTranslation('common');
  const stats = t('home.trust.stats', { returnObjects: true }) as { value: string; label: string }[];

  return (
    <section
      className={`relative z-[4] mt-0 flex min-h-0 shrink-0 flex-col justify-center overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-[rgba(9,9,11,0.72)] px-6 py-5 backdrop-blur-xl md:px-8 lg:mt-[10px] lg:px-0 lg:pb-10 lg:pt-20 ${className}`}
    >
      <div className="wrap r d1 grid min-h-0 w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-8 lg:gap-y-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col justify-center px-0 py-0 text-center"
          >
            <div className="mb-1 truncate font-medium leading-[1.03] tracking-[-0.03em] text-[#F5F5F5] tabular-nums [font-size:clamp(1rem,3.6vh,2.75rem)] lg:mb-2">
              {stat.value}
            </div>
            <div className="break-words text-[12px] font-normal uppercase leading-[1.4] tracking-wide text-[#A7A7B2] lg:text-[clamp(0.75rem,1.6vh,0.8125rem)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
