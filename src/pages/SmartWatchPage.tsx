import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Activity, Zap, ShieldCheck, FileText, Ruler, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';

const WATCH_VARIANTS = [
  { id: 'base', name: 'Awak Watch 基础版', price: '¥1,999', color: '运动深空黑', img: 'https://i.ibb.co/vvL3qfjv/b5c1d041fbff4e6a8ca3dde3072a8742.png' },
  { id: 'pro', name: 'Awak Watch 专业版', price: '¥2,999', color: '陨石银', img: 'https://i.ibb.co/7Jsb5mGv/066bac84729a49459b19356986519b7f.png' },
  { id: 'custom', name: 'Awak Watch 尊享款', price: '¥4,999', color: '钛金灰', img: 'https://i.ibb.co/TnchtvR/e00cf1c181104ebbb772bf22b69b17cf.png' },
  { id: 'medical', name: 'Awak Watch 医疗款', price: '¥5,999', color: '典雅白', img: 'https://i.ibb.co/8nVGyRr6/c2ccc0fbc41b4796a8b9c1799af000e4.png' },
];

const SmartWatchPage: React.FC = () => {
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
            <source src="https://res.cloudinary.com/ddkoemsam/video/upload/v1776214364/jimeng-2026-04-14-1924-%E7%BA%AF%E7%99%BD%E8%89%B2%E7%9A%84%E8%83%8C%E6%99%AF_%E8%AE%A9%E8%BF%99%E4%B8%AA%E4%BA%A7%E5%93%81%E9%83%BD%E5%8F%AA%E4%BB%8E%E5%8F%B3%E4%B8%8B%E8%A7%92%E4%B8%80%E4%B8%AA%E4%B8%80%E4%B8%AA%E8%B7%B3%E5%87%BA%E6%9D%A5%E7%9A%84%E6%95%88%E6%9E%9C_%E5%8F%98%E6%88%90%E5%8A%A8%E7%94%BB_%E4%BF%9D%E6%8C%81%E4%BA%A7%E5%93%81%E7%9A%84%E6%A0%B7..._og4ltq.mp4" type="video/mp4" />
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
              AWAK WATCH <br/> 
              <span className="text-white">掌控运动状态</span>
            </h1>
            <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl">
              持续感知状态，理解每一次身体变化。航天级金属打造，专为突破潜能的你而生。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: DATA MODULE (专业性能) */}
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
              极致性能 <br/> 无畏挑战
            </h2>
            <p className="text-[#86868B] text-xl leading-relaxed mb-12 max-w-xl font-medium">
              配备多频双星定位系统 (L1 + L5)，典型模式实现 14 天超长续航。10ATM 防水性能支持 100 米专业级潜水。
            </p>
          </motion.div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "定位精度", value: 99, suffix: "%", subtitle: "多频双星 L1+L5 系统" },
              { title: "防水等级", value: 100, suffix: "m", subtitle: "支持 10ATM 专业潜水" },
              { title: "典型续航", value: 14, suffix: "天", subtitle: "全天候伴随无忧" },
              { title: "快充效率", value: 45, suffix: "min", subtitle: "45 分钟极速充满" },
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
                subtitle: '日常监控',
                img: WATCH_VARIANTS[0].img,
                specs: ["睡眠监测", "心率监测", "血氧饱和度", "运动检测", "运动模式", "轻量分析", "运动强度", "情绪压力"]
              },
              {
                id: 'pro',
                title: '专业版',
                subtitle: '专业训练',
                img: WATCH_VARIANTS[1].img,
                specs: ["心率", "睡眠监测", "血氧饱和度", "运动模式", "运动强度", "运动分析", "姿态 & 行为轨迹", "训练负荷分析", "HRV"]
              },
              {
                id: 'custom',
                title: '尊享款',
                subtitle: '极限探索',
                img: WATCH_VARIANTS[2].img,
                specs: ["高精度心率", "血氧饱和度", "睡眠监测", "运动模式", "潜水模式", "专业分析", "运动强度", "姿态 & 行为轨迹", "HRV", "训练负荷"]
              },
              {
                id: 'medical',
                title: '医疗款',
                subtitle: '医疗级监护',
                img: WATCH_VARIANTS[3].img,
                specs: ["心率监测", "HRV", "ECG 心电监测", "血压检测", "血氧饱和度", "体温监测", "睡眠监测", "行为与健康分析", "姿态 & 行为轨迹", "运动检测", "运动强度", "情绪压力分析"]
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
                  <button onClick={() => navigate(withPath('/store/watch'))} className="mt-10 w-full py-4 bg-[#DDF700] text-[#080808] rounded-full text-sm font-bold hover:brightness-110 transition-all border-0 shadow-none">
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
          <h2 className="text-[#000000] text-4xl md:text-5xl font-black tracking-tight uppercase">专业运动，腕上全能教练</h2>
          <p className="text-[#1D1D1F] text-xl font-medium max-w-2xl">从极地荒野到繁华都市，AWAK Watch 始终以最精准的姿态引领你的每一步。</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/WWpxcs9y/51-Pinterest-1.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">户外训练</span>
                     <h3 className="text-white text-2xl font-black">多频双星，位置分秒不差</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/bjhJcCt1/51-Pinterest-2.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">静息生活</span>
                     <h3 className="text-white text-2xl font-black">24/7 深度睡眠与压力监测</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px]">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/rGrWSFvw/51-Pinterest.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">极致竞技分析</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/0pQfqZQL/Ironway-Pin.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">全天候探险伴随</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/ynqTH9m4/CHANEL-Pin.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">优雅与力量。</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-[#F5F5F7] py-40 px-6 md:px-[170px] flex flex-col lg:flex-row items-center gap-24 border-none">
        <div className="w-full lg:w-1/2 rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-none">
          <img src="https://i.ibb.co/pjGh0Fz7/51-Pinterest.png" className="w-full h-auto object-cover" alt="Focus" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-black tracking-[0.3em] text-[#000000]/20 uppercase block mb-10">每一种状态，都有属于它的形态</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#000000] leading-[1.05] mb-12 uppercase">
            不是一块手表 <br /> 是无限潜能
          </h2>
          <div className="flex flex-wrap gap-4 mb-12">
            {['专注', '极限', '平衡'].map((tag) => (
              <span key={tag} className="px-8 py-3 rounded-full bg-[rgba(0,0,0,0.05)] text-sm font-bold text-[#000000] uppercase">{tag}</span>
            ))}
          </div>
          <p className="text-xl text-[#86868B] leading-relaxed max-w-md mb-12">从感知到改善的完整健康闭环，AWAK Watch 始终助力你成为最了解自己身体的人。</p>
          <button onClick={scrollToParams} className="w-fit bg-black text-white text-base font-black rounded-full px-12 py-5 hover:bg-neutral-800 transition-colors">
            选择款式
          </button>
        </div>
      </section>

      {/* SECTION 5: ECOSYSTEM SYNERGY */}
      <section className="bg-[#FFFFFF] py-40 px-6 md:px-[170px] border-none text-[#000000]">
        <div className="bg-[#F5F5F7] border-none shadow-[0_2px_10_rgba(0,0,0,0.02)] rounded-[24px] p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-black/[0.05] blur-[100px] rounded-full" />
           <div className="w-full md:w-1/3">
             <img src="https://i.ibb.co/G43Fy2S7/image.png" alt="AWAK Synergy" className="w-full h-auto object-contain rotate-12 drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="w-full md:w-2/3 flex flex-col gap-8">
              <h2 className="text-[#000000] text-4xl md:text-6xl font-black tracking-tight uppercase">配合 AWAK RING <br/>健康数据更完整</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <BoxItem icon={<Activity size={24}/>} name="协同监测" desc="运动 + 恢复一体" />
                <BoxItem icon={<Zap size={24}/>} name="全天覆盖" desc="昼夜无缝追踪" />
                <BoxItem icon={<ShieldCheck size={24}/>} name="精准理解" desc="数据融合更准" />
                <BoxItem icon={<FileText size={24}/>} name="持续优化" desc="从数据到改变" />
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
          <span className="text-xl font-bold text-black/40 mb-2">{suffix}</span>
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
              <h2 className="text-3xl font-black text-white">选择适合你的腕围</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
              <div className="space-y-4">
                <h3 className="text-white font-bold">42mm 标准版</h3>
                <p className="text-white/60 text-sm">适合大部分男士。视野开阔，操控精准。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">38mm 轻巧版</h3>
                <p className="text-white/60 text-sm">适合细小腕部。佩戴轻盈，无负担感。</p>
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

export default SmartWatchPage;
