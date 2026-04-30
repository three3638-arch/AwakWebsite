import React, { useMemo, useState, useEffect } from 'react';
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
          color: '#080808',
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
    <section className="bg-[#F5F5F3] py-24 px-6 md:px-[170px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Left Content - Now a Narrative Carousel */}
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-[#080808] text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                {t('home.dataInsights.headline1')}<br />
                {t('home.dataInsights.headline2')}
              </h2>
              <div className="h-[2px] w-24 bg-black" />
            </div>

            {/* Dimensional Toggle (Indicator) */}
            <div className="flex gap-4">
              {dimensions.map((dim, idx) => (
                <button 
                  key={dim.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${
                    idx === currentIndex ? 'bg-black text-white border-black' : 'text-black/30 border-black/10'
                  }`}
                >
                  {dim.subtitle}
                </button>
              ))}
            </div>

            {/* Stats Flip-up Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-12 overflow-hidden h-[240px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-2 gap-x-12 gap-y-12 w-full col-span-2"
                >
                  {activeData.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <span className="text-3xl md:text-5xl font-black text-[#080808] tracking-tighter block leading-none">
                        {stat.value}
                      </span>
                      <h4 className="text-[#86868B] text-[11px] font-bold tracking-[0.2em] uppercase">{stat.label}</h4>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Content - Synchronized Dynamic Chart */}
          <div className="flex-1 w-full lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 relative overflow-hidden flex flex-col"
            >
              <div className="flex-1 min-h-0 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeData.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-[#080808] text-2xl md:text-2xl font-black mb-10 tracking-tight">{activeData.title}</h3>
                  </motion.div>
                </AnimatePresence>

                {/* Dynamic SVG Chart */}
                <div className="relative w-full aspect-[16/10]">
                  <svg viewBox="0 0 500 250" className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1="0" y1={50 * i} x2="500" y2={50 * i} stroke="#000" strokeWidth="0.5" strokeOpacity="0.05" />
                    ))}
                    
                    {/* Values Redrawing based on context */}
                    <AnimatePresence>
                      {activeData.chartType === 'line' && (
                        <motion.path 
                          key="line"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M 50 160 Q 150 140 250 80 T 450 40"
                          fill="none" stroke="#D1D1D6" strokeWidth="6" strokeLinecap="round"
                        />
                      )}
                      {activeData.chartType === 'downward' && (
                        <motion.path 
                          key="downward"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M 50 40 Q 150 60 250 150 T 450 200"
                          fill="none" stroke="#D1D1D6" strokeWidth="6" strokeLinecap="round"
                        />
                      )}
                      {activeData.chartType === 'pulsing' && (
                        <motion.path 
                          key="pulsing"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d="M 50 120 L 100 120 L 115 60 L 135 180 L 150 120 L 250 120 L 265 60 L 285 180 L 300 120 L 450 120"
                          fill="none" stroke="#D1D1D6" strokeWidth="4" strokeLinecap="round"
                        />
                      )}
                      {activeData.chartType === 'bar' && (
                        <g key="bar">
                          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.rect 
                              key={i}
                              initial={{ height: 0, y: 200 }}
                              animate={{ height: 20 + Math.random() * 150, y: 200 - (20 + Math.random() * 150) }}
                              x={70 + i * 55} width="25" fill="#D1D1D6" rx="4"
                            />
                          ))}
                        </g>
                      )}
                    </AnimatePresence>

                    {/* Labels and Axis */}
                    <g className="text-[#999] font-black" style={{ fontSize: '10px' }}>
                      <text x="50" y="240">{t('home.dataInsights.chartStart')}</text>
                      <text x="250" y="240" textAnchor="middle">{t('home.dataInsights.chartMid')}</text>
                      <text x="450" y="240" textAnchor="end">{t('home.dataInsights.chartEnd')}</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Moved description here */}
              <div className="mt-8 pt-8 border-t border-black/5">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={`desc-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#555555]/60 text-base leading-relaxed font-medium text-right"
                  >
                    {activeData.description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
