import { motion } from 'motion/react';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

const easeStd: [number, number, number, number] = [0.4, 0, 0.2, 1];
const easeReveal: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HERO_IMAGE = 'https://i.ibb.co/ZzvvBygT/187917b50e7a4546851e621090afe664.png';

export default function Hero() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { withPath } = useLocalePath();

  const title = t('home.hero.title');
  const titleChars = useMemo(() => Array.from(title), [title]);
  /** PC 参考稿：双空格分段，第二段用 <em> 着色 */
  const titleParts = useMemo(() => title.split(/\s{2,}/).filter(Boolean), [title]);
  const subtitleRaw = t('home.hero.subtitle');
  const subtitleSegments = useMemo(
    () => subtitleRaw.split('|').map((s) => s.trim()).filter(Boolean),
    [subtitleRaw],
  );

  const ctaBuy = (
    <motion.button
      type="button"
      whileHover={{
        borderColor: 'rgba(221, 247, 0, 1)',
        y: -2,
        boxShadow: '0 20px 48px rgba(0,0,0,0.35)',
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.45, ease: easeStd }}
      onClick={() => navigate(withPath('/store'))}
      className="home-shadow-allow flex h-12 min-h-[48px] min-w-[160px] items-center justify-center rounded-[12px] border border-white bg-white px-6 text-[14px] font-medium tracking-wide text-black shadow-[0_16px_48px_rgba(0,0,0,0.25)] lg:px-8"
    >
      {t('home.hero.ctaBuy')}
    </motion.button>
  );

  const ctaApp = (
    <motion.button
      type="button"
      whileHover={{
        borderColor: 'rgba(221, 247, 0, 1)',
        color: '#ddf700',
        y: -2,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.45, ease: easeStd }}
      className="flex h-12 min-h-[48px] min-w-[160px] items-center justify-center rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-white/[0.04] px-6 text-[14px] font-medium tracking-wide text-white backdrop-blur-md lg:px-8"
    >
      {t('home.hero.ctaApp')}
    </motion.button>
  );

  return (
    <section
      id="hero"
      className="relative z-[3] mb-0 flex h-full min-h-0 w-full flex-col items-end justify-center overflow-hidden bg-transparent px-6 pb-8 pt-20 text-[#F5F5F5] md:pb-10 md:pt-20 lg:h-full lg:min-h-0 lg:w-full lg:items-center lg:justify-center lg:px-0 lg:pb-0 lg:pt-0 lg:text-[var(--white)]"
    >
      <img
        src={HERO_IMAGE}
        alt=""
        className="pointer-events-none z-[50] h-full w-full origin-center scale-[0.7] select-none object-contain object-center max-lg:absolute max-lg:inset-0 lg:relative lg:col-start-1 lg:row-start-1 lg:min-h-[680px] lg:min-w-0"
        referrerPolicy="no-referrer"
        draggable={false}
      />

      {/* 移动端文案区（层级高于图片，避免被盖住） */}
      <div className="relative z-[60] wrap mx-auto flex w-full flex-col items-end pb-4 text-right md:pb-6 lg:hidden">
        <div className="flex w-full max-w-7xl flex-col items-end lg:max-w-[680px]">
          <h1 className="font-medium leading-[1.03] tracking-[-0.03em] text-[#F5F5F5] [font-size:clamp(3.5rem,5.5vw,4.5rem)]">
            {titleChars.map((ch, i) => (
              <motion.span
                key={`${i}-${ch}`}
                className="inline-block"
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.08 + i * 0.032,
                  duration: 1.05,
                  ease: easeReveal,
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.55, duration: 1.15, ease: easeReveal }}
            className="home-section-lede mt-8 flex max-w-xl flex-wrap justify-end tracking-normal text-[#A7A7B2] lg:mt-10"
          >
            {t('home.hero.subtitle')}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.85, duration: 1.15, ease: easeReveal }}
            className="mt-10 flex flex-wrap justify-end gap-5 lg:mt-12 lg:gap-6"
          >
            {ctaBuy}
            {ctaApp}
          </motion.div>
        </div>
      </div>

      {/* PC 文案区（右侧单独铺色，与左侧纯图分离） */}
      <div className="hero-content relative z-[60] hidden w-full min-w-0 flex-col lg:col-start-2 lg:row-start-1 lg:flex">
        <div className="hero-label">{t('home.hero.label')}</div>
        <h1 className="hero-title">
          {titleParts.length >= 2 ? (
            <>
              {titleParts[0]}
              <em> {titleParts[1]}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <p className="hero-sub hero-sub-split">
          {subtitleSegments.map((seg, i) => (
            <Fragment key={`${seg}-${i}`}>
              {i > 0 ? (
                <span className="hero-sub-pipe" aria-hidden>
                  |
                </span>
              ) : null}
              <span className="hero-sub-part">{seg}</span>
            </Fragment>
          ))}
        </p>
        <div className="hero-btns">
          {ctaBuy}
          {ctaApp}
        </div>
      </div>

      <div className="scroll-hint hidden lg:flex" aria-hidden>
        <div className="scroll-line" />
        <span className="scroll-text">{t('home.hero.scrollHint')}</span>
      </div>
    </section>
  );
}
