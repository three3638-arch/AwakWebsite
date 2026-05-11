import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import HomeHeroGlassPanel from './HomeHeroGlassPanel';

const CARD_IDS = ['ring', 'band', 'watch', 'glasses'] as const;
const HERO_CARD_IDS = ['ring', 'band', 'watch', 'glasses'] as const;

const STORE_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/store/ring',
  band: '/store/bracelet',
  watch: '/store/watch',
  glasses: '/store/glasses',
};

const HERO_CARD_IMAGE: Record<(typeof HERO_CARD_IDS)[number], string> = {
  ring: 'https://i.ibb.co/zWLc5k7G/4.jpg',
  band: 'https://i.ibb.co/zVcfTmFX/2.jpg',
  watch: 'https://i.ibb.co/zWdVr7yj/3.jpg',
  glasses: 'https://i.ibb.co/xthTPNrX/5.jpg',
};

/** 首页英雄四图 URL，供预加载 */
export const HOME_HERO_CARD_IMAGE_URLS = Object.values(HERO_CARD_IMAGE);

/** 「智能硬件+应用服务」横向产品卡四图 URL，供预加载 */
const TEAM_PRODUCT_CARD_IMAGE: Record<(typeof CARD_IDS)[number], string> = {
  ring: 'https://i.ibb.co/FLXrp6qv/image.jpg',
  band: 'https://i.ibb.co/1t1FyW93/image.jpg',
  watch: 'https://i.ibb.co/YBjhmq8w/image.jpg',
  glasses: 'https://i.ibb.co/FL1q2zKP/image.jpg',
};

export const HOME_TEAM_PRODUCT_CARD_IMAGE_URLS = Object.values(TEAM_PRODUCT_CARD_IMAGE);

const PRODUCT_PAGE_LINK: Record<(typeof HERO_CARD_IDS)[number], string> = {
  ring: '/products/ring',
  band: '/products/band',
  watch: '/products/watch',
  glasses: '/products/glasses',
};

