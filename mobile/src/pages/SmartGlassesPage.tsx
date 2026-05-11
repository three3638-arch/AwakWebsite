import React, { useState, useRef } from 'react';
import { Activity, Zap, ShieldCheck, FileText, Ruler, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';
import ImageTextCarousel from '../components/ImageTextCarousel';

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
    <div className="bg-[#0D0D0D] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* SECTION 1: HERO */}
      <div className="relative overflow-hidden bg-[#0D0D0D] min-h-[70vh] md:min-h-screen">
        <div className="absolute inset-0 z-0 bg-[#000000]">
          {/* No video background as requested */}
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
              AWAK GLASSES <br/> 
              <span className="text-white block mt-3">听见看见世界</span>
            </h1>
            <p className="text-[14px] md:text-2xl text-white/60 font-normal leading-[1.6] mb-0 max-w-2xl">
              科技助残，让生活更无障碍。专为听视障人群设计的智能感知硬件，让感官能力得以延展。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: 核心能力 — Ring-style left aligned stats */}
      <section className="bg-[#FAFAFA] py-8 px-6 md:px-[170px] text-left">
        <div className="mx-auto w-full max-w-[520px] md:max-w-none md:grid md:grid-cols-2 md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0">
            <h2 className="text-[32px] font-normal text-[#0A0A0A] tracking-[-0.05em] leading-[1.15] mb-4 md:text-[40px]">
              感官延展
              <br />
              无碍通行
            </h2>
            <p className="text-[14px] text-[#666] leading-[1.75] m-0 tracking-[-0.01em] font-normal max-w-xl">
              自研 AI 手语翻译算法准确率达 98%，集成眼球追踪与骨传导技术，为特殊人群提供全天候的安全出行与社交支持。
            </p>
          </div>

          <div>
            {[
              { label: '手语翻译', value: '98', unit: '%', desc: '毫米级动作识别精度' },
              { label: '避障响应', value: '50', unit: 'ms', desc: '极速反馈安全预警' },
              { label: '极致轻盈', value: '49', unit: 'g', desc: '几乎无感的日常佩戴' },
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
            <p className="text-[14px] md:text-lg text-black/60 font-normal">对比不同款式，选择最适合你的智能助手</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 content-stretch">
            {([
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
                    onClick={() => navigate(withPath('/store/glasses'))}
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
          <h2 className="text-[24px] font-normal tracking-[-0.03em] text-[#0D0D0D] uppercase md:text-4xl">科技让沟通无国界，感官无阻碍</h2>
          <p className="text-[14px] md:text-xl font-normal text-[#0D0D0D]/70 max-w-2xl">无论是听视障人群，或是在复杂环境中的每一个人，AWAK Glasses 让声音被看见，文字被听见，让世界重新变得可理解与可抵达</p>
        </div>
        
        <div className="md:hidden">
          <ImageTextCarousel
            slides={[
              { title: '手语翻译，让交流如指尖般流利', image: 'https://i.ibb.co/fGyWsKLp/image.png' },
              { title: '视界延展，避障预警安全随行', image: 'https://i.ibb.co/twqY60cm/HEKTIK-Optics-Pin.jpg' },
              { title: 'AI 智能分析方案', image: 'https://i.ibb.co/XZgJph37/Metas-New-Personal-Superintelligence-AI-Is-Coming-to-Its-Smart-Glasses.jpg' },
              { title: '多场景沟通无碍', image: 'https://i.ibb.co/7JhBLGs9/image.png' },
              { title: '时刻感知，生活无阻', image: 'https://i.ibb.co/j9m3kTfk/image.png' },
            ]}
          />
        </div>

        <div className="hidden md:flex flex-col gap-5 md:gap-6 md:flex-1 md:min-h-0">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 h-auto md:flex-[0_0_58%] md:min-h-0">
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/fGyWsKLp/image.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <h3 className="text-white text-2xl font-normal">手语翻译，让交流如指尖般流利</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/twqY60cm/HEKTIK-Optics-Pin.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <h3 className="text-white text-2xl font-normal">视界延展，避障预警安全随行</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 h-auto md:flex-[0_0_42%] md:min-h-0">
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/XZgJph37/Metas-New-Personal-Superintelligence-AI-Is-Coming-to-Its-Smart-Glasses.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">AI 智能分析方案</h3>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/7JhBLGs9/image.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">多场景沟通无碍</h3>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/j9m3kTfk/image.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">时刻感知，生活无阻</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-[#F5F5F3] py-8 px-6 text-left md:px-[170px]">
        <div className="w-full flex flex-col max-w-[980px]">
          <span className="text-[12px] font-normal tracking-[0.12em] text-black/40 uppercase block mb-3">每一种状态，都有属于它的形态</span>
          <h2 className="text-[24px] md:text-7xl font-normal tracking-[-0.03em] text-[#0D0D0D] leading-[1.1] mb-4 uppercase">
            不是副眼镜 <br /> 是生活的窗口
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['沟通', '独立', '看见世界'].map((tag) => (
              <span key={tag} className="rounded-[10px] bg-black/5 px-3 py-1.5 text-[12px] font-normal uppercase text-[#0D0D0D]">{tag}</span>
            ))}
          </div>
          <p className="mb-4 max-w-md text-[14px] font-normal leading-relaxed text-black/60 md:text-lg">致力于科技平权，AWAK Glasses 让每一位用户都能平等地享受现代科技带来的自由。</p>
          <button onClick={scrollToParams} className="w-fit rounded-full bg-[#0D0D0D] px-6 py-3 text-[14px] font-normal text-white transition active:scale-[0.98]">
            选择款式
          </button>
        </div>
      </section>

      {/* SECTION 5: ECOSYSTEM SYNERGY */}
      <section className="bg-[#FAFAFA] py-8 pb-8 text-left">
        <div className="mb-8 flex justify-center px-6">
          <img
            src="https://i.ibb.co/zTQKV09Y/jimeng-2026-04-20-2515.png"
            alt="AWAK Ring Synergy"
            className="h-auto w-full max-w-[300px] object-contain"
          />
        </div>
        <div className="px-6 md:px-[170px]">
          <p className="mb-1.5 text-[11px] font-normal tracking-[0.1em] text-[#888] uppercase">AWAK ECOSYSTEM</p>
          <h2 className="mb-10 text-[28px] font-normal leading-[1.15] tracking-[-0.05em] text-[#0A0A0A] md:text-3xl">
            配合 AWAK RING & AWAK WATCH <br />
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
        <motion.div initial={{ opacity: 0, scale: 0.98, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 12 }} className="relative bg-[#1A1A1A] rounded-[12px] w-full max-w-2xl p-4 md:p-12 overflow-hidden">
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
              <h2 className="text-[24px] md:text-3xl font-normal tracking-[-0.03em] text-white">选择适合你的镜框</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-8 py-4 md:py-8">
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">中号 (M)</h3>
                <p className="text-[14px] font-normal text-white/70 leading-[1.6]">适合绝大部分脸型。佩戴紧凑，不易滑落。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">大号 (L)</h3>
                <p className="text-[14px] font-normal text-white/70 leading-[1.6]">专为宽大脸型设计。提供更舒适的颞部间隙。</p>
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

export default SmartGlassesPage;
