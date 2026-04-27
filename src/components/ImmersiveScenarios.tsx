import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';

const productsData = [
  {
    id: 'ring',
    name: '智能戒指',
    features: [
      { title: '时尚设计', desc: '轻盈佩戴，无感存在。', img: 'https://i.ibb.co/TDY245bK/image.png' },
      { title: '持久守护', desc: '7×24小时持续运行，长效续航。', img: 'https://i.ibb.co/xKgfc5rN/Oura.jpg' },
      { title: '健康监测', desc: '精准监测心率与睡眠。', img: 'https://i.ibb.co/MkPGBT9k/Oura.jpg' },
      { title: '智慧生活', desc: '门禁、支付与设备互联。', img: 'https://i.ibb.co/fYmtwXGT/p12-2.jpg' },
      { title: '情绪感知', desc: '提前识别波动，温和调整', img: 'https://i.ibb.co/cKjxbXng/image.png' },
      { title: '无感连接', desc: '轻触之间，连接你的生活', img: 'https://i.ibb.co/9m2JVLrV/p12-2.jpg' }
    ]
  },
  {
    id: 'band',
    name: '智能手环',
    features: [
      { title: '紧急呼救', desc: '跌倒自动提醒，守护家人安全。', img: 'https://i.ibb.co/whtz0KFz/The-Best-Ways-To-Prevent-Falling-In-Your-Home-Health-Digest.jpg' },
      { title: '心率预警', desc: '异常实时监测，数据变化及时提醒。', img: 'https://i.ibb.co/d4VkCTvf/10-Pains-You-Should-Never-Ever-Ignore.jpg' },
      { title: '超长续航', desc: '最长 30天续航，减少频繁充电。', img: 'https://i.ibb.co/7dw6GWmS/Olive-Stress-Management-Bracelet-by-Hardy-Simes.jpg' },
      { title: 'AI健身', desc: '智能识别运动，记录与分析表现。', img: 'https://i.ibb.co/hxQb6mB2/jimeng-2026-04-20-5496-logo.png' },
      { title: '舒适佩戴', desc: '亲肤表带，轻盈贴合日常佩戴', img: 'https://i.ibb.co/zTJpVzSv/image.png' },
      { title: '全天守护', desc: '数据持续监测，异常实时同步家人', img: 'https://i.ibb.co/99yZStWr/image.png' }
    ]
  },
  {
    id: 'glasses',
    name: '智能眼镜',
    features: [
      { title: '无障碍沟通', desc: '实时翻译与字幕支持，沟通更自由。', img: 'https://i.ibb.co/fGyWsKLp/image.png' },
      { title: '轻盈体验', desc: '49g轻量设计，佩戴舒适无负担。', img: 'https://i.ibb.co/Xrkc6FL9/XRAI-AR2-The-Original-Captioning-Glasses-Redesigned.jpg' },
      { title: '安全出行', desc: '导航与路障提醒，出行更安心。', img: 'https://i.ibb.co/39b8QJZW/jimeng-2026-04-03-6916.png' },
      { title: '智能识别', desc: '高精度语音与降噪，使用更清晰。', img: 'https://i.ibb.co/bn5r2Hm/jimeng-2026-04-23-1745-1.png' },
      { title: '手语识别', desc: '识别手语,表达实现双向交流理解', img: 'https://i.ibb.co/Y4sjjjMg/jimeng-2026-04-23-1426.png' },
      { title: '轻盈长续', desc: '轻量设计,结合长续航佩戴更舒适', img: 'https://i.ibb.co/TxfjjQ91/jimeng-2026-04-23-5862-1.png' }
    ]
  },
  {
    id: 'watch',
    name: '智能手表',
    features: [
      { title: '科学训练', desc: '训练分析与个性建议，提升每一次表现分析评估。', img: 'https://i.ibb.co/1fyLt5S6/jimeng-2026-04-03-6305.png' },
      { title: '健康监测', desc: '睡眠、心率与状态追踪，全面了解身体变化。', img: 'https://i.ibb.co/ynTmxzW7/image.png' },
      { title: '运动模式', desc: '覆盖多种运动类型，适配不同场景。', img: 'https://i.ibb.co/yFD7J0BZ/image.png' },
      { title: '户外定位', desc: '多频GPS精准定位，复杂环境也能安心。', img: 'https://i.ibb.co/HDfCRBt8/jimeng-2026-04-20-7301-1.png' },
      { title: '全能之选', desc: '覆盖全年龄段,专业运动智能腕表', img: 'https://i.ibb.co/DDk1xWyM/image.png' },
      { title: '持久续航', desc: '长达十二天续航满足长时间使用', img: 'https://i.ibb.co/vx1DpGTL/jimeng-2026-04-22-7846.png' }
    ]
  }
];