/** 卡片随图片比例；在原先「高度为等比约 85%」基础上再高 10% → 系数 0.935（0.85×1.1）。 */
function HomeHeroCard({ id }: { id: (typeof HERO_CARD_IDS)[number] }) {
  const { t } = useTranslation('common');
  const { withPath } = useLocalePath();
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  const aspectRatio = natural
    ? `${natural.w} / ${natural.h * 0.935}`
    : '32 / 30.86';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
      className="relative w-full flex-shrink-0 overflow-hidden rounded-none bg-surface-3/80 md:w-[min(88vw,560px)] md:max-w-[560px] md:rounded-xl"
      style={{ aspectRatio }}
    >
      <img
        src={HERO_CARD_IMAGE[id]}
        alt=""
        loading="eager"
        decoding="async"
        className={[
          'absolute inset-0 h-full w-full object-cover',
          id === 'ring' ? '-scale-x-100' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        referrerPolicy="no-referrer"
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }
        }}
      />
      <HomeHeroGlassPanel productId={id} />
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-4 px-6 pt-6 pb-8 md:p-6">
        <p className="whitespace-pre-line text-left text-[clamp(28px,8vw,36px)] font-normal leading-tight tracking-tight text-white drop-shadow-md md:text-[32px]">
          {t(`home.heroCards.${id}`)}
        </p>
        <Link
          to={withPath(PRODUCT_PAGE_LINK[id])}
          className="inline-flex w-fit rounded-full bg-white/15 px-5 py-2.5 text-[15px] font-normal text-white backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-white/25 border-none"
        >
          {t('home.heroCards.ctaLearn')}
        </Link>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const productScrollerRef = useRef<HTMLDivElement>(null);
  const productItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardMotion, setCardMotion] = useState(() =>
    CARD_IDS.map(() => ({ scale: 1, y: 0 }))
  );

  const updateProductScrollMotion = useCallback(() => {
    const scroller = productScrollerRef.current;
    if (!scroller) return;
    const sRect = scroller.getBoundingClientRect();
    if (sRect.width < 1) return;
    const centerX = sRect.left + sRect.width / 2;
    const normalize = Math.max(sRect.width * 0.45, 120);

    const next = CARD_IDS.map((_, i) => {
      const el = productItemRefs.current[i];
      if (!el) return { scale: 1, y: 0 };
      const r = el.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = cardCenter - centerX;
      const t = Math.min(Math.abs(dist) / normalize, 1);
      const scale = 1 - t * 0.12;
      const y = dist * 0.035;
      return { scale, y };
    });
    setCardMotion(next);
  }, []);

  useLayoutEffect(() => {
    updateProductScrollMotion();
  }, [updateProductScrollMotion]);

  useEffect(() => {
    const scroller = productScrollerRef.current;
    if (!scroller) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProductScrollMotion);
    };
    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(scroller);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
    };
  }, [updateProductScrollMotion]);

  return (
    <div className="relative w-full bg-white pb-[70px] pt-0 md:pt-8 md:pb-[70px]">
      <section className="relative z-10 mx-auto w-full max-w-7xl px-3 md:px-[170px]">
        <div className="mb-0 md:mb-8">
          <div className="hide-scrollbar -mx-3 flex flex-col gap-2 overflow-visible pb-0 md:mx-0 md:flex-row md:gap-2 md:overflow-x-auto md:pb-1">
            {HERO_CARD_IDS.map((id) => (
              <Fragment key={id}>
                <HomeHeroCard id={id} />
              </Fragment>
            ))}
          </div>
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 mt-[70px] flex flex-col gap-3"
        >
          <h2 className="text-[26px] font-normal leading-tight tracking-[-0.02em] text-ink">
            {t('home.team.heading1')}
          </h2>
          <h2 className="text-[26px] font-normal leading-tight tracking-[-0.02em] text-ink">
            {t('home.team.heading2')}
          </h2>
        </motion.div>

        <div
          ref={productScrollerRef}
          className="hide-scrollbar flex snap-x snap-mandatory items-start gap-2 overflow-x-auto pb-2 md:snap-none md:overflow-x-visible"
        >
          {CARD_IDS.map((id, index) => {
            const img = TEAM_PRODUCT_CARD_IMAGE[id];

            const brand = t(`home.team.cards.${id}.brand`);
            const category = t(`home.team.cards.${id}.category`);
            const subtitle = t(`home.team.cards.${id}.subtitle`);
            const title = [brand, category].map((s) => s.trim()).filter(Boolean).join(' ');
            const m = cardMotion[index] ?? { scale: 1, y: 0 };

            return (
              <div
                key={id}
                className="flex w-[88%] shrink-0 snap-start flex-col md:w-auto md:min-w-0 md:flex-[0_0_calc((100%-1.5rem)*0.225)] md:snap-none"
              >
                <motion.div
                  animate={{ scale: m.scale, y: m.y }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.35 }}
                  style={{ transformOrigin: 'center center' }}
                  className="w-full will-change-transform"
                >
                  <div
                    ref={(el) => {
                      productItemRefs.current[index] = el;
                    }}
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-zinc-950"
                  >
                    <img
                      src={img}
                      alt={brand}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      draggable={false}
                      onLoad={updateProductScrollMotion}
                    />

                    <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/55" />

                    <div className="absolute left-0 top-0 z-[2] max-w-[92%] p-5 text-left">
                      <p className="text-lg font-normal leading-snug tracking-tight text-white md:text-xl">
                        {title}
                      </p>
                      <p className="mt-3 text-base font-normal leading-snug text-white/95 md:text-lg">
                        {subtitle}
                      </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-[2] flex justify-start p-4">
                      <button
                        type="button"
                        className="pointer-events-auto inline-flex shrink-0 items-center justify-center rounded-full bg-white/55 px-5 py-2.5 text-[15px] font-normal text-ink backdrop-blur-xl transition-colors hover:bg-white/65 border-none"
                        style={{ WebkitBackdropFilter: 'blur(14px)' }}
                        onClick={() => navigate(withPath(STORE_LINK[id]))}
                      >
                        {t('home.team.cta')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
