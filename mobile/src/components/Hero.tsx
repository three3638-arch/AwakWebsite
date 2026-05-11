import type { Variants } from 'motion/react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { fadeUp } from '@/lib/motion';

/** 首屏背景图，供首页预加载 */
export const HERO_BACKGROUND_IMAGE_URL = 'https://i.ibb.co/6JqSk9k4/hero.png';

const heroStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.12,
    },
  },
};

export default function Hero() {
  const { t } = useTranslation('common');

  const subtitleParts = t('home.hero.subtitle')
    .split(/→/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="relative mb-0 flex min-h-[100dvh] min-h-0 w-full flex-col overflow-hidden bg-black px-4 pt-20 pb-12 text-white md:px-[170px] md:pt-16 md:pb-20">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
        <div className="absolute left-0 top-0 h-[min(92vh,900px)] w-[min(155vw,1500px)] overflow-hidden max-md:-translate-y-6 md:h-[min(94vh,960px)] md:translate-y-0 md:w-[min(98vw,1500px)]">
          <img
            src={HERO_BACKGROUND_IMAGE_URL}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-full w-[128%] max-w-none origin-left object-cover object-left max-md:-translate-x-[10%] max-md:scale-[0.762] max-md:object-[0%_32%] md:-translate-x-[10%] md:scale-[0.952] md:object-[0%_42%]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="relative z-20 flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-end pb-10 pt-8 md:pb-16 md:pt-12">
          <motion.div
            className="flex max-w-3xl flex-col items-start text-left max-md:mt-10 max-md:translate-y-4 md:mt-0 md:translate-y-0"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              className="max-w-[min(100%,24ch)] text-[clamp(28px,8vw,36px)] font-normal leading-none tracking-tighter text-white md:text-[clamp(40px,12vw,72px)]"
            >
              {t('home.hero.title')}
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-left text-base font-normal leading-[1.7] tracking-tight text-white/75 md:text-[18px]"
            >
              {subtitleParts.map((part, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-white/55">→</span>}
                  <span>{part}</span>
                </span>
              ))}
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-1.5 max-w-xl text-left text-sm font-normal leading-[1.75] text-white/60 md:text-[15px]"
            >
              {t('home.hero.trust')}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
