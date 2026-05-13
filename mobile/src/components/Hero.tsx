import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/** 首屏背景图，供首页预加载 */
export const HERO_BACKGROUND_IMAGE_URL = 'https://i.ibb.co/6JqSk9k4/hero.png';

const easeStd: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function Hero() {
  const { t } = useTranslation('common');

  const subtitleParts = t('home.hero.subtitle')
    .split(/→/)
    .map((s) => s.trim())
    .filter(Boolean);

  const title = t('home.hero.title');
  const titleChars = useMemo(() => Array.from(title), [title]);

  return (
    <section className="relative mb-0 flex min-h-[100dvh] min-h-0 w-full flex-col overflow-hidden bg-black px-6 pb-12 pt-16 text-white md:px-[168px] md:pb-20 md:pt-16">
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
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[42%] min-h-[100px]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 22%, rgba(0,0,0,0.10) 48%, rgba(0,0,0,0.03) 72%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] min-h-[140px]"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.48) 18%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.08) 68%, rgba(0,0,0,0.02) 88%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-20 flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-end pb-10 pt-8 md:pb-16 md:pt-12">
          <div className="flex max-w-3xl flex-col items-start text-left max-md:mt-10 max-md:translate-y-4 md:mt-0 md:translate-y-0">
            <h1 className="max-w-[min(100%,24ch)] text-[clamp(28px,8vw,36px)] font-medium leading-none tracking-[-0.02em] text-white md:text-[clamp(40px,12vw,72px)]">
              {titleChars.map((ch, i) => (
                <motion.span
                  key={`${i}-${ch}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + i * 0.035,
                    duration: 0.55,
                    ease: easeStd,
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6, ease: easeStd }}
              className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-left text-base font-normal leading-[1.7] tracking-[-0.02em] text-[#a1a1aa] md:text-[18px]"
            >
              {subtitleParts.map((part, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#a1a1aa]/70">→</span>}
                  <span>{part}</span>
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.6, ease: easeStd }}
              className="mt-2 max-w-xl text-left text-sm font-normal leading-[1.75] text-[#a1a1aa] md:text-[15px]"
            >
              {t('home.hero.trust')}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
