import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Activity, Zap, ShieldCheck, FileText, Ruler, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';

const BRACELET_VARIANTS = [
  { id: 'base', name: 'Awak Bracelet 基础版', price: '¥999', color: '运动深空黑', img: 'https://i.ibb.co/tP4mcmbJ/image.png' },
  { id: 'sport', name: 'Awak Bracelet 运动版', price: '¥1,299', color: '陨石银', img: 'https://i.ibb.co/7JBXGwxf/image.png' },
  { id: 'fashion', name: 'Awak Bracelet 时尚款', price: '¥1,499', color: '香槟金', img: 'https://i.ibb.co/jZT4DZJj/b74a3d2c6aed46188e21855acb0e0dbc.png' },
  { id: 'premium', name: 'Awak Bracelet 定制款', price: '¥1,999', color: '钛金灰', img: 'https://i.ibb.co/SwRc0XWW/e8ff86b611a34c178ee5dac824aee44c.png' },
];

const SmartBraceletPage: React.FC = () => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paramsRef = useRef<HTMLDivElement>(null);

  const scrollToParams = () => {
    paramsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const commonSpecs = [
    "1芯+6传感",
    "ECG(房颤/早搏筛查）",
    "姿态和行为轨迹",
    "体温监测 （炎症反应）",
    "睡眠监测",
    "心率",
    "血氧饱和度",
    "情绪压力（HRV",
    "血压检测",
    "生理期/孕期管理",
    "AI营养师",
    "50米防水"
  ];

  return (
    <div className="bg-[#000000] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* SECTION 1: HERO */}
      <div className="app-hero-wrapper relative overflow-hidden min-h-screen bg-[#000000]">
        <div className="absolute inset-0 z-0">
          <video 
            className="w-full h-full object-cover opacity-60"
            autoPlay loop muted playsInline
          >
            <source src="https://res.cloudinary.com/ddkoemsam/video/upload/v1776213808/jimeng-2026-04-14-7120-%E7%BA%AF%E7%99%BD%E8%89%B2%E7%9A%84%E8%83%8C%E6%99%AF_%E8%AE%A9%E8%BF%99%E4%B8%AA%E4%BA%A7%E5%93%81%E9%83%BD%E5%8F%AA%E4%BB%8E%E5%8F%B3%E4%B8%8B%E8%A7%92%E4%B8%80%E4%B8%AA%E4%B8%80%E4%B8%AA%E8%B7%B3%E5%87%BA%E6%9D%A5%E7%9A%84%E6%95%88%E6%9E%9C_%E5%8F%98%E6%88%90%E5%8A%A8%E7%94%BB_%E4%BF%9D%E6%8C%81%E4%BA%A7%E5%93%81%E7%9A%84%E6%A0%B7..._mrqilc.mp4" type="video/mp4" />
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
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-16">
              AWAK BRACELET <br />
              <span className="text-white mt-6 block text-5xl leading-tight md:text-6xl lg:text-7xl xl:text-8xl">
                健康守护，家人就在身边
                <br />
                关爱银发健康，让一切都来得及
              </span>
            </h1>
            <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl">
              55-75岁银发专属健康守护。不仅是一枚手环，更是理解你身体频率的贴身伙伴。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: DATA MODULE (守护银发健康) */}
      <section className="bg-[#F5F5F7] py-40 px-6 md:px-[170px] border-none">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#000000] leading-tight mb-8">
              银发健康 <br/> 守护系统
            </h2>
            <p className="text-[#86868B] text-xl leading-relaxed mb-12 max-w-xl font-medium">
              针对银发人群设计的生理监测与预警系统。Awak Bracelet 能够 24 小时高频监测心率、血氧与跌倒风险，并在异常发生时第一时间同步至家人 App。
            </p>
          </motion.div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "持续监测", value: 24, suffix: "小时", subtitle: "关键体征全天候自主记录" },
              { title: "精准预警", value: 95, suffix: "%", subtitle: "房颤/早搏精准筛查" },
              { title: "超长续航", value: 30, suffix: "天", subtitle: "免除频繁充电烦忧" },
              { title: "家人共享", value: 100, suffix: "%", subtitle: "健康数据全家云同步" },
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
            <h2 className="text-black text-4xl md:text-6xl font-black tracking-tight">产品参数</h2>
            <p className="text-[#86868B] text-xl">对比不同版本，选择最适合你的健康伙伴</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 content-stretch">
            {[
              {
                id: 'base',
                title: '尼龙款',
                subtitle: '银发守护基础',
                img: BRACELET_VARIANTS[0].img,
                specs: commonSpecs
              },
              {
                id: 'sport',
                title: '橡胶款',
                subtitle: '科学运动辅助',
                img: BRACELET_VARIANTS[1].img,
                specs: commonSpecs
              },
              {
                id: 'fashion',
                title: '真皮款',
                subtitle: '精致百变设计',
                img: BRACELET_VARIANTS[2].img,
                specs: commonSpecs
              },
              {
                id: 'premium',
                title: '金属款',
                subtitle: '极奢专属定制',
                img: BRACELET_VARIANTS[3].img,
                specs: commonSpecs
              }
            ].map((card) => (
              <div key={card.id} className="bg-black rounded-[24px] overflow-hidden flex flex-col transform transition-all hover:scale-[1.02] h-full min-h-[680px] border border-white/10 shadow-2xl">
                <div className="bg-white/[0.03] h-[320px] md:h-[360px] flex items-center justify-center p-10 md:p-12">
                  <img src={card.img} alt={card.title} className="w-full h-full object-contain" />
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
                  <button onClick={() => navigate(withPath('/store/bracelet'))} className="mt-10 w-full py-4 bg-[#DDF700] text-[#080808] rounded-full text-sm font-bold hover:brightness-110 transition-all border-0 shadow-none">
                    立即购买
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: LIFESTYLE GALLERY */}
      <section className="bg-[#FFFFFF] min-h-[100dvh] md:h-[100dvh] py-12 md:py-14 px-6 md:px-[170px] border-none flex flex-col">
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8 shrink-0">
          <h2 className="text-[#000000] text-4xl md:text-5xl font-black tracking-tight">早点，让一切都来得及</h2>
          <p className="text-[#1D1D1F] text-lg md:text-xl font-medium max-w-2xl">每一个细微变化都被看见不打扰，却始终在场，让关爱从未缺席</p>
        </div>
        
        <div className="flex flex-col gap-5 md:gap-6 md:flex-1 md:min-h-0">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 h-auto md:flex-[0_0_58%] md:min-h-0">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/4gS1WHS4/51-Pinterest.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">静谧监测</span>
                     <h3 className="text-white text-2xl font-black">24/7 全天候心率捕捉</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/twR5nDWT/WHOOP-Unlock-Human-Performance-Healthspan.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">深度睡眠</span>
                     <h3 className="text-white text-2xl font-black">精准分析睡眠阶段</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 h-auto md:flex-[0_0_42%] md:min-h-0">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/DHN2kG05/MG-Super-Knit-Band-WHOOP-The-Worlds-Most-Powerful-Fitness-Membership.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-black">运动负荷感知</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/kgQMX4yK/Quote.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-black">AI 智能方案</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/jvdwpsVj/jimeng-2026-04-03-1901-1-logo.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-black">持久续航，时刻相伴</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-[#F5F5F7] py-40 px-6 md:px-[170px] flex flex-col lg:flex-row items-center gap-24 border-none">
        <div className="w-full lg:w-1/2 rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-none">
          <img src="https://i.ibb.co/7dw6GWmS/Olive-Stress-Management-Bracelet-by-Hardy-Simes.jpg" className="w-full h-auto object-cover" alt="Diverse" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-black tracking-[0.3em] text-[#000000]/20 uppercase block mb-10">每一种状态，都有属于它的形态</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#000000] leading-[1.05] mb-12">
            不是一枚手环 <br /> 是多种可能
          </h2>
          <div className="flex flex-wrap gap-4 mb-12">
            {['陪伴', '健康', '子女守护'].map((tag) => (
              <span key={tag} className="px-8 py-3 rounded-full bg-[rgba(0,0,0,0.05)] text-sm font-bold text-[#000000] uppercase font-bold">{tag}</span>
            ))}
          </div>
          <p className="text-xl text-[#86868B] leading-relaxed max-w-md mb-12">你可以专注，也可以释放，也可以表达自我。而它，始终与你一致。</p>
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
             <img src="https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png" alt="AWAK Ring" className="w-full h-auto object-contain rotate-12 drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="w-full md:w-2/3 flex flex-col gap-8">
              <h2 className="text-[#000000] text-4xl md:text-6xl font-black tracking-tight uppercase">配合 AWAK RING <br/>健康数据更完整</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <BoxItem icon={<Activity size={24}/>} name="完整监测" desc="全身数据采集" />
                <BoxItem icon={<Zap size={24}/>} name="昼夜追踪" desc="24小时不间断" />
                <BoxItem icon={<ShieldCheck size={24}/>} name="融合分析" desc="多数据计算" />
                <BoxItem icon={<FileText size={24}/>} name="状态调整" desc="智能动态优化" />
              </div>
           </div>
        </div>
      </section>

      <FooterSections />
      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const DataCard: React.FC<{ title: string; subtitle: string; value: number; suffix: string; delay: number; lightTheme?: boolean }> = ({ title, subtitle, value, suffix, delay, lightTheme }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (inView) {
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
          <motion.span className={`text-6xl md:text-7xl font-black tracking-tighter ${lightTheme ? 'text-black' : 'text-white'}`}>{rounded}</motion.span>
          <span className="text-xl font-bold text-black/40 mb-2 font-bold">{suffix}</span>
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
                <h3 className="text-white font-bold">标准款</h3>
                <p className="text-white/60 text-sm">适合大部分腕围。轻盈透气，适合 24/7 佩戴。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">加长款</h3>
                <p className="text-white/60 text-sm">专为宽大腕部设计，提供更舒适的延展空间。</p>
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

export default SmartBraceletPage;