export default function ImmersiveScenarios() {
  const [activeTab, setActiveTab] = useState(productsData[0].name);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const activeProductData = productsData.find(p => p.name === activeTab) || productsData[0];

  return (
    <section ref={containerRef} className="bg-[#F5F5F7] pt-2 pb-16 font-sans relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* 1. Sticky Transition Navigation (Left-floating) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 bottom-0 w-[300px] z-[40] pointer-events-none flex flex-col justify-center pl-[170px]"
      >
        {/* Left Gradient Mask for Readability */}
        <div className="absolute inset-y-0 left-0 w-[500px] bg-gradient-to-right from-[#F5F5F7] via-[#F5F5F7]/80 to-transparent z-[-1]" 
             style={{ background: 'linear-gradient(to right, #F5F5F7 0%, rgba(245, 245, 247, 0.8) 40%, transparent 100%)' }} />
        
        <div className="flex flex-col gap-10 pointer-events-auto relative">
          {productsData.map((product) => {
            const isActive = activeTab === product.name;
            return (
              <button 
                key={product.id}
                onClick={() => setActiveTab(product.name)}
                className={`relative group text-left transition-all duration-300 w-fit ${
                  isActive ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                <span className="text-[20px] font-bold tracking-tight uppercase block leading-none">
                  {product.name}
                </span>
                
                {/* Active Indicator Line & Glow */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="activeUnderlineSide"
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 2. Asymmetric Horizontal Scroll Gallery (D.3) */}
      <div className="relative group z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10"
            style={{ paddingLeft: '170px', paddingRight: '170px' }}
          >
            {activeProductData.features.map((feature: any, idx: number) => {
              // Asymmetric width logic: 1st=65vw, 2nd=30vw, others=30vw
              const widthClass = idx === 0 ? 'w-[65vw]' : 'w-[30vw]';
              
              return (
                <div 
                  key={idx}
                  className={`relative flex-shrink-0 snap-start rounded-[24px] overflow-hidden bg-black group/item ${widthClass} aspect-[16/10] shadow-2xl shadow-black/5`}
                >
                  <img 
                    src={feature.img} 
                    alt={feature.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[2s] group-hover/item:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Narratve Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-700" />
                  
                  <div className={`absolute bottom-10 ${idx === 0 ? 'right-10 text-right' : 'left-10'} z-20`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-white text-3xl font-black mb-3 tracking-tight leading-tight">{feature.title}</h3>
                      <p className={`text-white/40 text-sm max-w-[350px] leading-relaxed font-medium ${idx === 0 ? 'ml-auto' : ''}`}>{feature.desc}</p>
                    </motion.div>
                  </div>

                  {/* Top-right index tag */}
                  <div className="absolute top-8 right-8 text-white/20 text-[10px] font-mono tracking-widest uppercase">
                    SCENARIO.0{idx + 1}
                  </div>
                </div>
              );
            })}
            
            {/* End padding spacer */}
            <div className="flex-shrink-0 w-[170px]" />
          </motion.div>
        </AnimatePresence>

        {/* Custom CSS to hide scrollbars & refine behavior */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .snap-x {
            scroll-behavior: smooth;
          }
        `}</style>
      </div>

      {/* 170px Left Guide Line (Invisible but present for alignment logic) */}
      <div className="absolute left-[170px] top-0 bottom-0 w-[1px] bg-black/5 pointer-events-none z-[45]" />
    </section>
  );
}
