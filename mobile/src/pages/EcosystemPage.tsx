import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Globe,
  Activity,
  X,
  Sparkles,
  ClipboardList,
  CloudUpload,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FooterSections from '../components/FooterSections';
import { useLocalePath } from '../hooks/useLocalePath';

export default function EcosystemPage() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const privacyContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[12px] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative"
      >
        <button 
          type="button"
          onClick={() => setIsPrivacyModalOpen(false)}
          className="absolute right-6 top-6 z-10 rounded-full bg-black/5 p-2 transition-colors hover:bg-black/10"
          aria-label="关闭"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <div className="overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <h2 className="mb-[14px] text-[24px] font-normal tracking-[-0.03em] text-[#0D0D0D]">AWAK 用户隐私保护政策</h2>
          <div className="space-y-6 text-[14px] font-normal leading-[1.6] text-black/60">
            <section>
              <h3 className="mb-2 text-[18px] font-normal text-[#0D0D0D]">1. 数据收集与加密</h3>
              <p>我们收集的所有健康数据（包括但不限于心率、血氧、睡眠阶段、体温等）均在设备端进行初步脱敏。在传输至云端前，所有数据均采用 AES-256 金融级端到端加密体系。解密密钥仅存储在您的本地设备安全芯片中。</p>
            </section>
            <section>
              <h3 className="mb-2 text-[18px] font-normal text-[#0D0D0D]">2. 数据所有权</h3>
              <p>您对您的生理数据拥有 100% 的绝对所有权。AWAK 仅作为数据的处理与分析方。我们承诺永远不会向任何第三方广告商、保险公司或数据中介出售您的个人身份健康信息。</p>
            </section>
            <section>
              <h3 className="mb-2 text-[18px] font-normal text-[#0D0D0D]">3. 匿名化与研究</h3>
              <p>为了改进我们的健康模型，我们可能会使用去标识化的聚合数据进行算法训练。这些数据经过严格的差异隐私（Differential Privacy）处理，确保无法溯源至任何特定个体。</p>
            </section>
            <section>
              <h3 className="mb-2 text-[18px] font-normal text-[#0D0D0D]">4. 您的权利</h3>
              <p>您可以随时通过 AwakHealth App 查阅、导出、更正或请求删除您的全部数据。一旦您选择注销账户，我们将在 7 个工作日内从全球范围内所有的服务器上彻底销毁您的所有数字生命痕迹。</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#0A0A0A] antialiased">
      <AnimatePresence>
        {isPrivacyModalOpen && privacyContent}
      </AnimatePresence>
      
      {/* 首屏高度与首页 Hero 一致：min-h-[100dvh] + 同款上下内边距 */}
      <section className="relative mb-0 flex min-h-[100dvh] min-h-0 flex-col overflow-hidden bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#0A0A0A] pt-20 pb-12 md:pt-16 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://i.ibb.co/xKX2CFGN/1.png')] bg-cover bg-center opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col px-6 md:px-[170px]">
          <div className="min-h-[clamp(80px,18vh,220px)] flex-1" aria-hidden />
          <div className="text-left">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-2 text-[32px] font-normal leading-[1.15] tracking-[-0.04em] text-white"
              >
                AWAK 不只是一枚戒指
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mb-4 text-[32px] font-normal leading-[1.15] tracking-[-0.04em] text-white"
              >
                而是完整的健康生态系统
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-2xl text-[14px] font-normal leading-[1.6] text-white/60"
            >
              硬件采集高精度数据，软件提供深度分析，服务闭环精准干预。我们重新定义健康管理的边界，为你打造无缝的数字健康人生。
            </motion.p>
          </div>
        </div>
      </section>

      {/* 02b merged into hero */}

      {/* 03. 三位一体 — 区块 py 72px；标题与轮播 mb 72px（md） */}
      <section className="relative bg-[#F5F5F3] py-[72px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-[170px]">
          <div className="mb-12 max-w-4xl text-left md:mb-[72px]">
            <h2 className="mb-2 text-[26px] font-normal leading-[1.2] tracking-[-0.03em] text-[#0D0D0D]">三位一体健康基石</h2>
            <p className="text-[14px] font-normal leading-[1.6] text-black/60">不仅仅是监测，更是从数据到行动的全程陪伴</p>
          </div>
          
          <div
            className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide md:mx-0 md:px-0"
            aria-label="三位一体健康基石轮播"
          >
            {[
              {
                title: '精准采集 (硬件)',
                icon: Activity,
                points: ['工业级高精度传感器', '24/7 不间断体征监测', '无感佩戴，长效续航'],
                delay: 0,
              },
              {
                title: '智能解析 (App)',
                icon: Smartphone,
                points: ['AwakHealth 核心算法', '生成个体生理基线表', '多维度趋势预测分析'],
                delay: 0.08,
              },
              {
                title: '全周期服务',
                icon: Globe,
                points: ['AI 专属健康教练', '专业体检/保险服务联动', '全球化销售与售后支持'],
                delay: 0.16,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: item.delay }}
                className="min-w-[256px] max-w-[256px] md:min-w-[288px] md:max-w-[288px] snap-start"
              >
                <div className="rounded-[12px] bg-[#FAFAFA] px-5 pb-6 pt-7 md:px-5 md:pb-6 md:pt-7">
                  <div className="mb-[18px] inline-flex h-12 w-12 items-center justify-center rounded-[12px]">
                    <Icon className="h-6 w-6 text-black" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="m-0 text-[18px] font-normal leading-[1.3] tracking-[-0.02em] text-[#0D0D0D]">
                    {item.title}
                  </h3>

                  <ul className="mt-4 space-y-3 text-left">
                    {item.points.map((p, j) => (
                      <li key={j} className="text-[#0D0D0D]/70 text-[14px] font-normal leading-[1.6]">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
            })}
          </div>
        </div>
      </section>

      {/* 04. AwakHealth App */}
      <section className="bg-[#FAFAFA] py-[72px]">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-6 text-left md:grid-cols-12 md:gap-12 md:px-[170px]">
          <div className="md:col-span-7">
            <h2 className="mb-6 text-[26px] font-normal leading-[1.2] tracking-[-0.03em] text-[#0D0D0D] md:mb-8">
              你的数字健康控制中心
            </h2>
            <p className="mb-8 max-w-xl text-[14px] font-normal leading-[1.6] text-black/60 md:mb-12 md:leading-[1.7]">
              AwakHealth 不是一个冷冰冰的数据看板，而是懂你的私人健康助理。每一次心跳，每一夜睡眠，都化作最直观的建议。
            </p>
            <div className="mb-0 space-y-6 md:space-y-8">
              {[
                {
                  title: '多维度健康指标',
                  desc: '心率、血氧、HRV、体温，一站式整合分析，告别碎片化应用',
                },
                {
                  title: '智能洞察模型',
                  desc: '依托百万级大数据库，建立仅属你一个人的个体生理基线',
                },
                {
                  title: '动态健康建议',
                  desc: '不仅告诉你昨晚睡得差，还会告诉你今晚如何能睡得更好',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="mb-1 text-[18px] font-normal text-[#0D0D0D]">{item.title}</h3>
                  <p className="text-[14px] font-normal leading-[1.6] text-black/60">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:mt-20 md:px-[170px]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[
              { title: '全时监测', desc: '戒指采集核心体征', icon: Activity },
              { title: 'AI 分析', desc: 'AwakHealth 算法解读', icon: Sparkles },
              { title: '干预方案', desc: 'AI 生成改善策略', icon: ClipboardList },
              { title: '数据同步', desc: '蓝牙秒级上传云端', icon: CloudUpload },
              { title: '健康报告', desc: '生成个性化洞察', icon: FileText },
              { title: '闭环进化', desc: '持续优化身体状态', icon: RefreshCw },
            ].map((item, i) => {
              const CardIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-[12px] bg-[#F5F5F5] p-4 text-left md:p-5"
                >
                  <CardIcon className="mb-3 h-6 w-6 text-[#0D0D0D]" strokeWidth={1.5} aria-hidden />
                  <div className="mb-1 text-[14px] font-normal text-[#0D0D0D]">{item.title}</div>
                  <div className="text-[12px] font-normal leading-[1.6] text-black/55">{item.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* 05. App 功能模块 */}
      <section className="bg-[#F5F5F3] py-[72px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 text-left md:px-[170px]">
           <div className="mb-12 md:mb-[72px]">
             <h2 className="mb-2 text-[24px] font-normal leading-[1.2] tracking-[-0.03em] text-[#0D0D0D] md:mb-4">全场景健康守护</h2>
             <p className="text-[14px] font-normal leading-[1.6] text-black/60">打破生活边界，用科技守护每个重要时刻</p>
           </div>
           <div
             className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide md:mx-0 md:px-0"
             aria-label="全场景健康守护轮播"
           >
             {[
               {
                 eyebrow: '深睡眠解码',
                 title: '深睡眠解码',
                 desc: '识别五大睡眠阶段，下探至分钟级的生理指标波动，定位疲惫根源。',
                 image: 'https://i.ibb.co/MkPGBT9k/Oura.jpg',
               },
               {
                 eyebrow: '专业运动图谱',
                 title: '专业运动图谱',
                 desc: '全量同步血氧、心率轨迹，深度分析肌肉恢复与有氧/无氧负荷占比。',
                 image: 'https://i.ibb.co/wNWh2hW1/image.png',
               },
               {
                 eyebrow: '压力与心流',
                 title: '压力与心流',
                 desc: '全天候 HRV 实时监测，在压力临界点提示并引导深呼吸与正念练习。',
                 image: 'https://i.ibb.co/cKjxbXng/image.png',
               },
               {
                 eyebrow: '女性健康闭环',
                 title: '女性健康闭环',
                 desc: '基于精细的基础体温变化趋势，精准预测生理周期，闭环管理身心健康。',
                 image: 'https://i.ibb.co/fG4mkFd2/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-4.jpg',
               },
               {
                 eyebrow: '家庭共享关怀',
                 title: '家庭共享关怀',
                 desc: '异地也能实时关怀父母长辈，当采集端出现数据异常时，即刻推送预警。',
                 image: 'https://i.ibb.co/B2ftSBvJ/Starling-Pin.png',
               },
               {
                 eyebrow: '智慧饮食同步',
                 title: '智慧饮食同步',
                 desc: '打通国际主流营养库，根据你的能量消耗模型，推荐最佳的热量摄入比。',
                 image: 'https://i.ibb.co/Vccm9bxM/1.jpg',
               },
             ].map((card, i) => (
               <motion.article
                 key={card.eyebrow}
                 initial={{ opacity: 0, y: 18 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                 className="min-w-[320px] max-w-[320px] md:min-w-[360px] md:max-w-[360px] snap-start"
               >
                 <div className="overflow-hidden rounded-[12px] bg-[#FAFAFA]">
                   <div className="h-[360px] bg-[#EEF0F3]">
                     <img
                       src={card.image}
                       alt={card.title}
                       className="h-full w-full object-cover"
                       loading="lazy"
                       decoding="async"
                       referrerPolicy="no-referrer"
                     />
                   </div>
                   <div className="px-5 pb-6 pt-7 text-left">
                    <h3 className="m-0 text-[18px] font-normal leading-[1.25] tracking-[-0.02em] text-[#0D0D0D]">
                       {card.title}
                     </h3>
                     <p className="mt-3 text-[14px] font-normal leading-[1.7] tracking-[-0.01em] text-[#6E6E73] m-0">
                       {card.desc}
                     </p>
                   </div>
                 </div>
               </motion.article>
             ))}
           </div>
        </div>
      </section>

      {/* 用户成长路径 — 紧随全场景健康守护 */}
      <section className="bg-[#0A0A0A] px-6 py-[72px] text-left md:px-[170px]">
        <div className="mx-auto max-w-[1000px] md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 md:mb-[72px]"
          >
            <h2 className="m-0 mb-4 text-[26px] font-normal leading-[1.2] tracking-[-0.03em] text-white">
              从第一天到
              <br />
              改变的那天
            </h2>
            <p className="text-[14px] font-normal text-white/55 leading-[1.7] tracking-[-0.01em] m-0">
              见证科技与意志共同创造的奇迹
            </p>
          </motion.div>

          {(() => {
            const items = [
              {
                phase: 'DAY 1',
                heading: '你戴上了它',
                body: 'AWAK Ring 开始采集原始信号，系统建立你的基础生理模型。第一份睡眠报告生成，揭开你从未觉察的信息。',
                quote: '「原来我每晚竟然只有这么一丁点深度睡眠。」',
                image:
                  'https://i.ibb.co/fG4mkFd2/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-4.jpg',
              },
              {
                phase: 'WEEK 2',
                heading: '数据开始说话',
                body: 'AI 计算出你的压力分布规律，发现你在每周三最易疲劳。建议你调整第二天夜间的屏幕使用时长。',
                quote: '「它真的在读懂我，而不是在说废话。」',
                image: 'https://i.ibb.co/wFCQp2wk/image.png',
              },
              {
                phase: 'MONTH 2',
                heading: '习惯重塑期',
                body: '你开始遵循动态建议调整作息，HRV（心率变异率）提升了 12%，静息心率稳步下降。你感到精力显著回升。',
                quote: '「我第一次感觉到健康是可以被量化和管理的。」',
                image: 'https://i.ibb.co/Vccm9bxM/1.jpg',
              },
              {
                phase: 'MONTH 6',
                heading: '生活截然不同',
                body: '深度睡眠占比从 18% 提升至 23%，VO₂Max 有氧能力提升 18%，你的身体正在用数据告诉你结果。',
                quote: '「它不是科技产品，而是我生命进阶的见证。」',
                image: 'https://i.ibb.co/DD5C00jt/1.jpg',
              },
            ] as const;

            const active = items[Math.min(Math.max(activeStoryIdx, 0), items.length - 1)];

            return (
              <div>
                <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-6 scrollbar-hide md:mx-0 md:px-0">
                  {items.map((it, idx) => {
                    const isActive = idx === activeStoryIdx;
                    return (
                      <button
                        key={it.phase}
                        type="button"
                        onClick={() => setActiveStoryIdx(idx)}
                        className={[
                          'shrink-0 rounded-full px-4 py-2 text-[13px] font-normal uppercase tracking-[0.08em] transition-colors',
                          isActive
                            ? 'bg-white text-[#0A0A0A]'
                            : 'bg-white/12 text-white/50 hover:bg-white/18 hover:text-white/70',
                        ].join(' ')}
                      >
                        {it.phase}
                      </button>
                    );
                  })}
                </div>

                <motion.div
                  key={active.phase}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                >
                  <div className="relative h-[49vh] min-h-[320px] max-h-[460px] overflow-hidden rounded-[12px] bg-[#121212]">
                    <img
                      src={active.image}
                      alt={active.heading}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.72) 100%)',
                      }}
                      aria-hidden
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <div className="text-[12px] font-normal uppercase tracking-[0.08em] text-white/55">
                        {active.phase}
                      </div>
                      <div className="mt-2 text-[18px] font-normal leading-[1.25] tracking-[-0.02em] text-white">
                        {active.heading}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <p className="text-[14px] font-normal text-white/55 leading-[1.7] tracking-[-0.01em] m-0">
                      {active.body}
                    </p>
                    <p className="text-[14px] font-normal text-white/40 italic leading-[1.7] tracking-[-0.01em] m-0">
                      {active.quote}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 07. 开放平台 */}
      <section className="bg-[#FAFAFA] py-[72px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 text-left md:px-[170px]">
          <div className="mb-12 flex flex-col justify-between gap-8 md:mb-[72px] md:flex-row md:items-end md:gap-12">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-[24px] font-normal leading-[1.2] tracking-[-0.03em] text-[#0D0D0D] md:mb-6">数据互联，无限可能</h2>
              <p className="text-[14px] font-normal leading-[1.6] text-black/60 md:leading-[1.7]">
                支持开放 API 并与主流生态实现双向同步。我们不仅是记录者，更是数字健康的纽带。
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(withPath('/ecosystem/open-api'))}
              className="h-[52px] shrink-0 rounded-full bg-[#F0F0F0] px-6 text-[14px] font-normal text-[#0D0D0D] transition-colors hover:bg-[#E4E4E4] active:scale-[0.99]"
            >
              申请接入平台
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              {name: 'Apple Health', category: 'Health System'},
              {name: 'Google Fit', category: 'Android Ecosystem'},
              {name: 'Samsung Health', category: 'Active Sync'},
              {name: 'Strava', category: 'Sports Performance'},
              {name: 'Keep', category: 'Daily Exercise'},
              {name: 'MyFitnessPal', category: 'Nutrition Tracking'},
              {name: 'OruxMaps', category: 'Expert Outdoor'},
              {name: 'Custom API', category: 'For Developers'},
            ].map((platform, i) => (
              <motion.div 
                key={i}
                initial={{opacity:0}}
                whileInView={{opacity:1}}
                transition={{delay: i * 0.05}}
                viewport={{once:true}}
                className="cursor-pointer rounded-[12px] bg-[#F0F0F0] p-5 transition-colors hover:bg-[#E8E8E8]"
              >
                <div className="mb-1 text-[14px] font-normal text-[#0D0D0D]">{platform.name}</div>
                <div className="text-[12px] font-normal uppercase leading-snug tracking-[0.06em] text-black/55">{platform.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 08. 健康数据安全与隐私（移动到 数据互联 下方） */}
      <section className="bg-[#FAFAFA] px-6 py-[72px] text-left text-[#0A0A0A] md:px-[170px]">
        <div className="mx-auto max-w-[1000px] md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="m-0 text-[24px] font-normal leading-[1.2] tracking-[-0.03em] text-[#0D0D0D]">
              你的健康数据
              <br />
              神圣不可侵犯
            </h2>
            <p className="mt-6 text-[14px] font-normal leading-[1.7] tracking-[-0.01em] text-[#888] m-0">
              在 AWAK，我们深知生理数据的极度敏感性。每一组心跳、每一次深睡数据，都经过彻底的金融级端到端加密，即便在我们自己的服务器上也无法被随意解析窥探。
            </p>

            <div className="mt-8 space-y-6 text-[14px] font-normal leading-[1.7] tracking-[-0.01em]">
              <p className="m-0 text-[#666]">
                <span className="text-[#0D0D0D]">端到端加密体系</span>
                ：传输链路与云端存储全程采用 AES-256 加密，唯一解密密钥永远存放在您的本地安全芯片中。
              </p>
              <p className="m-0 text-[#666]">
                <span className="text-[#0D0D0D]">隐私匿名化聚合</span>
                ：用于改善健康模型与算法训练的数据，全部经过严格的脱敏与噪声处理程序，绝对无法逆向追溯溯源至个体身源。
              </p>
            </div>

            <div className="mt-[22px]">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#F0F0F0] px-6 text-[14px] font-normal tracking-[-0.01em] text-[#0D0D0D] transition-colors hover:bg-[#E4E4E4] active:scale-[0.99]"
              >
                查看完整隐私政策
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. 准备好了吗 — CTA cards */}
      <section className="bg-[#F5F5F5] px-6 py-[72px] md:px-[170px]">
        <div className="mx-auto max-w-[1000px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-[72px] text-left"
          >
            <h2 className="m-0 mb-4 text-[24px] font-normal leading-[1.2] tracking-[-0.03em] text-[#0A0A0A]">
              准备好了吗？
              <br />
              感知你的健康
            </h2>
            <p className="text-[14px] font-normal text-[#888] leading-[1.7] tracking-[-0.01em] m-0">
              无论您是处于了解阶段，还是已经准备好佩戴，这里都有您的下一步。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-3">
            {/* Card — .variant-card 式内边距 28 20 24 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="relative overflow-hidden rounded-[12px] bg-[#0A0A0A] px-5 pb-6 pt-7"
            >
              <div className="relative z-10">
                <div className="mb-[18px]">
                  <span className="text-[12px] font-normal uppercase tracking-[0.06em] text-white/40">
                    还没有 AWAK 硬件
                  </span>
                </div>

                <p className="m-0 mb-2 text-[24px] font-normal leading-[1.2] tracking-[-0.03em] text-white">
                  先拥有一枚戒指
                </p>
                <p className="m-0 mb-[22px] text-[14px] font-normal leading-[1.65] tracking-[-0.01em] text-white/40">
                  这是最简单、也是最完整的数字健康管理入口。
                </p>

                <button
                  type="button"
                  onClick={() => navigate(withPath('/products'))}
                  className="w-full rounded-full bg-accent py-[14px] text-[14px] font-normal tracking-[-0.01em] text-ink transition-[filter] hover:brightness-110 active:scale-[0.99]"
                >
                  选购所有产品
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <FooterSections />
    </div>
  );
}
