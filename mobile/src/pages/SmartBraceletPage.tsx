import React, { useState, useRef } from 'react';
import { Activity, Zap, ShieldCheck, FileText, Ruler, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';
import ImageTextCarousel from '../components/ImageTextCarousel';

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
    <div className="bg-[#0D0D0D] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* SECTION 1: HERO */}
      <div className="relative overflow-hidden bg-[#0D0D0D] min-h-[70vh] md:min-h-screen">
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

        {/* Copy placement aligned with HomePage Hero (bottom) */}
        <div className="relative z-10 px-6 md:px-[170px] pt-24 md:pt-0 pb-10 md:pb-36 h-full flex flex-col justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-[32px] md:text-8xl font-normal text-white leading-[1.1] tracking-[-0.04em] mb-6 uppercase">
              AWAK BRACELET <br/> 
              <span className="text-white block mt-3">轻盈守护，时刻在线</span>
            </h1>
            <p className="text-[14px] md:text-2xl text-white/60 font-normal leading-[1.6] mb-0 max-w-2xl">
              55-75岁银发专属健康守护。不仅是一枚手环，更是理解你身体频率的贴身伙伴。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: 核心能力 — Ring-style left aligned stats */}
      <section className="bg-[#FAFAFA] py-8 px-6 md:px-[170px] text-left">
        <div className="mx-auto w-full max-w-[520px] md:max-w-none md:grid md:grid-cols-2 md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0">
            <h2 className="text-[32px] font-normal text-[#0A0A0A] tracking-[-0.05em] leading-[1.15] mb-4 md:text-[40px]">
              银发健康
              <br />
              守护系统
            </h2>
            <p className="text-[14px] text-[#666] leading-[1.75] m-0 tracking-[-0.01em] font-normal max-w-xl">
              针对银发人群设计的生理监测与预警系统。Awak Bracelet 能够 24 小时高频监测心率、血氧与跌倒风险，并在异常发生时第一时间同步至家人 App。
            </p>
          </div>

          <div>
            {[
              { label: '持续监测', value: '24', unit: '小时', desc: '关键体征全天候自主记录' },
              { label: '精准预警', value: '95', unit: '%', desc: '房颤/早搏精准筛查' },
              { label: '超长续航', value: '30', unit: '天', desc: '免除频繁充电烦忧' },
            ].map((row, idx, arr) => (
              <div
                key={row.label}
                className={[
                  'border-t border-[#E8E8E8] py-6',
                  idx === arr.length - 1 ? 'border-b border-[#E8E8E8]' : '',
                ].join(' ')}
              >
                <p className="text-[11px] font-normal tracking-[0.08em] uppercase text-[#888] m-0 mb-2">{row.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] font-normal leading-none tracking-[-0.04em] text-[#0A0A0A]">{row.value}</span>
                  <span className="text-[18px] font-normal text-[#0A0A0A]/70">{row.unit}</span>
                </div>
                <p className="text-[12px] text-[#888] mt-1 mb-0 tracking-[-0.01em] font-normal">{row.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT PARAMETERS (对比不同型号) */}
      <section ref={paramsRef} className="bg-white py-8 px-6 md:px-[170px] text-left">
        <div className="flex flex-col gap-6 md:gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-[24px] md:text-4xl font-normal tracking-[-0.03em] text-[#0D0D0D] uppercase">产品参数</h2>
            <p className="text-[14px] md:text-lg text-black/60 font-normal">对比不同版本，选择最适合你的健康伙伴</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 content-stretch">
            {([
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
            ] as const).map((card, idx) => {
              const material = card.specs[0];
              const featureSpecs = card.specs.slice(1);
              const hasGreyBg = true;
              return (
              <div
                key={card.id}
                className={`flex flex-col h-full overflow-hidden rounded-[12px] ${hasGreyBg ? 'bg-[#F5F5F7]' : 'bg-white'}`}
              >
                <div className={`relative flex h-[220px] shrink-0 items-center justify-center ${hasGreyBg ? 'bg-white/50' : 'bg-[#FAFAFA]'} p-4 sm:h-[240px] md:h-[280px] md:p-8`}>
                  <span className="absolute left-3 top-3 z-10 inline-flex max-w-[min(12rem,calc(100%-1.5rem))] rounded-full bg-[#0D0D0D] px-3 py-1 text-[12px] font-normal text-white border-none">
                    {card.title}
                  </span>
                  <img src={card.img} alt={card.title} className="max-h-full w-full max-w-full object-contain" />
                </div>
                <div className="flex flex-1 flex-col p-5 text-left md:p-6">
                  <p className="mb-[18px] border-b border-[#EAEAEA] pb-[18px] text-[14px] font-normal leading-snug text-black/70">
                    {card.subtitle} · {material}
                  </p>
                  <ul className="mb-6 flex flex-1 flex-col">
                    {featureSpecs.map((spec, idx) => (
                      <li
                        key={`${card.id}-${idx}`}
                        className="flex gap-3 border-b border-[#EAEAEA] py-[14px] text-left last:border-b-0"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0D0D0D]" strokeWidth={1.5} />
                        <span className="text-[14px] font-normal leading-snug text-[#0D0D0D]">{spec}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigate(withPath('/store/bracelet'))}
                    className={`mt-auto flex h-12 w-full items-center justify-center rounded-full ${hasGreyBg ? 'bg-[#0D0D0D] text-white' : 'bg-accent text-ink'} text-[14px] font-normal transition active:scale-[0.98]`}
                  >
                    立即购买
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: LIFESTYLE GALLERY */}
      <section className="bg-white py-8 px-6 md:px-[170px] flex flex-col text-left">
        <div className="flex flex-col gap-2 md:gap-6 mb-6 md:mb-8 shrink-0">
          <h2 className="text-[24px] font-normal tracking-[-0.03em] text-[#0D0D0D] uppercase md:text-4xl">早点，让一切都来得及</h2>
          <p className="text-[14px] md:text-xl font-normal text-[#0D0D0D]/70 max-w-2xl">每一个细微变化都被看见不打扰，却始终在场，让关爱从未缺席</p>
        </div>
        
        <div className="md:hidden">
          <ImageTextCarousel
            slides={[
              { title: '24/7 全天候心率捕捉', image: 'https://i.ibb.co/4gS1WHS4/51-Pinterest.jpg' },
              { title: '精准分析睡眠阶段', image: 'https://i.ibb.co/twR5nDWT/WHOOP-Unlock-Human-Performance-Healthspan.webp' },
              { title: '运动负荷感知', image: 'https://i.ibb.co/DHN2kG05/MG-Super-Knit-Band-WHOOP-The-Worlds-Most-Powerful-Fitness-Membership.webp' },
              { title: 'AI 智能方案', image: 'https://i.ibb.co/kgQMX4yK/Quote.jpg' },
              { title: '持久续航，时刻相伴', image: 'https://i.ibb.co/jvdwpsVj/jimeng-2026-04-03-1901-1-logo.png' },
            ]}
          />
        </div>

        <div className="hidden md:flex flex-col gap-5 md:gap-6 md:flex-1 md:min-h-0">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 h-auto md:flex-[0_0_58%] md:min-h-0">
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/4gS1WHS4/51-Pinterest.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-normal tracking-widest uppercase">静谧监测</span>
                     <h3 className="text-white text-2xl font-normal">24/7 全天候心率捕捉</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/twR5nDWT/WHOOP-Unlock-Human-Performance-Healthspan.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-normal tracking-widest uppercase">深度睡眠</span>
                     <h3 className="text-white text-2xl font-normal">精准分析睡眠阶段</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 h-auto md:flex-[0_0_42%] md:min-h-0">
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/DHN2kG05/MG-Super-Knit-Band-WHOOP-The-Worlds-Most-Powerful-Fitness-Membership.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">运动负荷感知</h3>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/kgQMX4yK/Quote.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">AI 智能方案</h3>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/jvdwpsVj/jimeng-2026-04-03-1901-1-logo.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">持久续航，时刻相伴</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-[#F5F5F3] py-8 px-6 text-left md:px-[170px]">
        <div className="w-full flex flex-col max-w-[980px]">
          <span className="text-[12px] font-normal tracking-[0.12em] text-black/40 uppercase block mb-3">每一种状态，都有属于它的形态</span>
          <h2 className="mb-4 text-[24px] font-normal uppercase leading-[1.1] tracking-[-0.03em] text-[#0D0D0D] md:text-6xl">
            不是一枚手环 <br /> 是多种可能
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['陪伴', '健康', '子女守护'].map((tag) => (
              <span key={tag} className="rounded-[10px] bg-black/5 px-3 py-1.5 text-[12px] font-normal uppercase text-[#0D0D0D]">{tag}</span>
            ))}
          </div>
          <p className="mb-4 max-w-md text-[14px] font-normal leading-relaxed text-black/60 md:text-lg">你可以专注，也可以释放，也可以表达自我。而它，始终与你一致。</p>
          <button onClick={scrollToParams} className="w-fit rounded-full bg-[#0D0D0D] px-6 py-3 text-[14px] font-normal text-white transition active:scale-[0.98]">
            选择款式
          </button>
        </div>
      </section>

      {/* SECTION 5: ECOSYSTEM SYNERGY */}
      <section className="bg-[#FAFAFA] py-8 pb-8 text-left">
        <div className="mb-8 flex justify-center px-6">
          <img
            src="https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png"
            alt="AWAK Ring"
            className="h-auto w-full max-w-[300px] object-contain"
          />
        </div>
        <div className="px-6 md:px-[170px]">
          <p className="mb-1.5 text-[11px] font-normal tracking-[0.1em] text-[#888] uppercase">AWAK RING</p>
          <h2 className="mb-10 text-[28px] font-normal leading-[1.15] tracking-[-0.05em] text-[#0A0A0A] md:text-3xl">
            配合 AWAK RING <br />
            健康数据更完整
          </h2>
        </div>

        <div className="grid grid-cols-2 border-b border-t border-[#E8E8E8]">
          <BoxItem
            className="border-b border-r border-[#E8E8E8] p-6"
            icon={<Activity className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="完整监测"
            desc="全身数据采集"
          />
          <BoxItem
            className="border-b border-[#E8E8E8] p-6"
            icon={<Zap className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="昼夜追踪"
            desc="24小时不间断"
          />
          <BoxItem
            className="border-r border-[#E8E8E8] p-6"
            icon={<ShieldCheck className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="融合分析"
            desc="多数据计算"
          />
          <BoxItem
            className="p-6"
            icon={<FileText className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="状态调整"
            desc="智能动态优化"
          />
        </div>
      </section>

      <FooterSections />
      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const SizeGuideModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.98, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 12 }} className="relative bg-[#1A1A1A] rounded-[16px] w-full max-w-2xl p-4 md:p-12 overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-8 right-8 text-white/40 transition-colors hover:text-white"
            aria-label="关闭"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex items-center gap-4">
              <Ruler className="w-8 h-8 text-white/40" strokeWidth={1.5} />
              <h2 className="text-[24px] md:text-3xl font-normal tracking-[-0.03em] text-white">选择适合你的款式</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-8 py-4 md:py-8">
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">标准款</h3>
                <p className="text-[14px] font-normal text-white/70 leading-[1.6]">适合大部分腕围。轻盈透气，适合 24/7 佩戴。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">加长款</h3>
                <p className="text-[14px] font-normal text-white/70 leading-[1.6]">专为宽大腕部设计，提供更舒适的延展空间。</p>
              </div>
            </div>
            <div className="h-px bg-white/10" />
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const BoxItem: React.FC<{ className?: string; icon: React.ReactNode; name: string; desc: string }> = ({
  className = '',
  icon,
  name,
  desc,
}) => (
  <div className={`flex flex-col text-left ${className}`}>
    <div className="mb-3 flex h-[22px] w-[22px] items-center justify-center text-[#0A0A0A]">{icon}</div>
    <p className="mb-1 text-[15px] font-normal leading-snug text-[#0A0A0A]">{name}</p>
    <p className="text-[13px] font-normal leading-[1.6] text-black/55">{desc}</p>
  </div>
);

export default SmartBraceletPage;
