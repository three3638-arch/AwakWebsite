import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Activity, Zap, ShieldCheck, FileText, Ruler, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';

const RING_VARIANTS = [
  { id: 'base', name: 'Awak Ring 基础版', price: '¥1,999', color: '钛金银', img: 'https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png' },
  { id: 'sport', name: 'Awak Ring 运动版', price: '¥2,199', color: '墨影黑', img: 'https://i.ibb.co/zTQKV09Y/jimeng-2026-04-20-2515.png' },
  { id: 'fashion', name: 'Awak Ring 时尚版', price: '¥2,399', color: '璀璨金', img: 'https://i.ibb.co/8Djdy2VY/jimeng-2026-04-20-2444.png' },
  { id: 'premium', name: 'Awak Ring 定制款', price: '¥2,999', color: '玫瑰金', img: 'https://i.ibb.co/N28C7vWs/2.png' },
];

const SmartRingPage: React.FC = () => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paramsRef = useRef<HTMLDivElement>(null);

  const scrollToParams = () => {
    paramsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#000000] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* SECTION 1: HERO */}
      <div className="app-hero-wrapper relative overflow-hidden min-h-screen bg-[#000000]">
        <div className="absolute inset-0 z-0">
          <video 
            className="w-full h-full object-cover opacity-60"
            autoPlay loop muted playsInline
          >
            <source src="https://res.cloudinary.com/ddkoemsam/video/upload/v1776161831/jimeng-2026-04-14-2686-%E7%BA%AF%E7%99%BD%E8%89%B2%E7%9A%84%E8%83%8C%E6%99%AF_%E8%AE%A9%E8%BF%99%E4%B8%AA%E6%88%92%E6%8C%87%E4%BB%8E%E5%8F%B3%E4%B8%8B%E8%A7%92%E4%B8%80%E4%B8%AA%E4%B8%80%E4%B8%AA%E8%B7%B3%E5%87%BA%E6%9D%A5%E7%9A%84%E6%95%88%E6%9E%9C_%E5%8F%98%E6%88%90%E5%8A%A8%E7%94%BB_%E4%BF%9D%E6%8C%81%E6%88%92%E6%8C%87%E7%9A%84%E6%A0%B7%E5%BC%8F%E4%B8%8D..._wytd2d.mp4" type="video/mp4" />
          </video>
          {/* Overlay Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 pointer-events-none" />
        </div>

        <div className="relative z-10 px-6 md:px-[170px] pt-0 pb-36 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-12 uppercase">
              AWAK RING <br/> 
              <span className="text-white">看懂身体变化</span>
            </h1>
            <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl">
              用一枚戒指，持续感知你的状态。读懂身体每一次细微变化，并转化为可执行的健康行动。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: DATA MODULE (健康能力) */}
      <section className="bg-[#F5F5F7] py-40 px-6 md:px-[170px] border-none">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#000000] leading-tight mb-8 uppercase">
              读懂身体 <br/> 细微变化
            </h2>
            <p className="text-[#86868B] text-xl leading-relaxed mb-12 max-w-xl font-medium">
              光学心率传感器以每秒 256Hz 采样，捕捉心率变异率（HRV）、血氧饱和度（SpO₂）、皮肤温度等 50+ 项生理指标。
            </p>
          </motion.div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "健康指标", value: 50, suffix: "+", subtitle: "全维度生理数据追踪" },
              { title: "采样精度", value: 1, suffix: "%", subtitle: "医学级血氧和脉搏精度" },
              { title: "超长续航", value: 7, suffix: "天", subtitle: "不间断的健康守护" },
              { title: "极致轻盈", value: 4, suffix: ".8g", subtitle: "感知不到的佩戴体验" },
            ].map((card, idx) => (
              <DataCard 
                key={idx} 
                title={card.title} 
                value={card.value} 
                suffix={card.suffix} 
                subtitle={card.subtitle}
                delay={idx * 0.1} 
                lightTheme={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT PARAMETERS (对比不同型号) */}
      <section ref={paramsRef} className="bg-[#FFFFFF] py-40 px-6 md:px-[170px]">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-black text-4xl md:text-6xl font-black tracking-tight uppercase">产品参数</h2>
            <p className="text-[#86868B] text-xl">对比不同版本，选择最适合你的健康伙伴</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 content-stretch">
            {[
              {
                id: 'base',
                title: '基础版',
                subtitle: '日常生理监测',
                img: RING_VARIANTS[0].img,
                specs: ["钛合金", "1芯+6传感", "睡眠监测", "心率", "血氧饱和度", "情绪压力（HRV 生理期/孕期管理", "ECG（房颤/早搏筛查）", "运动检测", "梅脱METS", "姿态和行沩轨迹 AI营养师", "炎症反应"]
              },
              {
                id: 'sport',
                title: '运动版',
                subtitle: '针对训练优化',
                img: RING_VARIANTS[1].img,
                specs: ["外圈可拆卸", "1芯+6传感", "睡眠监测", "心率", "血氧饱和度", "情绪压力（HRV 生理期/孕期管理", "ECG（房颤/早搏筛查） 血压检测", "运动检测", "梅脱METS", "姿态和行为轨迹 AI营养师", "炎症反应"]
              },
              {
                id: 'fashion',
                title: '时尚版',
                subtitle: '时尚设计',
                img: RING_VARIANTS[2].img,
                specs: ["时尚设计", "1芯+6传感", "睡眠监测", "心率", "血氧饱和度", "情绪压力（HRV 生理期/孕期管理", "ECG（房颤/早搏筛查） 血压检测", "运动检测", "梅脱METS", "姿态和行轨迹 AI营养师", "炎症反应"]
              },
              {
                id: 'premium',
                title: '定制款',
                subtitle: '极致定制体验',
                img: RING_VARIANTS[3].img,
                specs: ["贵金属", "IP联名", "1芯+6传感", "睡眠监测", "心率", "血氧饱和度", "情绪压力（HRV 生理期/孕期管理", "ECG（房颤/早搏筛查） 血压检测", "运动检测", "梅脱METS", "姿态和行轨迹 AI营养师", "炎症反应"]
              }
            ].map((card) => (
              <div key={card.id} className="bg-black rounded-[24px] overflow-hidden flex flex-col transform transition-all hover:scale-[1.02] h-full min-h-[680px] border border-white/10 shadow-2xl">
                <div className="bg-white/[0.03] aspect-square flex items-center justify-center p-12">
                  <img src={card.img} alt={card.title} className="w-full h-auto object-contain" />
                </div>
                <div className="p-10 flex flex-col items-center text-center flex-1">
                  <h3 className="text-white text-2xl font-black mb-2">{card.title}</h3>
                  <p className="text-white/40 text-sm mb-10 font-medium">{card.subtitle}</p>
                  <div className="w-full flex-1 flex flex-col gap-4">
                    {card.specs.map((spec, idx) => (
                      <div key={idx} className="text-white/80 text-sm py-1.5 border-b border-white/10 last:border-0 font-medium">
                        {spec}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate(withPath('/store/ring'))} className="mt-10 w-full py-4 bg-[#DDF700] text-[#080808] rounded-full text-sm font-bold hover:brightness-110 transition-all border-0 shadow-none">
                    立即购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: LIFESTYLE GALLERY */}
      <section className="bg-[#FFFFFF] py-40 px-6 md:px-[170px] border-none">
        <div className="flex flex-col gap-12 mb-16">
          <h2 className="text-[#000000] text-4xl md:text-5xl font-black tracking-tight uppercase">指尖健康，触手可及</h2>
          <p className="text-[#1D1D1F] text-xl font-medium max-w-2xl">Awak Ring 以航空级钛合金铸造，重量仅 4.8g，全程无屏，数据在感知，生活不打扰。</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/N62vFRxv/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-2.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">静谧监测</span>
                     <h3 className="text-white text-2xl font-black">24/7全天候呼吸频率与心率捕捉</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/B5tmTR92/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-3.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">睡眠追踪</span>
                     <h3 className="text-white text-2xl font-black">深度睡眠阶段精准分析</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px]">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/fG4mkFd2/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-4.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">运动感知自动识别</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/rGBsRRmc/Dreame-AI-Smart-Ring-Life-s-little-moments-upgraded.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">AI 智能分析方案</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/NdKRwh1g/Dreame-AI-Smart-Ring-Stay-present-yet-connected.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">时刻连接，尽在掌控</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-[#F5F5F7] py-40 px-6 md:px-[170px] flex flex-col lg:flex-row items-center gap-24 border-none">
        <div className="w-full lg:w-1/2 rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-none">
          <img src="https://i.ibb.co/Myn1FPYF/Oura-Ring-der-Smart-Ring-fu-r-Fitness-Stress-Schlaf-und-Gesundheit.png" className="w-full h-auto object-cover" alt="Health Cycle" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-black tracking-[0.3em] text-[#000000]/20 uppercase block mb-10">每一种状态，都有属于它的形态</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#000000] leading-[1.05] mb-12 uppercase">
            不只是戒指 <br /> 是健康闭环
          </h2>
          <div className="flex flex-wrap gap-4 mb-12">
            {['感知', '分析', '改善'].map((tag) => (
              <span key={tag} className="px-8 py-3 rounded-full bg-[rgba(0,0,0,0.05)] text-sm font-bold text-[#000000] uppercase">{tag}</span>
            ))}
          </div>
          <p className="text-xl text-[#86868B] leading-relaxed max-w-md mb-12">从感知到改善的完整健康闭环，AWAK Ring 始终助力你成为最了解自己身体的人。</p>
          <button onClick={scrollToParams} className="w-fit bg-black text-white text-base font-black rounded-full px-12 py-5 hover:bg-neutral-800 transition-colors">
            选择款式
          </button>
        </div>
      </section>

      {/* SECTION 5: ECOSYSTEM SYNERGY */}
      <section className="bg-[#FFFFFF] py-40 px-6 md:px-[170px] border-none text-[#000000]">
        <div className="bg-[#F5F5F7] border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-black/[0.05] blur-[100px] rounded-full" />
           <div className="w-full md:w-1/3">
             <img src="https://i.ibb.co/JWDBKFgn/image.png" alt="AWAK Ring Synergy" className="w-full h-auto object-contain rotate-12 drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="w-full md:w-2/3 flex flex-col gap-8">
              <h2 className="text-[#000000] text-4xl md:text-6xl font-black tracking-tight uppercase">AWAK BRACELET <br/>配合使用更完整</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <BoxItem icon={<Activity size={24}/>} name="多端协同" desc="戒指与手环数据互补，构建更精准的健康画像" />
                <BoxItem icon={<Zap size={24}/>} name="即时反馈" desc="配合 AWAK App 实时获取改善建议" />
                <BoxItem icon={<ShieldCheck size={24}/>} name="医生服务" desc="旗舰版用户享有一年私人健康报告解读" />
                <BoxItem icon={<FileText size={20}/>} name="运动指导" desc="结合 AI 运动教练，发掘身体更大的潜能" />
              </div>
           </div>
        </div>
      </section>

      <FooterSections />
      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const DataCard: React.FC<{ title: string; subtitle: string; value: number | string; suffix: string; delay: number; lightTheme?: boolean }> = ({ title, subtitle, value, suffix, delay, lightTheme }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => typeof value === 'number' ? Math.round(latest) : value);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (inView && typeof value === 'number') {
      animate(count, value, { duration: 2, ease: [0.16, 1, 0.3, 1], delay });
    }
  }, [inView, count, value, delay]);
  return (
    <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay }} className={`${lightTheme ? 'bg-black/5' : 'bg-white/5'} p-10 rounded-[24px] group transition-all`}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className={`${lightTheme ? 'text-black/40' : 'text-white/40'} text-xs font-bold tracking-[.2em] uppercase`}>{title}</span>
          <p className={`${lightTheme ? 'text-black/60' : 'text-white/60'} text-xs leading-relaxed font-medium`}>{subtitle}</p>
        </div>
        <div className="flex items-baseline gap-1" ref={ref}>
          <motion.span className={`text-6xl md:text-7xl font-black tracking-tighter ${lightTheme ? 'text-black' : 'text-white'}`}>
            {typeof value === 'number' ? <motion.span>{rounded}</motion.span> : value}
          </motion.span>
          <span className="text-xl font-bold text-[#86868B] mb-2">{suffix}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SizeGuideModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-[#1A1A1A] rounded-[24px] w-full max-w-2xl p-12 overflow-hidden shadow-2xl">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><XIcon className="w-6 h-6" /></button>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Ruler className="w-8 h-8 text-white/40" />
              <h2 className="text-3xl font-black text-white">选择适合你的款式</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
              <div className="space-y-4">
                <h3 className="text-white font-bold">标准戒圈</h3>
                <p className="text-white/60 text-sm">提供 6-13 号全尺寸选择，精准适配每一个关节。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">超轻系列</h3>
                <p className="text-white/60 text-sm">专为敏感肤质设计，极薄工艺减负佩戴。</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const BoxItem: React.FC<{ icon: React.ReactNode; name: string; desc: string }> = ({ icon, name, desc }) => {
  return (
    <div className="bg-[#FFFFFF] border border-black/5 rounded-[16px] p-6 flex flex-col group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <div className="w-8 h-8 mb-4 flex items-center justify-center text-[#1D1D1F]">
        {icon}
      </div>
      <h3 className="text-[#000000] text-sm font-bold mb-1">{name}</h3>
      <p className="text-[#86868B] text-[11px] leading-relaxed">{desc}</p>
    </div>
  );
};

const XIcon = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default SmartRingPage;
