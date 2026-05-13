import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

const CARD_IDS = ['ring', 'band', 'watch', 'glasses'] as const;

const PRODUCT_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/products/ring',
  band: '/products/band',
  watch: '/products/watch',
  glasses: '/products/glasses',
};

const STORE_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/store/ring',
  band: '/store/bracelet',
  watch: '/store/watch',
  glasses: '/store/glasses',
};

export default function TeamSection() {
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <section className="relative z-[3] m-0 mt-0 w-full bg-transparent px-6 py-8 md:px-8 md:py-10 lg:m-0 lg:mt-0 lg:h-[100vh] lg:max-h-[100vh] lg:min-h-0 lg:overflow-hidden lg:p-0 lg:px-0 lg:py-0">
      {/* 桌面：顶部多段黑→透明，避免硬分割 */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[55] hidden h-[22%] min-h-[140px] lg:block"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 14%, rgba(0,0,0,0.28) 32%, rgba(0,0,0,0.12) 52%, rgba(0,0,0,0.04) 72%, rgba(0,0,0,0.015) 88%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden
      />

      {/* 四图：lg 全宽满高 + divide 细线；小屏 2×2 / md 四列 */}
      <div className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-[rgba(255,255,255,0.1)] md:grid-cols-4 lg:absolute lg:inset-x-0 lg:top-[14%] lg:h-[82%] lg:grid lg:min-h-0 lg:grid-cols-4 lg:gap-0 lg:divide-x">
        {CARD_IDS.map((id, index) => {
          const img =
            id === 'ring'
              ? 'https://i.ibb.co/FLXrp6qv/image.jpg'
              : id === 'band'
                ? 'https://i.ibb.co/1t1FyW93/image.jpg'
                : id === 'watch'
                  ? 'https://i.ibb.co/YBjhmq8w/image.jpg'
                  : 'https://i.ibb.co/FL1q2zKP/image.jpg';

          const brand = t(`home.team.cards.${id}.brand`);
          const category = t(`home.team.cards.${id}.category`);
          const subtitle = t(`home.team.cards.${id}.subtitle`);

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.15, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="group relative flex min-h-[42vw] cursor-pointer flex-col overflow-hidden bg-neutral-900/90 sm:min-h-[36vw] md:min-h-0 md:aspect-[3/5] md:max-h-[min(72vh,720px)] lg:min-h-0 lg:max-h-none lg:aspect-auto"
              onClick={() => navigate(withPath(PRODUCT_LINK[id]))}
            >
              <img
                src={img}
                alt={brand}
                className="home-float-slow absolute inset-0 h-full w-full max-lg:!animate-none object-cover opacity-90 transition-all duration-[1.4s] ease-out group-hover:scale-[1.02] group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />

              <div
                className="pointer-events-none absolute inset-0 z-[20] bg-gradient-to-t from-black/75 via-black/25 to-transparent lg:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[20] hidden bg-gradient-to-b from-black/60 via-black/20 to-transparent lg:block"
                aria-hidden
              />

              <div className="pointer-events-none absolute inset-0 z-[100] flex max-w-full flex-col items-center justify-center px-4 text-center md:px-6 max-lg:pb-10 lg:items-start lg:justify-start lg:px-8 lg:pb-8 lg:pt-10 lg:text-left">
                <h3 className="font-medium uppercase leading-[1.15] tracking-[-0.02em] text-[#FFFFFF] [font-size:clamp(1.75rem,2.2vw,2rem)]">
                  {brand}
                </h3>
                <p className="mt-1 max-w-[95%] text-[12px] font-normal uppercase leading-[1.4] tracking-widest text-[#FFFFFF] md:text-[13px] md:tracking-[0.2em] lg:max-w-[18rem]">
                  {category}
                </p>
                {subtitle?.trim() ? (
                  <p className="mt-2 max-w-[min(95%,280px)] text-[13px] font-normal leading-[1.5] text-[#FFFFFF] md:text-[14px] lg:max-w-[16rem]">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              <div className="absolute inset-x-0 bottom-0 z-[110] flex translate-y-3 justify-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <button
                  type="button"
                  className="pointer-events-auto mb-4 rounded-[12px] border border-[rgba(255,255,255,0.14)] bg-white px-8 py-2.5 text-sm font-medium text-black transition-colors hover:border-[#DDF700] md:px-10 md:py-3 lg:border-white/18 lg:bg-black/45 lg:text-white lg:backdrop-blur-xl lg:hover:border-white/28 lg:hover:bg-black/58"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(withPath(STORE_LINK[id]));
                  }}
                >
                  {t('home.team.cta')} <span className="text-lg">→</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
