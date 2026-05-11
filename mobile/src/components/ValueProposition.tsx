import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Activity, Apple, Brain, ListChecks, Moon, Sunrise } from 'lucide-react';

type LoopCard = { icon: string; title: string; desc: string };

type DisplayIconKey = 'dawn' | 'stress' | 'activity' | 'nutrition' | 'review' | 'nightRest';

const RULER_STRIP_W = 10;
const RULER_VIEW_W = 48;
const SPINE_X = 1;
const CONNECTOR_PULLBACK = RULER_STRIP_W - SPINE_X; // 9px

const MINOR_TICK_STEP = 10;

/** 长臂：清晨 / 白天 / 夜晚日终 */
const LONG_ARM_W = 'w-[80px] md:w-[92px]';
const SHORT_ARM_W = 'w-6 md:w-[30px]';
const DOT_SIZE = 'w-[7px] h-[7px] md:w-[8px] md:h-[8px]';
const DOT_TO_CARD_GAP_PX = 16;

const DISPLAY_ICONS: DisplayIconKey[] = [
  'dawn',
  'stress',
  'activity',
  'nutrition',
  'review',
  'nightRest',
];

function ConnectorArm({ isLong }: { isLong: boolean }) {
  return (
    <div className="relative flex items-center">
      <div className={['h-px', isLong ? 'bg-white/50' : 'bg-white/40', isLong ? LONG_ARM_W : SHORT_ARM_W].join(' ')} />
    </div>
  );
}

function LoopLucideIcon({ iconKey }: { iconKey: DisplayIconKey }) {
  const cls = 'h-5 w-5 shrink-0 text-white/85';
  switch (iconKey) {
    case 'dawn':
      return <Sunrise className={cls} strokeWidth={1.5} aria-hidden />;
    case 'stress':
      return <Brain className={cls} strokeWidth={1.5} aria-hidden />;
    case 'nutrition':
      return <Apple className={cls} strokeWidth={1.5} aria-hidden />;
    case 'review':
      return <ListChecks className={cls} strokeWidth={1.5} aria-hidden />;
    case 'nightRest':
      return <Moon className={cls} strokeWidth={1.5} aria-hidden />;
    case 'activity':
    default:
      return <Activity className={cls} strokeWidth={1.5} aria-hidden />;
  }
}

export default function ValueProposition() {
  const { t } = useTranslation('common');

  const cards = useMemo(() => {
    const all = t('home.valueLoop.cards', { returnObjects: true }) as LoopCard[];
    return all.slice(0, 6).map((c, i) => ({
      title: c.title,
      desc: c.desc,
      iconKey: DISPLAY_ICONS[i] ?? 'activity',
    }));
  }, [t]);

  const rulerHeight = Math.max(720, cards.length * 200);
  const minorTicks = useMemo(() => {
    const count = Math.ceil(rulerHeight / MINOR_TICK_STEP) + 6;
    return Array.from({ length: count }, (_, i) => ({
      y: i * MINOR_TICK_STEP,
      len: 10 + ((i * 3) % 8),
      op: 0.22 + ((i * 7) % 12) / 38,
    }));
  }, [rulerHeight]);

  const majorArms = useMemo(() => {
    return cards.map((_, idx) => ({
      idx,
      isLong: idx % 2 === 0,
    }));
  }, [cards]);

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-base px-5 py-18 text-fg-primary md:px-[170px] md:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 85% at 100% 0%, rgba(120,155,255,0.22) 0%, rgba(12,16,28,0.0) 58%), linear-gradient(180deg, rgba(12,16,28,0.82) 0%, rgba(5,7,15,0.98) 58%, rgba(5,7,15,1) 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1100px]">
        <div className="mb-8 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-1 text-[26px] font-normal leading-[1.35] tracking-tight text-fg-primary md:text-[26px]"
          >
            {t('home.valueLoop.title')
              .split('\n')
              .map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-[16px] font-normal leading-[1.7] text-fg-secondary md:text-[18px]"
          >
            {t('home.valueLoop.subtitle')}
          </motion.p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0"
            style={{ width: `${RULER_STRIP_W}px` }}
            aria-hidden
          >
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${RULER_VIEW_W} ${Math.max(400, rulerHeight)}`}
              preserveAspectRatio="none"
            >
              <line
                x1={SPINE_X}
                y1="0"
                x2={SPINE_X}
                y2={Math.max(400, rulerHeight)}
                stroke="white"
                strokeOpacity="0.66"
                strokeWidth="12"
              />
              <line
                x1="3.5"
                y1="0"
                x2="3.5"
                y2={Math.max(400, rulerHeight)}
                stroke="white"
                strokeOpacity="0.28"
                strokeWidth="8"
              />

              {minorTicks.map((tick, i) => (
                <line
                  key={i}
                  x1={SPINE_X}
                  y1={tick.y}
                  x2={SPINE_X + tick.len}
                  y2={tick.y}
                  stroke="white"
                  strokeOpacity={tick.op}
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>

          <div className="pl-[10px]" style={{ paddingLeft: `${RULER_STRIP_W}px` }}>
            <div className="flex flex-col gap-y-4 md:gap-y-5">
              {cards.map((card, idx) => (
                <div
                  key={`${idx}-${card.title}`}
                  className="relative flex flex-row items-center"
                  style={{ gap: `${DOT_TO_CARD_GAP_PX}px` }}
                >
                  <div
                    className="flex shrink-0 items-center"
                    style={{ marginLeft: `-${CONNECTOR_PULLBACK}px` }}
                  >
                    <ConnectorArm isLong={majorArms[idx]?.isLong ?? false} />

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.55 }}
                      transition={{
                        delay: idx * 0.15,
                        type: 'spring',
                        stiffness: 320,
                        damping: 22,
                      }}
                      className={[DOT_SIZE, 'rounded-full bg-white z-10'].join(' ')}
                      style={{ marginLeft: '-4px' }}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, x: 24 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{
                      delay: idx * 0.15 + 0.06,
                      duration: 0.52,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className={[
                      'flex min-h-[118px] w-full max-w-[200px] shrink-0 flex-col justify-start rounded-lg px-4 py-3.5 md:max-w-[216px] md:min-h-[126px]',
                      'bg-white/10 backdrop-blur-xl border-none',
                    ].join(' ')}
                  >
                    <div className="flex flex-col items-start text-left">
                      <LoopLucideIcon iconKey={card.iconKey} />
                      <h3 className="mt-2 text-[16px] font-semibold leading-snug tracking-tight text-white">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] font-normal leading-relaxed text-white/65">
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
