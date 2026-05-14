import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  className?: string;
  /** 嵌入首屏底部时使用 div，减少边框与外边距 */
  embedded?: boolean;
};

function splitStatValue(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1] ?? '',
    number: Number(match[2]),
    suffix: match[3] ?? '',
    decimals: match[2]?.includes('.') ? match[2].split('.')[1]?.length ?? 0 : 0,
  };
}

function TrustStatValue({ value }: { value: string }) {
  const parsed = useMemo(() => splitStatValue(value), [value]);
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(() => (parsed ? `${parsed.prefix}0${parsed.suffix}` : value));

  useEffect(() => {
    if (!parsed || typeof window === 'undefined') return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!desktop.matches || reduce.matches) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    const duration = 1400;

    const animate = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      const current = parsed.number * eased;
      setDisplay(`${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        cancelAnimationFrame(raf);
        start = 0;
        raf = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed, value]);

  return (
    <div
      ref={ref}
      className="home-trust-stat-value mb-1 truncate font-medium leading-[1.03] tracking-[-0.03em] text-[#F5F5F5] tabular-nums [font-size:clamp(1rem,3.6vh,2.75rem)] lg:mb-2"
    >
      {display}
    </div>
  );
}

export default function TrustBanner({ className = '', embedded = false }: Props) {
  const { t } = useTranslation('common');
  const stats = t('home.trust.stats', { returnObjects: true }) as { value: string; label: string }[];

  const inner = (
    <div className="wrap r d1 grid min-h-0 w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-8 lg:gap-y-0">
      {stats.map((stat, i) => (
        <div key={i} className="flex min-w-0 flex-col justify-center px-0 py-0 text-center">
          <TrustStatValue value={stat.value} />
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
        className={`home-trust-banner home-trust-banner--embedded relative z-[65] flex min-h-0 shrink-0 flex-col justify-center overflow-hidden bg-transparent px-6 py-4 md:px-8 lg:mt-0 lg:border-0 lg:px-0 lg:py-6 lg:pb-8 lg:pt-6 ${className}`}
      >
        {inner}
      </div>
    );
  }

  return (
    <section
      className={`home-trust-banner relative z-[4] mt-0 flex min-h-0 shrink-0 flex-col justify-center overflow-hidden border-t border-[rgba(255,255,255,0.08)] bg-transparent px-6 py-5 md:px-8 lg:mt-[10px] lg:px-0 lg:pb-10 lg:pt-20 ${className}`}
    >
      {inner}
    </section>
  );
}
