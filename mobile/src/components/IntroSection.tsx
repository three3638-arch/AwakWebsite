import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, ShieldCheck, Sparkles } from 'lucide-react';
import { easeSpring, fadeUp, staggerContainer, viewport } from '@/lib/motion';

const FEATURE_ICONS = [ClipboardList, ShieldCheck, Sparkles] as const;

type AppTabId = 'home' | 'sleep' | 'heart' | 'stress' | 'profile';

const APP_TAB_IMAGES: Record<AppTabId, string> = {
  home: 'https://i.ibb.co/tpMDvC7k/Mask-group.png',
  sleep: 'https://i.ibb.co/PvzP0gy5/Mask-group-1.png',
  heart: 'https://i.ibb.co/bj67Nv2q/Mask-group-2.png',
  stress: 'https://i.ibb.co/S4tH0wQH/Mask-group-3.png',
  profile: 'https://i.ibb.co/wFgYbt1Q/Mask-group-4.png',
};

/** 首页「全链路健康生态」区块上方 App 截图，供预加载 */
export const INTRO_APP_TAB_IMAGE_URLS = Object.values(APP_TAB_IMAGES);

const APP_TABS: { id: AppTabId; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'sleep', label: '睡眠' },
  { id: 'heart', label: '心率' },
  { id: 'stress', label: '压力' },
  { id: 'profile', label: '我的' },
];

export default function IntroSection() {
  const { t } = useTranslation('common');
  const [appTab, setAppTab] = useState<AppTabId>('home');

  const featureCards = useMemo(
    () =>
      t('home.intro.featureCards', { returnObjects: true }) as {
        line1: string;
        line2: string;
        line3: string;
      }[],
    [t],
  );

  const titleLines = t('home.intro.title').split('\n');

  return (
    <section className="relative overflow-hidden bg-black py-10 text-left text-white md:py-14">
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="flex flex-col items-stretch gap-8">
          <motion.div
            variants={fadeUp}
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: easeSpring }}
            className="w-full max-w-lg"
          >
            <div className="relative pt-[70px]">
              <div className="flex justify-center overflow-visible">
                <div className="w-full translate-x-[40px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={appTab}
                      src={APP_TAB_IMAGES[appTab]}
                      alt="AwakHealth App"
                      className="h-auto w-full origin-center scale-[1.15] object-contain"
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22, ease: easeSpring }}
                    />
                  </AnimatePresence>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-[10px] flex justify-center px-2 pb-2 pt-8">
                <div
                  className="inline-flex max-w-full rounded-[99px] border-none bg-white/12 px-2 py-2 backdrop-blur-xl"
                  style={{ WebkitBackdropFilter: 'blur(14px)' }}
                >
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    {APP_TABS.map(({ id, label }) => {
                      const active = appTab === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setAppTab(id)}
                          className={[
                            'shrink-0 min-w-[64px] rounded-[99px] px-5 py-2.5 text-center text-[12px] font-medium transition-colors sm:min-w-[76px] sm:px-6 sm:py-3 sm:text-[13px]',
                            active
                              ? 'bg-white text-black'
                              : 'bg-white/12 text-white/85 backdrop-blur-md hover:bg-white/20',
                          ].join(' ')}
                          style={active ? undefined : { WebkitBackdropFilter: 'blur(8px)' }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            <h2
              className="text-[26px] font-normal leading-[1.35] tracking-tight text-white"
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {titleLines.map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </h2>
            <p className="text-[17px] font-normal leading-[1.7] tracking-[-0.01em] text-white/75">
              {t('home.intro.appLine')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
            {featureCards.map((card, i) => {
              const Icon = FEATURE_ICONS[i] ?? Sparkles;
              const detailLine = [card.line2, card.line3].filter(Boolean).join(' · ');
              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    y: 26,
                    x: i % 2 === 0 ? -20 : 20,
                    scale: 0.96,
                  }}
                  whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.58,
                    delay: i * 0.14,
                    ease: easeSpring,
                  }}
                  className="text-left"
                >
                  <div className="flex flex-col items-start gap-2">
                    <Icon
                      className="h-5 w-5 shrink-0 text-white/55"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <p className="text-[17px] font-semibold leading-[1.35] tracking-tight text-white">
                      {card.line1}
                    </p>
                    <p className="text-[14px] font-normal leading-relaxed text-white/65">
                      {detailLine}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
