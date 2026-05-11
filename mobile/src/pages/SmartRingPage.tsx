import React, { useState, useRef } from 'react';
import { Activity, Zap, ShieldCheck, FileText, Ruler, Check, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FooterSections from '../components/FooterSections';
import { useNavigate } from 'react-router-dom';
import { useLocalePath } from '../hooks/useLocalePath';
import ImageTextCarousel from '../components/ImageTextCarousel';

const RING_VARIANTS = [
  { id: 'base', name: 'Awak Ring 基础款', price: '¥1,999', color: '钛金银', img: 'https://i.ibb.co/k6WGBH5y/jimeng-2026-04-20-1780.png' },
  { id: 'sport', name: 'Awak Ring 运动款', price: '¥2,199', color: '墨影黑', img: 'https://i.ibb.co/yBFXz43J/018aa8cd061047db86cc870ea392dcd6.png' },
  { id: 'fashion', name: 'Awak Ring 时尚款', price: '¥2,399', color: '璀璨金', img: 'https://i.ibb.co/N28C7vWs/2.png' },
  { id: 'premium', name: 'Awak Ring 定制款', price: '¥2,999', color: '玫瑰金', img: 'https://i.ibb.co/hR6jS51T/6.png' },
];

type CompareKey = 'ring' | 'band' | 'watch';

const COMPARE_STATS: Record<
  CompareKey,
  { s1: string; s1u: string; s1d: string; s2: string; s2u: string; s2d: string; s3: string; s3u: string; s3d: string }
> = {
  ring: {
    s1: '50',
    s1u: '+',
    s1d: '全维度生理数据追踪',
    s2: '1',
    s2u: '%',
    s2d: '医学级血氧和脉搏精度',
    s3: '7',
    s3u: '天',
    s3d: '不间断的健康守护',
  },
  band: {
    s1: '40',
    s1u: '+',
    s1d: '多源生理数据整合',
    s2: '2',
    s2u: '%',
    s2d: '临床级脉搏血氧精度',
    s3: '30',
    s3u: '天',
    s3d: '一次充电长效陪伴',
  },
  watch: {
    s1: '80',
    s1u: '+',
    s1d: '运动与恢复指标全覆盖',
    s2: '1',
    s2u: '%',
    s2d: '高精度光学监测',
    s3: '14',
    s3u: '天',
    s3d: '典型使用续航',
  },
};

const SmartRingPage: React.FC = () => {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compareKey, setCompareKey] = useState<CompareKey>('ring');
  const paramsRef = useRef<HTMLDivElement>(null);

  const scrollToParams = () => {
    paramsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-base text-fg-primary font-sans antialiased selection:bg-accent selection:text-ink">
      {/* SECTION 1: HERO */}
      <div className="relative min-h-[70vh] overflow-hidden bg-base md:min-h-screen">
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

        {/* Copy placement aligned with HomePage Hero (bottom) */}
        <div className="relative z-10 h-full pb-10 pt-24 md:pb-36 md:pt-0">
          <div className="container flex h-full flex-col justify-end">
            <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="mb-6 text-[32px] font-normal leading-none tracking-tighter text-fg-primary md:text-[clamp(40px,12vw,72px)] uppercase">
              AWAK RING <br/> 
              <span className="mt-3 block text-fg-primary">看懂身体变化</span>
            </h1>
            <p className="mb-0 max-w-2xl text-[14px] font-normal leading-[1.7] text-fg-secondary md:text-[18px]">
              用一枚戒指，持续感知你的状态。读懂身体每一次细微变化，并转化为可执行的健康行动。
            </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECTION: 读懂身体细微变化 — STATS + compare */}
      <section className="bg-bg-light py-8 text-left text-ink">
        <div className="container">
          <div className="mx-auto w-full max-w-[520px] md:max-w-none md:grid md:grid-cols-2 md:items-start md:gap-16">
          <div className="mb-8 md:mb-0">
            <h2 className="mb-4 text-[32px] font-normal leading-[1.15] tracking-[-0.05em] text-ink md:text-[40px]">
              读懂身体
              <br />
              细微变化
            </h2>
            <p className="m-0 max-w-xl text-[14px] font-normal leading-[1.75] tracking-[-0.01em] text-ink/65">
              光学心率传感器以每秒 256Hz 采样，捕捉心率变异率（HRV）、血氧饱和度（SpO₂）、皮肤温度等 50+ 项生理指标。
            </p>
          </div>

          <div>
            <div className="mb-8">
              <p className="m-0 mb-2.5 text-[11px] font-normal tracking-[0.08em] uppercase text-ink/45">相比</p>
              <div className="relative w-full">
                <select
                  value={compareKey}
                  onChange={(e) => setCompareKey(e.target.value as CompareKey)}
                  aria-label="对比产品"
                  className="w-full appearance-none rounded-full border border-black/10 bg-white py-3 pl-4 pr-11 text-[15px] font-normal text-ink outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                >
                  <option value="ring">AWAK RING</option>
                  <option value="band">AWAK BRACELET</option>
                  <option value="watch">AWAK WATCH</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/60">
                  <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {(() => {
              const st = COMPARE_STATS[compareKey];
              return (
                <div>
                  <div className="border-t border-black/10 py-6">
                    <p className="m-0 mb-2 text-[11px] font-normal tracking-[0.08em] uppercase text-ink/45">健康指标</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[40px] font-normal leading-none tracking-[-0.04em] text-ink">{st.s1}</span>
                      <span className="text-[18px] font-normal text-ink/70">{st.s1u}</span>
                    </div>
                    <p className="mb-0 mt-1 text-[12px] font-normal tracking-[-0.01em] text-ink/45">{st.s1d}</p>
                  </div>
                  <div className="border-t border-black/10 py-6">
                    <p className="m-0 mb-2 text-[11px] font-normal tracking-[0.08em] uppercase text-ink/45">采样精度</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[40px] font-normal leading-none tracking-[-0.04em] text-ink">{st.s2}</span>
                      <span className="text-[18px] font-normal text-ink/70">{st.s2u}</span>
                    </div>
                    <p className="mb-0 mt-1 text-[12px] font-normal tracking-[-0.01em] text-ink/45">{st.s2d}</p>
                  </div>
                  <div className="border-y border-black/10 py-6">
                    <p className="m-0 mb-2 text-[11px] font-normal tracking-[0.08em] uppercase text-ink/45">超长续航</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[40px] font-normal leading-none tracking-[-0.04em] text-ink">{st.s3}</span>
                      <span className="text-[18px] font-normal text-ink/70">{st.s3u}</span>
                    </div>
                    <p className="mb-0 mt-1 text-[12px] font-normal tracking-[-0.01em] text-ink/45">{st.s3d}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT PARAMETERS */}
      <section ref={paramsRef} className="bg-white py-8 text-left text-ink">
        <div className="container flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-[24px] font-normal tracking-[-0.03em] text-ink md:text-4xl uppercase">产品参数</h2>
            <p className="text-[14px] font-normal text-ink/65 md:text-lg">对比不同版本，选择最适合你的健康伙伴</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 content-stretch">
            {[
              {
                id: 'base',
                title: '基础款',
                subtitle: '日常生理监测',
                img: RING_VARIANTS[0].img,
                specs: [
                  '钛合金',
                  '1芯+6传感',
                  '睡眠监测',
                  '心率',
                  '血氧饱和度',
                  '情绪压力（HRV 生理期/孕期管理）',
                  'ECG（房颤/早搏筛查）',
                  '运动检测',
                  '梅脱METS',
                  '姿态和行为轨迹 AI营养师',
                  '炎症反应',
                ],
              },
              {
                id: 'sport',
                title: '运动款',
                subtitle: '针对训练优化',
                img: RING_VARIANTS[1].img,
                specs: [
                  '外圈可拆卸',
                  '1芯+6传感',
                  '睡眠监测',
                  '心率',
                  '血氧饱和度',
                  '情绪压力（HRV 生理期/孕期管理）',
                  'ECG（房颤/早搏筛查） 血压检测',
                  '运动检测',
                  '梅脱METS',
                  '姿态和行为轨迹 AI营养师',
                  '炎症反应',
                ],
              },
              {
                id: 'fashion',
                title: '时尚款',
                subtitle: '时尚设计',
                img: RING_VARIANTS[2].img,
                specs: [
                  '时尚设计',
                  '1芯+6传感',
                  '睡眠监测',
                  '心率',
                  '血氧饱和度',
                  '情绪压力（HRV 生理期/孕期管理）',
                  'ECG（房颤/早搏筛查） 血压检测',
                  '运动检测',
                  '梅脱METS',
                  '姿态和行为轨迹 AI营养师',
                  '炎症反应',
                ],
              },
              {
                id: 'premium',
                title: '定制款',
                subtitle: '极致定制体验',
                img: RING_VARIANTS[3].img,
                specs: [
                  '贵金属',
                  'IP联名',
                  '1芯+6传感',
                  '睡眠监测',
                  '心率',
                  '血氧饱和度',
                  '情绪压力（HRV 生理期/孕期管理）',
                  'ECG（房颤/早搏筛查） 血压检测',
                  '运动检测',
                  '梅脱METS',
                  '姿态和行为轨迹 AI营养师',
                  '炎症反应',
                ],
              },
            ].map((card, idx) => {
              const imageScale = card.id === 'sport' ? 'scale-[1.55]' : card.id === 'premium' ? 'scale-[1.4]' : 'scale-100';
              const material = card.specs[0];
              const featureSpecs = card.specs.slice(1);
              const hasGreyBg = true;
              return (
                <div
                  key={card.id}
                  className={`flex flex-col h-full overflow-hidden rounded-[12px] ${hasGreyBg ? 'bg-bg-light' : 'bg-white'}`}
                >
                  <div
                    className={`relative flex h-[220px] shrink-0 items-center justify-center ${hasGreyBg ? 'bg-white/60' : 'bg-bg-light'} p-4 sm:h-[240px] md:h-[280px] md:p-8`}
                  >
                    <span
                      className="absolute left-3 top-3 z-10 inline-flex max-w-[min(12rem,calc(100%-1.5rem))] rounded-full bg-ink px-3 py-1 text-[12px] font-normal text-white border-none"
                    >
                      {card.title}
                    </span>
                    <img
                      src={card.img}
                      alt={card.title}
                      className={`max-h-full w-full max-w-full object-contain transition-transform ${imageScale}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 text-left md:p-6">
                    <p className="mb-[18px] border-b border-black/10 pb-[18px] text-[14px] font-normal leading-snug text-ink/70">
                      {card.subtitle} · {material}
                    </p>
                    <ul className="mb-6 flex flex-1 flex-col">
                      {featureSpecs.map((spec, idx) => (
                        <li
                          key={`${card.id}-${idx}`}
                          className="flex gap-3 border-b border-black/10 py-[14px] text-left last:border-b-0"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={1.5} />
                          <span className="text-[14px] font-normal leading-snug text-ink">{spec}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => navigate(withPath('/store/ring'))}
                      className={[
                        'mt-auto flex h-12 w-full items-center justify-center rounded-full text-[14px] font-semibold transition-colors active:scale-[0.98]',
                        hasGreyBg ? 'bg-ink text-white hover:bg-ink/90' : 'bg-accent text-ink hover:bg-accent-hover',
                      ].join(' ')}
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
      <section className="bg-white py-8 text-left text-ink">
        <div className="container flex flex-col">
          <div className="mb-8 flex max-w-2xl flex-col gap-2">
            <h2 className="text-[24px] font-normal tracking-[-0.03em] text-ink md:text-4xl uppercase">指尖健康，触手可及</h2>
            <p className="text-[14px] font-normal leading-relaxed text-ink/70 md:text-lg">
            Awak Ring 以航空级钛合金铸造，重量仅 4.8g，全程无屏，数据在感知，生活不打扰。
            </p>
          </div>

          <div className="md:hidden">
            <ImageTextCarousel
              slides={[
                { title: '24/7全天候呼吸频率与心率捕捉', image: 'https://i.ibb.co/N62vFRxv/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-2.jpg' },
                { title: '深度睡眠阶段精准分析', image: 'https://i.ibb.co/B5tmTR92/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-3.jpg' },
                { title: '运动感知自动识别', image: 'https://i.ibb.co/xKgfc5rN/Oura.jpg' },
                { title: 'AI 智能分析方案', image: 'https://i.ibb.co/rGBsRRmc/Dreame-AI-Smart-Ring-Life-s-little-moments-upgraded.png' },
                { title: '时刻连接，尽在掌控', image: 'https://i.ibb.co/NdKRwh1g/Dreame-AI-Smart-Ring-Stay-present-yet-connected.jpg' },
              ]}
              imageHeightPx={312}
              outerRoundedClassName="rounded-[12px]"
              imageWrapperClassName="overflow-hidden rounded-[12px] bg-bg-light"
              imageClassName="h-full w-full object-cover"
              align="left"
              titleClassName="text-ink text-[22px] font-normal tracking-tight leading-snug"
            />
          </div>

          <div className="hidden md:flex flex-col gap-8 md:min-h-0">
            <div className="grid min-h-[336px] grid-cols-1 gap-8 md:grid-cols-2 md:min-h-[336px] md:flex-[0_0_58%]">
              <div className="group relative min-h-[240px] overflow-hidden rounded-[12px] md:min-h-[336px]">
                <img
                  src="https://i.ibb.co/N62vFRxv/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-2.jpg"
                  alt=""
                  className="h-full min-h-[240px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 md:min-h-[336px]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-8 text-left md:p-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-normal tracking-widest text-white/40 uppercase">静谧监测</span>
                    <h3 className="text-2xl font-normal text-white">24/7全天候呼吸频率与心率捕捉</h3>
                  </div>
                </div>
              </div>
              <div className="group relative min-h-[240px] overflow-hidden rounded-[12px] md:min-h-[336px]">
                <img
                  src="https://i.ibb.co/B5tmTR92/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-3.jpg"
                  alt=""
                  className="h-full min-h-[240px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 md:min-h-[336px]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-8 text-left md:p-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-normal tracking-widest text-white/40 uppercase">睡眠追踪</span>
                    <h3 className="text-2xl font-normal text-white">深度睡眠阶段精准分析</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid min-h-[240px] grid-cols-1 gap-8 md:grid-cols-3 md:min-h-[240px] md:flex-[0_0_42%] md:min-h-[288px]">
              <div className="group relative min-h-[200px] overflow-hidden rounded-[12px] md:min-h-[288px]">
                <img
                  src="https://i.ibb.co/xKgfc5rN/Oura.jpg"
                  alt=""
                  className="h-full min-h-[200px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 md:min-h-[288px]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-7 text-left md:p-8">
                  <h3 className="text-xl font-normal text-white">运动感知自动识别</h3>
                </div>
              </div>
              <div className="group relative min-h-[200px] overflow-hidden rounded-[12px] md:min-h-[288px]">
                <img
                  src="https://i.ibb.co/rGBsRRmc/Dreame-AI-Smart-Ring-Life-s-little-moments-upgraded.png"
                  alt=""
                  className="h-full min-h-[200px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 md:min-h-[288px]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-7 text-left md:p-8">
                  <h3 className="text-xl font-normal text-white">AI 智能分析方案</h3>
                </div>
              </div>
              <div className="group relative min-h-[200px] overflow-hidden rounded-[12px] md:min-h-[288px]">
                <img
                  src="https://i.ibb.co/NdKRwh1g/Dreame-AI-Smart-Ring-Stay-present-yet-connected.jpg"
                  alt=""
                  className="h-full min-h-[200px] w-full object-cover transition-transform duration-1000 group-hover:scale-105 md:min-h-[288px]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-7 text-left md:p-8">
                  <h3 className="text-xl font-normal text-white">时刻连接，尽在掌控</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ABOUT */}
      <section className="bg-bg-light py-8 text-left text-ink">
        <div className="container">
          <div className="flex w-full max-w-[980px] flex-col">
          <span className="mb-3 block text-[12px] font-normal tracking-[0.12em] text-ink/45 uppercase">
            每一种状态，都有属于它的形态
          </span>
          <h2 className="mb-4 text-[24px] font-normal uppercase leading-[1.1] tracking-[-0.03em] text-ink md:text-6xl">
            不只是戒指 <br /> 是健康闭环
          </h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {['感知', '分析', '改善'].map((tag) => (
              <span
                key={tag}
                className="rounded-[10px] bg-black/5 px-3 py-1.5 text-[12px] font-normal uppercase text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mb-4 max-w-md text-[14px] font-normal leading-relaxed text-ink/65 md:text-lg">
            从感知到改善的完整健康闭环，AWAK Ring 始终助力你成为最了解自己身体的人。
          </p>
          <button
            type="button"
            onClick={scrollToParams}
            className="w-fit rounded-full bg-ink px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-ink/90 active:scale-[0.98]"
          >
            选择款式
          </button>
        </div>
        </div>
      </section>

      {/* SECTION 5: AWAK BRACELET cross-sell */}
      <section className="bg-bg-light py-8 pb-8 text-left text-ink">
        <div className="container">
        <div className="mb-8 flex justify-center">
          <img
            src="https://i.ibb.co/JWDBKFgn/image.png"
            alt="AWAK BRACELET"
            className="h-auto w-full max-w-[300px] object-contain"
          />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-normal tracking-[0.1em] text-ink/45 uppercase">AWAK BRACELET</p>
          <h2 className="mb-10 text-[28px] font-normal leading-[1.15] tracking-[-0.05em] text-ink md:text-3xl">配合使用更完整</h2>
        </div>

        <div className="grid grid-cols-2 border-b border-t border-black/10">
          <BoxItem
            className="border-b border-r border-black/10 p-6"
            icon={<Activity className="h-[22px] w-[22px] text-ink" strokeWidth={1.5} />}
            name="多端协同"
            desc="戒指与手环数据互补，构建更精准的健康画像"
          />
          <BoxItem
            className="border-b border-black/10 p-6"
            icon={<Zap className="h-[22px] w-[22px] text-ink" strokeWidth={1.5} />}
            name="即时反馈"
            desc="配合 AWAK App 实时获取改善建议"
          />
          <BoxItem
            className="border-r border-black/10 p-6"
            icon={<ShieldCheck className="h-[22px] w-[22px] text-ink" strokeWidth={1.5} />}
            name="医生服务"
            desc="旗舰版用户享有一年私人健康报告解读"
          />
          <BoxItem
            className="p-6"
            icon={<FileText className="h-[22px] w-[22px] text-ink" strokeWidth={1.5} />}
            name="运动指导"
            desc="结合 AI 运动教练，发掘身体更大的潜能"
          />
        </div>
        </div>
      </section>

      <FooterSections />
      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const SizeGuideModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[12px] bg-[#1A1A1A] p-4 text-left md:p-12"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-8 right-8 text-white/40 transition-colors hover:text-white"
            aria-label="关闭"
          >
            <X className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex items-center gap-4">
              <Ruler className="h-8 w-8 text-white/40" strokeWidth={1.5} />
              <h2 className="text-[24px] font-normal tracking-[-0.03em] text-white md:text-3xl">选择适合你的款式</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 py-4 md:gap-8 md:py-8">
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">标准戒圈</h3>
                <p className="text-[14px] font-normal leading-[1.6] text-white/70">提供 6-13 号全尺寸选择，精准适配每一个关节。</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-[18px] font-normal text-white">超轻系列</h3>
                <p className="text-[14px] font-normal leading-[1.6] text-white/70">专为敏感肤质设计，极薄工艺减负佩戴。</p>
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

export default SmartRingPage;
