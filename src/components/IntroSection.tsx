import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Gift, HeartPulse, LayoutGrid, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const easeStd: [number, number, number, number] = [0.4, 0, 0.2, 1];
const easeReveal: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -32, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.08, ease: easeReveal },
  },
};

function useDesktopLg() {
  const [ok, setOk] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const fn = () => setOk(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return ok;
}

function IntroAppVisual() {
  const isDesktop = useDesktopLg();
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), {
    stiffness: 260,
    damping: 34,
    mass: 0.55,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3.8, -3.8]), {
    stiffness: 260,
    damping: 34,
    mass: 0.55,
  });

  const shadowLift = useTransform(rotateY, (ry) => {
    const t = Math.min(Math.max(ry / 5, -1), 1);
    const y = 28 + t * 12;
    const blur = 52 + Math.abs(t) * 18;
    const alpha = 0.09 + Math.abs(t) * 0.04;
    return `0 ${y}px ${blur}px rgba(0,0,0,${alpha})`;
  });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 0.78);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 0.78);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col"
      initial={
        isDesktop ? { opacity: 0, y: 48, filter: 'blur(14px)' } : { opacity: 0, x: 36, filter: 'blur(14px)' }
      }
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 1.28, delay: 0.08, ease: easeReveal }}
    >
      <div
        ref={wrapRef}
        className="relative mx-auto flex h-full min-h-[280px] w-full max-w-[min(100%,520px)] flex-1 items-center justify-center overflow-visible px-4 py-6 lg:max-h-none lg:max-w-none lg:min-h-0 lg:flex-1 lg:px-10 lg:py-0"
        onMouseMove={isDesktop ? handleMove : undefined}
        onMouseLeave={isDesktop ? handleLeave : undefined}
      >
        <motion.div
          className="relative flex h-full max-h-full w-full max-w-full items-center justify-center [transform-style:preserve-3d] max-lg:[transform:none]"
          style={
            isDesktop
              ? {
                  rotateX,
                  rotateY,
                  transformPerspective: 1180,
                }
              : undefined
          }
        >
          <motion.img
            src="https://i.ibb.co/RkYkRwH5/app.png"
            alt="AwakHealth App Interface"
            style={isDesktop ? { boxShadow: shadowLift } : undefined}
            className="home-float-slow relative z-10 h-auto w-full origin-center cursor-grab object-contain active:cursor-grabbing max-lg:!animate-none lg:h-full lg:max-h-full lg:w-auto lg:max-w-full lg:scale-[1.2] lg:shadow-[0_32px_72px_rgba(0,0,0,0.12)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

const INTRO_STAT_ICONS = [Stethoscope, Gift, HeartPulse, LayoutGrid] as const;

export default function IntroSection() {
  const { t } = useTranslation('common');
  const introStats = useMemo(
    () => t('home.intro.stats', { returnObjects: true }) as { label: string; value: string; desc: string }[],
    [t],
  );
  const introTitleLines = useMemo(
    () =>
      t('home.intro.title')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    [t],
  );

  return (
    <section
      id="intro-app"
      className="intro-app-spec relative z-[3] overflow-visible bg-gradient-to-b from-[#f7f8fa] via-white to-[#f4f5f8] py-0 text-[#080808] lg:flex lg:min-h-0 lg:flex-col"
    >
      <motion.div
        className="relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col justify-center wrap py-0 lg:min-h-0 lg:flex-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="intro-app-cols flex flex-col items-center gap-12 lg:min-h-0 lg:items-start lg:overflow-visible">
          <div className="flex w-full max-w-3xl shrink-0 flex-col justify-center lg:max-w-none lg:min-h-0 lg:w-full lg:justify-start">
            <div className="intro-app-content mb-4 lg:mb-0">
              <motion.div variants={itemVariants} className="relative max-w-xl overflow-hidden lg:max-w-none">
                <h2 className="intro-app-section-h intro-app-title-one-line home-section-title relative z-10 flex flex-row flex-wrap gap-x-2 text-[#080808] [&>span]:inline [&>span]:whitespace-nowrap">
                  {introTitleLines.map((line, i) => (
                    <span key={i} className="inline whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </h2>
              </motion.div>

              <motion.p variants={itemVariants} className="intro-app-desc intro-app-desc-one-line max-w-xl lg:max-w-none">
                {t('home.intro.body')}
              </motion.p>

              <motion.div variants={itemVariants} className="intro-app-kpis">
                {introStats.map((stat, i) => {
                  const Icon = INTRO_STAT_ICONS[i] ?? Stethoscope;
                  return (
                    <div key={`${stat.label}-${i}`} className="intro-feat-card intro-stat-card">
                      <span className="intro-feat-card-icon" aria-hidden>
                        <Icon className="h-5 w-5" strokeWidth={1.35} />
                      </span>
                      <div className="intro-feat-card-body">
                        <span className="intro-feat-card-title">{stat.label}</span>
                        <span className="intro-feat-card-tag intro-stat-card-desc">{stat.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          <div className="relative flex w-full min-h-0 min-w-0 shrink-0 items-stretch justify-center overflow-visible lg:min-h-0 lg:self-stretch">
            <IntroAppVisual />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
