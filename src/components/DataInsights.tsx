import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const dimensions = [
  {
    id: 'sleep',
    title: '目标用户睡眠评分趋势对比',
    subtitle: '睡眠质量',
    description: '典型目标用户A：入睡潜伏期从 53min 显著降低至 22min，睡眠评分持续提升。',
    stats: [
      { value: '+23%', label: '深度睡眠提升' },
      { value: '14.2天', label: '异常预警提前' },
      { value: '95.3%', label: '睡眠分期准确率' },
      { value: '+12分', label: '平均评分增幅' }
    ],
    chartType: 'line',
    color: '#080808'
  },
  {
    id: 'sports',
    title: '有氧运动能力（VO₂Max）增幅',
    subtitle: '运动提升',
    description: '遵循科学训练建议，高强度运动后恢复时长缩短了 35%。',
    stats: [
      { value: '+18.5%', label: 'VO₂Max 提升' },
      { value: '-22min', label: '心率恢复时长' },
      { value: '4.8级', label: '平均体能等级' },
      { value: '98.1%', label: '动作识别准确率' }
    ],
    chartType: 'bar',
    color: '#080808'
  },
  {
    id: 'weight',
    title: '目标用户体脂率与BMI变化曲线',
    subtitle: '体重下降',
    description: '通过精准代谢监测，目标用户平均在 12 周内实现了 4.5kg 的健康体脂下降。',
    stats: [
      { value: '-4.5kg', label: '平均减重' },
      { value: '-3.2%', label: '体脂率下降' },
      { value: '+15%', label: '基础代谢提升' },
      { value: '88天', label: '持续达标天数' }
    ],
    chartType: 'downward',
    color: '#080808'
  },
  {
    id: 'heart',
    title: '静息心率稳定性监测报告',
    subtitle: '心率正常',
    description: '7x24小时全天候监测，静息心率波动范围回归至健康基准线。',
    stats: [
      { value: '62 bpm', label: '平均静息心率' },
      { value: '99.9%', label: '房颤早搏监测' },
      { value: '-12%', label: '压力指数降低' },
      { value: '≤5 bpm', label: '昼夜波动差' }
    ],
    chartType: 'pulsing',
    color: '#080808'
  }
];

export default function DataInsights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeData = dimensions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dimensions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#F5F5F3] py-24 px-6 md:px-[170px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Left Content - Now a Narrative Carousel */}
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-[#080808] text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                看懂数据<br />
                才能改变生活
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
                      <text x="50" y="240">初始</text>
                      <text x="250" y="240" textAnchor="middle">第6周</text>
                      <text x="450" y="240" textAnchor="end">第12周</text>
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
