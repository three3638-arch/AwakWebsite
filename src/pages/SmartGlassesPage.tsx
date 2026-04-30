import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Activity, Zap, ShieldCheck, FileText, Ruler, ChevronDown } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';

const GLASSES_VARIANTS = [
  { id: 'base', name: 'Awak Glasses 基础款', price: '¥2,499', color: '经典黑', img: 'https://i.ibb.co/gbpwCydx/a618c6efdd3c4e599a9b760453c224ac.png' },
  { id: 'tortoise', name: 'Awak Glasses 玳瑁款', price: '¥2,699', color: '复古玳瑁', img: 'https://i.ibb.co/QvVV5c98/20260415-091854.png' },
  { id: 'transparent', name: 'Awak Glasses 透明款', price: '¥2,699', color: '极客透明', img: 'https://i.ibb.co/3Ymk5hgG/0280a44aee6c48cb88c79cdd896e57a4.png' },
];

const SmartGlassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paramsRef = useRef<HTMLDivElement>(null);

  const scrollToParams = () => {
    paramsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const commonSpecs = [
    "头部芯片 低功耗",
    "双语畅聊",
    "语音播报",
    "手语翻译",
    "智能导航",
    "路障提醒",
    "8小时续航",
    "49g轻量化",
    "眼球追踪摄像头"
  ];

  return (
    <div className="bg-[#000000] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* SECTION 1: HERO */}
      <div className="app-hero-wrapper relative overflow-hidden min-h-screen bg-[#000000]">
        <div className="absolute inset-0 z-0 bg-[#000000]">
          {/* No video background as requested */}
        </div>

        <div className="relative z-10 px-6 md:px-[170px] pt-0 pb-36 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-12 uppercase">
              AWAK GLASSES <br/> 
              <span className="text-white">听见看见世界</span>
            </h1>
            <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl">
              科技助残，让生活更无障碍。专为听视障人群设计的智能感知硬件，让感官能力得以延展。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: DATA MODULE (助残科技) */}
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
              感官延展 <br/> 无碍通行
            </h2>
            <p className="text-[#86868B] text-xl leading-relaxed mb-12 max-w-xl font-medium">
              自研 AI 手语翻译算法准确率达 98%，集成眼球追踪与骨传导技术，为特殊人群提供全天候的安全出行与社交支持。
            </p>
          </motion.div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "手语翻译", value: 98, suffix: "%", subtitle: "毫米级动作识别精度" },
              { title: "避障响应", value: 50, suffix: "ms", subtitle: "极速反馈安全预警" },
              { title: "极致轻盈", value: 49, suffix: "g", subtitle: "几乎无感的日常佩戴" },
              { title: "续航表现", value: 8, suffix: "h", subtitle: "全天候助感续航能力" },
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
            <p className="text-[#86868B] text-xl">对比不同款式，选择最适合你的智能助手</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-stretch">
            {[
              {
                id: 'base',
                title: '基础款',
                subtitle: '专业感知辅助',
                img: GLASSES_VARIANTS[0].img,
                specs: commonSpecs
              },
              {
                id: 'tortoise',
                title: '玳瑁款',
                subtitle: '经典复古设计',
                img: GLASSES_VARIANTS[1].img,
                specs: commonSpecs
              },
              {
                id: 'transparent',
                title: '透明款',
                subtitle: '极客未来美学',
                img: GLASSES_VARIANTS[2].img,
                specs: commonSpecs
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
                  <button onClick={() => navigate(withPath('/store/glasses'))} className="mt-10 w-full py-4 bg-[#DDF700] text-[#080808] rounded-full text-sm font-bold hover:brightness-110 transition-all border-0 shadow-none">
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
          <h2 className="text-[#000000] text-4xl md:text-5xl font-black tracking-tight uppercase">科技让沟通无国界，感官无阻碍</h2>
          <p className="text-[#1D1D1F] text-xl font-medium max-w-2xl">无论是听视障人群，或是在复杂环境中的每一个人，AWAK Glasses 让声音被看见，文字被听见，让世界重新变得可理解与可抵达</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/spF95CMZ/51-Pinterest.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">社交办公</span>
                     <h3 className="text-white text-2xl font-black">手语翻译，让交流如指尖般流利</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/twqY60cm/HEKTIK-Optics-Pin.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-black tracking-widest uppercase">智能导航</span>
                     <h3 className="text-white text-2xl font-black">视界延展，避障预警安全随行</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[400px]">
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/XZgJph37/Metas-New-Personal-Superintelligence-AI-Is-Coming-to-Its-Smart-Glasses.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">AI 智能分析方案</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/7JhBLGs9/image.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">多场景沟通无碍</h3>
                </div>
             </div>
             <div className="rounded-[24px] overflow-hidden group relative">
                <img src="https://i.ibb.co/j9m3kTfk/image.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                   <h3 className="text-white text-xl font-black">时刻感知，生活无阻</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-[#F5F5F7] py-40 px-6 md:px-[170px] flex flex-col lg:flex-row items-center gap-24 border-none">
        <div className="w-full lg:w-1/2 rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-none">
          <img src="https://i.ibb.co/39b8QJZW/jimeng-2026-04-03-6916.png" className="w-full h-auto object-cover" alt="Window" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <span className="text-xs font-black tracking-[0.3em] text-[#000000]/20 uppercase block mb-10">每一种状态，都有属于它的形态</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#000000] leading-[1.05] mb-12 uppercase">
            不是副眼镜 <br /> 是生活的窗口
          </h2>
          <div className="flex flex-wrap gap-4 mb-12">
            {['沟通', '独立', '看见世界'].map((tag) => (
              <span key={tag} className="px-8 py-3 rounded-full bg-[rgba(0,0,0,0.05)] text-sm font-bold text-[#000000] uppercase">{tag}</span>
            ))}
          </div>
          <p className="text-xl text-[#86868B] leading-relaxed max-w-md mb-12">致力于科技平权，AWAK Glasses 让每一位用户都能平等地享受现代科技带来的自由。</p>
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
             <img src="https://i.ibb.co/zTQKV09Y/jimeng-2026-04-20-2515.png" alt="AWAK Ring Synergy" className="w-full h-auto object-contain rotate-12 drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
           </div>
           <div className="w-full md:w-2/3 flex flex-col gap-8">
              <h2 className="text-[#000000] text-4xl md:text-6xl font-black tracking-tight uppercase">配合 AWAK RING & AWAK WATCH <br/>健康数据更完整</h2>
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
              <h2 className="text-3xl font-black text-white">选择适合你的镜框</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
              <div className="space-y-4">
                <h3 className="text-white font-bold">中号 (M)</h3>
                <p className="text-white/60 text-sm">适合绝大部分脸型。佩戴紧凑，不易滑落。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold">大号 (L)</h3>
                <p className="text-white/60 text-sm">专为宽大脸型设计。提供更舒适的颞部间隙。</p>
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

export default SmartGlassesPage;
