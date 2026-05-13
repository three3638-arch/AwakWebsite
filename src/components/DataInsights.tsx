import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

const DIM_IDS = ['sleep', 'sports', 'weight', 'heart'] as const;

const DIM_VALUES: Record<(typeof DIM_IDS)[number], string[]> = {
  sleep: ['+23%', '14.2天', '95.3%', '+12分'],
  sports: ['+18.5%', '-22min', '4.8级', '98.1%'],
  weight: ['-4.5kg', '-3.2%', '+15%', '88天'],
  heart: ['62 bpm', '99.9%', '-12%', '≤5 bpm'],
};

const CHART_TYPES: Record<(typeof DIM_IDS)[number], 'line' | 'bar' | 'downward' | 'pulsing'> = {
  sleep: 'line',
  sports: 'bar',
  weight: 'downward',
  heart: 'pulsing',
};

const BAR_HEIGHTS = [72, 118, 54, 132, 96, 108, 64];

const easeStd: [number, number, number, number] = [0.4, 0, 0.2, 1];
const easeReveal: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DataInsights() {
  const { t } = useTranslation('common');
  const dimensions = useMemo(
    () =>
      DIM_IDS.map((id) => {
        const labels = t(`home.dataInsights.${id}.statLabels`, { returnObjects: true }) as string[];
        return {
          id,
          title: t(`home.dataInsights.${id}.title`),
          subtitle: t(`home.dataInsights.${id}.subtitle`),
          description: t(`home.dataInsights.${id}.description`),
          stats: DIM_VALUES[id].map((value, i) => ({ value, label: labels[i] ?? '' })),
          chartType: CHART_TYPES[id],
        };
      }),
    [t],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const activeData = dimensions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dimensions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dimensions.length]);

  return (
    <section
      id="data-insights"
      className="relative z-[3] box-border w-full py-10 max-lg:bg-gradient-to-b max-lg:from-[#f9fafb] max-lg:via-white max-lg:to-[#f5f6f9] lg:bg-[var(--white)] lg:py-0"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 wrap py-8 lg:py-0">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-stretch lg:gap-x-10 xl:gap-x-12">
          <div className="order-2 flex w-full flex-col lg:order-1 lg:min-h-0 lg:h-full lg:w-[60%] lg:max-w-[60%] lg:flex-shrink-0 lg:items-start lg:self-stretch">
            <motion.div
              initial={{ opacity: 0, y: 36, x: 24, filter: 'blur(14px)' }}
              whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: easeReveal }}
              className="home-data-chart-panel home-data-sheen home-shadow-allow relative flex min-h-0 w-full flex-1 flex-shrink-0 flex-col overflow-hidden rounded-[10px] border border-black/[0.08] bg-white/90 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:h-full lg:min-h-0 lg:max-w-[560px] lg:self-start lg:border-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none"
            >
              <div className="relative flex min-h-0 flex-1 flex-col lg:min-h-0">
                <div className="home-data-chart-area relative h-[200px] w-full flex-shrink-0 lg:flex lg:min-h-0 lg:h-[248px] lg:flex-col lg:justify-end">
                  <svg
                    viewBox="0 0 500 250"
                    preserveAspectRatio="xMinYMid meet"
                    className="home-data-chart-svg h-full w-full overflow-visible lg:h-[92%] lg:flex-shrink-0"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={50 * i}
                        x2="500"
                        y2={50 * i}
                        className="stroke-black/[0.08] lg:stroke-black/[0.1]"
                        strokeWidth="0.5"
                      />
                    ))}

                    <AnimatePresence>
                      {activeData.chartType === 'line' && (
                        <motion.path
                          key="line"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M 0 160 Q 150 140 250 80 T 500 40"
                          fill="none"
                          className="stroke-black/35 lg:stroke-black/40"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      )}
                      {activeData.chartType === 'downward' && (
                        <motion.path
                          key="downward"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M 0 40 Q 150 60 250 150 T 500 200"
                          fill="none"
                          className="stroke-black/35 lg:stroke-black/40"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      )}
                      {activeData.chartType === 'pulsing' && (
                        <motion.path
                          key="pulsing"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M 0 120 L 100 120 L 115 60 L 135 180 L 150 120 L 250 120 L 265 60 L 285 180 L 300 120 L 500 120"
                          fill="none"
                          className="stroke-black/35 lg:stroke-black/40"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      )}
                      {activeData.chartType === 'bar' && (
                        <g key="bar">
                          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                            const h = BAR_HEIGHTS[i] ?? 80;
                            return (
                              <motion.rect
                                key={i}
                                initial={{ height: 0, y: 200 }}
                                animate={{ height: h, y: 200 - h }}
                                x={70 + i * 55}
                                width="25"
                                className="fill-black/18 lg:fill-black/25"
                                rx="4"
                              />
                            );
                          })}
                        </g>
                      )}
                    </AnimatePresence>

                    <g
                      className="fill-[#6F7078] font-normal lg:fill-[#5c5c5f]"
                      style={{ fontSize: '12px', fontWeight: 400 }}
                    >
                      <text x="0" y="240">
                        {t('home.dataInsights.chartStart')}
                      </text>
                      <text x="250" y="240" textAnchor="middle">
                        {t('home.dataInsights.chartMid')}
                      </text>
                      <text x="500" y="240" textAnchor="end">
                        {t('home.dataInsights.chartEnd')}
                      </text>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="mt-5 flex-shrink-0 border-t border-black/10 pt-5 font-normal lg:mt-8 lg:border-black/10 lg:pt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`title-${currentIndex}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.4, ease: easeStd }}
                  >
                    <h3 className="mb-3 font-normal leading-[1.2] tracking-[-0.02em] text-[#080808] lg:mb-4 [font-size:clamp(1.125rem,1.85vw,1.375rem)]">
                      {activeData.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${currentIndex}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: easeStd }}
                    className="text-left text-[15px] font-normal leading-[1.55] text-[#444444] lg:text-[#3a3a3a]"
                  >
                    {activeData.description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col space-y-14 font-normal lg:order-2 lg:ml-0 lg:h-full lg:min-h-0 lg:w-[40%] lg:max-w-[40%] lg:flex-shrink-0 lg:justify-between lg:space-y-10">
            <motion.div
              className="space-y-6 font-normal lg:space-y-8"
              initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.15, ease: easeReveal }}
            >
              <h2 className="home-section-title text-[#080808] lg:hidden">
                {t('home.dataInsights.headline1')}
                <br />
                {t('home.dataInsights.headline2')}
              </h2>
              <h2 className="home-section-title hidden text-[#080808] lg:block lg:whitespace-nowrap">
                {t('home.dataInsights.headlineSingle')}
              </h2>
              <p className="home-section-lede hidden max-w-[42rem] text-[#6F7078] lg:block lg:max-w-[36rem]">
                {t('home.dataInsights.sectionIntro')}
              </p>
            </motion.div>

            <div className="home-data-dimension-tabs home-data-tabs-row flex w-full flex-nowrap gap-1 overflow-x-auto pb-1 font-normal [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2 lg:gap-2">
              {dimensions.map((dim, idx) => (
                <button
                  key={dim.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`home-data-dimension-tab inline-flex shrink-0 items-center justify-center rounded-[10px] border px-2 py-2 text-[10px] font-normal uppercase leading-tight tracking-wide transition-colors duration-500 min-h-[40px] min-w-0 sm:px-3 sm:text-[11px] md:px-4 md:text-[12px] lg:min-h-[44px] lg:flex-1 lg:basis-0 lg:px-3 lg:text-[clamp(9px,0.95vw,12px)] lg:tracking-widest ${
                    idx === currentIndex
                      ? 'border-[#DDF700] bg-[#DDF700] text-[#080808]'
                      : 'border-black/15 bg-transparent text-[#6F7078] hover:border-black/30 hover:text-[#080808]'
                  }`}
                >
                  <span className="block whitespace-nowrap">{dim.subtitle}</span>
                </button>
              ))}
            </div>

            <div className="home-data-stats-grid min-h-0 w-full overflow-visible font-normal lg:self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: easeStd }}
                  className="grid w-full grid-cols-2 gap-x-4 gap-y-4 lg:gap-x-4 lg:gap-y-4"
                >
                  {activeData.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-1 rounded-[10px] lg:bg-[#f2f2f2] lg:p-[12px]">
                      <span className="block whitespace-nowrap font-normal leading-none tracking-[-0.02em] text-[#080808] [font-size:clamp(1.04rem,1.68vw,1.68rem)] md:[font-size:clamp(1.26rem,2.24vw,1.68rem)]">
                        {stat.value}
                      </span>
                      <h4 className="whitespace-nowrap text-[10px] font-normal uppercase leading-[1.4] tracking-[0.18em] text-[#6F7078] lg:text-[10.5px] lg:tracking-[0.12em]">
                        {stat.label}
                      </h4>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
