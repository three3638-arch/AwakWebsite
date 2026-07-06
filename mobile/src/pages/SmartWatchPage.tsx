import React, { useState, useRef } from 'react';
import { Activity, Zap, ShieldCheck, FileText, Ruler, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';
import ImageTextCarousel from '../components/ImageTextCarousel';

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
    <div className="bg-[#0D0D0D] min-h-screen font-sans selection:bg-white selection:text-black">
      {/* SECTION 1: HERO */}
      <div className="relative overflow-hidden bg-[#0D0D0D] min-h-[70vh] md:min-h-screen">
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

        {/* Copy placement aligned with HomePage Hero (bottom) */}
        <div className="relative z-10 px-6 md:px-[170px] pt-24 md:pt-0 pb-10 md:pb-36 h-full flex flex-col justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-[32px] md:text-8xl font-normal text-white leading-[1.1] tracking-[-0.04em] mb-6 uppercase">
              AWAK WATCH <br/> 
              <span className="text-white block mt-3">掌控运动状态</span>
            </h1>
            <p className="text-[14px] md:text-2xl text-white/60 font-normal leading-[1.6] mb-0 max-w-2xl">
              持续感知状态，理解每一次身体变化。航天级金属打造，专为突破潜能的你而生。
            </p>
          </motion.div>
        </div>
      </div>

      {/* SECTION: 核心能力 — Ring-style left aligned stats */}
      <section className="bg-[#FAFAFA] py-8 px-6 md:px-[170px] text-left">
        <div className="mx-auto w-full max-w-[520px] md:max-w-none md:grid md:grid-cols-2 md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0">
            <h2 className="text-[32px] font-normal text-[#0A0A0A] tracking-[-0.05em] leading-[1.15] mb-4 md:text-[40px]">
              极致性能
              <br />
              无畏挑战
            </h2>
            <p className="text-[14px] text-[#666] leading-[1.75] m-0 tracking-[-0.01em] font-normal max-w-xl">
              配备多频双星定位系统 (L1 + L5)，典型模式实现 14 天超长续航。10ATM 防水性能支持 100 米专业级潜水。
            </p>
          </div>

          <div>
            {[
              { label: '定位精度', value: '99', unit: '%', desc: '多频双星 L1+L5 系统' },
              { label: '防水等级', value: '100', unit: 'm', desc: '支持 10ATM 专业潜水' },
              { label: '典型续航', value: '14', unit: '天', desc: '全天候伴随无忧' },
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
                title: '基础版',
                subtitle: '日常监控',
                img: WATCH_VARIANTS[0].img,
                specs: ["睡眠监测", "心率监测", "血氧饱和度", "运动检测", "运动模式", "轻量分析", "运动强度", "情绪压力", "姿势&行为轨迹"]
              },
              {
                id: 'pro',
                title: '专业版',
                subtitle: '专业训练',
                img: WATCH_VARIANTS[1].img,
                specs: ["睡眠监测", "心率监测", "血氧饱和度", "运动检测", "运动模式", "轻量分析", "运动强度", "情绪压力", "姿势&行为轨迹"]
              },
              {
                id: 'custom',
                title: '尊享款',
                subtitle: '极限探索',
                img: WATCH_VARIANTS[2].img,
                specs: ["睡眠监测", "高精度心率监测", "血氧饱和度", "运动检测", "运动模式", "轻量分析", "运动强度", "情绪压力", "姿势&行为轨迹", "潜水模式"]
              },
              {
                id: 'medical',
                title: '医疗款',
                subtitle: '医疗级监护',
                img: WATCH_VARIANTS[3].img,
                specs: ["睡眠监测", "高精度心率监测", "血氧饱和度", "运动检测", "运动模式", "轻量分析", "运动强度", "情绪压力", "姿势&行为轨迹", "潜水模式", "ECG心电监测", "血压检测", "行为与健康分析"]
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
                    onClick={() => navigate(withPath('/store/watch'))}
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
          <h2 className="text-[24px] font-normal tracking-[-0.03em] text-[#0D0D0D] uppercase md:text-4xl">专业运动，腕上全能教练</h2>
          <p className="text-[14px] md:text-xl font-normal text-[#0D0D0D]/70 max-w-2xl">从极地荒野到繁华都市，AWAK Watch 始终以最精准的姿态引领你的每一步。</p>
        </div>
        
        <div className="md:hidden">
          <ImageTextCarousel
            slides={[
              { title: '多频双星，位置分秒不差', image: 'https://i.ibb.co/WWpxcs9y/51-Pinterest-1.jpg' },
              { title: '24/7 深度睡眠与压力监测', image: 'https://i.ibb.co/bjhJcCt1/51-Pinterest-2.jpg' },
              { title: '极致竞技分析', image: 'https://i.ibb.co/rGrWSFvw/51-Pinterest.webp' },
              { title: '全天候探险伴随', image: 'https://i.ibb.co/0pQfqZQL/Ironway-Pin.png' },
              { title: '优雅与力量。', image: 'https://i.ibb.co/ynqTH9m4/CHANEL-Pin.jpg' },
            ]}
          />
        </div>

        <div className="hidden md:flex flex-col gap-5 md:gap-6 md:flex-1 md:min-h-0">
          {/* Row 1: 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 h-auto md:flex-[0_0_58%] md:min-h-0">
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/WWpxcs9y/51-Pinterest-1.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-normal tracking-widest uppercase">户外训练</span>
                     <h3 className="text-white text-2xl font-normal">多频双星，位置分秒不差</h3>
                   </div>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/bjhJcCt1/51-Pinterest-2.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 md:p-10">
                   <div className="flex flex-col gap-2">
                     <span className="text-white/40 text-xs font-normal tracking-widest uppercase">静息生活</span>
                     <h3 className="text-white text-2xl font-normal">24/7 深度睡眠与压力监测</h3>
                   </div>
                </div>
             </div>
          </div>
          
          {/* Row 2: 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 h-auto md:flex-[0_0_42%] md:min-h-0">
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/rGrWSFvw/51-Pinterest.webp" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">极致竞技分析</h3>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/0pQfqZQL/Ironway-Pin.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">全天候探险伴随</h3>
                </div>
             </div>
             <div className="rounded-[14px] overflow-hidden group relative">
                <img src="https://i.ibb.co/ynqTH9m4/CHANEL-Pin.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-7 md:p-8">
                   <h3 className="text-white text-xl font-normal">优雅与力量。</h3>
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
            不是一块手表 <br /> 是无限潜能
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['专注', '极限', '平衡'].map((tag) => (
              <span key={tag} className="rounded-[10px] bg-black/5 px-3 py-1.5 text-[12px] font-normal uppercase text-[#0D0D0D]">{tag}</span>
            ))}
          </div>
          <p className="mb-4 max-w-md text-[14px] font-normal leading-relaxed text-black/60 md:text-lg">从感知到改善的完整健康闭环，AWAK Watch 始终助力你成为最了解自己身体的人。</p>
          <button onClick={scrollToParams} className="w-fit rounded-full bg-[#0D0D0D] px-6 py-3 text-[14px] font-normal text-white transition active:scale-[0.98]">
            选择款式
          </button>
        </div>
      </section>

      {/* SECTION 5: ECOSYSTEM SYNERGY */}
      <section className="bg-[#FAFAFA] py-8 pb-8 text-left">
        <div className="mb-8 flex justify-center px-6">
          <img
            src="https://i.ibb.co/G43Fy2S7/image.png"
            alt="Awak Health Synergy"
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
            name="协同监测"
            desc="运动 + 恢复一体"
          />
          <BoxItem
            className="border-b border-[#E8E8E8] p-6"
            icon={<Zap className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="全天覆盖"
            desc="昼夜无缝追踪"
          />
          <BoxItem
            className="border-r border-[#E8E8E8] p-6"
            icon={<ShieldCheck className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="精准理解"
            desc="数据融合更准"
          />
          <BoxItem
            className="p-6"
            icon={<FileText className="h-[22px] w-[22px] text-[#0A0A0A]" strokeWidth={1.5} />}
            name="持续优化"
            desc="从数据到改变"
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
              <h2 className="text-[24px] md:text-3xl font-normal tracking-[-0.03em] text-white">选择适合你的腕围</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-8 py-4 md:py-8">
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">42mm 标准版</h3>
                <p className="text-[14px] font-normal text-white/70 leading-[1.6]">适合大部分男士。视野开阔，操控精准。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">38mm 轻巧版</h3>
                <p className="text-[14px] font-normal text-white/70 leading-[1.6]">适合细小腕部。佩戴轻盈，无负担感。</p>
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

export default SmartWatchPage;
