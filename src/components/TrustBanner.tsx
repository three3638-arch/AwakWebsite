import { useTranslation } from 'react-i18next';

type Props = {
  className?: string;
  /** 嵌入首屏底部时使用 div，减少边框与外边距 */
  embedded?: boolean;
};

export default function TrustBanner({ className = '', embedded = false }: Props) {
  const { t } = useTranslation('common');
  const stats = t('home.trust.stats', { returnObjects: true }) as { value: string; label: string }[];

  const inner = (
    <div className="wrap r d1 grid min-h-0 w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-8 lg:gap-y-0">
      {stats.map((stat, i) => (
        <div key={i} className="flex min-w-0 flex-col justify-center px-0 py-0 text-center">
          <div className="home-trust-stat-value mb-1 truncate font-medium leading-[1.03] tracking-[-0.03em] text-[#F5F5F5] tabular-nums [font-size:clamp(1rem,3.6vh,2.75rem)] lg:mb-2">
            {stat.value}
          </div>
          <div className="home-trust-stat-label break-words text-[12px] font-normal uppercase leading-[1.4] tracking-wide text-[#A7A7B2] lg:text-[clamp(0.75rem,1.6vh,0.8125rem)]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );

  if (embedded) {
    return (
      <div
        className={`home-trust-banner home-trust-banner--embedded relative z-[65] flex min-h-0 shrink-0 flex-col justify-center overflow-hidden bg-[rgba(9,9,11,0.72)] px-6 py-4 backdrop-blur-xl md:px-8 lg:mt-0 lg:border-0 lg:px-0 lg:py-6 lg:pb-8 lg:pt-6 ${className}`}
      >
        {inner}
      </div>
    );
  }

  return (
    <section
      className={`home-trust-banner relative z-[4] mt-0 flex min-h-0 shrink-0 flex-col justify-center overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-[rgba(9,9,11,0.72)] px-6 py-5 backdrop-blur-xl md:px-8 lg:mt-[10px] lg:px-0 lg:pb-10 lg:pt-20 ${className}`}
    >
      {inner}
    </section>
  );
}
