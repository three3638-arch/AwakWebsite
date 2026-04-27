import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Smartphone, Globe, Lock, Activity, BarChart3, Fingerprint, Plus, ArrowRight, Zap, Target, CheckCircle2, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import FooterSections from '../components/FooterSections';

export default function EcosystemPage() {
  const navigate = useNavigate();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const privacyContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative"
      >
        <button 
          onClick={() => setIsPrivacyModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-10 overflow-y-auto">
          <h2 className="text-3xl font-black mb-6 text-[#1D1D1F]">AWAK 用户隐私保护政策</h2>
          <div className="space-y-6 text-[#86868B] leading-relaxed">
            <section>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">1. 数据收集与加密</h3>
              <p>我们收集的所有健康数据（包括但不限于心率、血氧、睡眠阶段、体温等）均在设备端进行初步脱敏。在传输至云端前，所有数据均采用 AES-256 金融级端到端加密体系。解密密钥仅存储在您的本地设备安全芯片中。</p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">2. 数据所有权</h3>
              <p>您对您的生理数据拥有 100% 的绝对所有权。AWAK 仅作为数据的处理 and 分析方。我们承诺永远不会向任何第三方广告商、保险公司或数据中介出售您的个人身份健康信息。</p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">3. 匿名化与研究</h3>
              <p>为了改进我们的健康模型，我们可能会使用去标识化的聚合数据进行算法训练。这些数据经过严格的差异隐私（Differential Privacy）处理，确保无法溯源至任何特定个体。</p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">4. 您的权利</h3>
              <p>您可以随时通过 AwakHealth App 查阅、导出、更正或请求删除您的全部数据。一旦您选择注销账户，我们将在 7 个工作日内从全球范围内所有的服务器上彻底销毁您的所有数字生命痕迹。</p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-[#FBFBFD] text-[#1D1D1F] min-h-screen">
      <AnimatePresence>
        {isPrivacyModalOpen && privacyContent}
      </AnimatePresence>
      
      {/* 02. Hero 全屏区 */}
      <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co/xKX2CFGN/1.png')] bg-cover bg-center opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="w-full px-6 md:px-[120px] mx-auto text-center relative z-10">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{opacity:0, y:40}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.7, ease:[0.16,1,0.3,1]}}
              className="text-[clamp(40px,6vw,84px)] font-black leading-[1.1] tracking-[-2px] mb-4 text-[#F5F5F7]"
            >
              AWAK 不只是一枚戒指
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{opacity:0, y:40}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.7, delay: 0.15, ease:[0.16,1,0.3,1]}}
              className="text-[clamp(40px,6vw,84px)] font-black leading-[1.1] tracking-[-2px] mb-8 text-[#F5F5F7]"
            >
              而是完整的健康生态系统
            </motion.h1>
          </div>
          <motion.p 
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            transition={{delay: 0.5, duration: 1}}
            className="text-[clamp(16px,1.5vw,18px)] text-[#86868B] max-w-2xl mx-auto leading-[1.7] px-4"
          >
            硬件采集高精度数据，软件提供深度分析，服务闭环精准干预。我们重新定义健康管理的边界，为你打造无缝的数字健康人生。
          </motion.p>
        </div>
      </section>

      {/* 02b. 生态闭环可视化动图 */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="w-full px-6 md:px-[120px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: '全时监测', desc: '戒指采集核心体征' },
              { step: '02', title: '数据同步', desc: '蓝牙秒级上传云端' },
              { step: '03', title: 'AI 分析', desc: 'AwakHealth 算法解读' },
              { step: '04', title: '健康报告', desc: '生成个性化洞察' },
              { step: '05', title: '干预方案', desc: 'AI 生成改善策略' },
              { step: '06', title: '闭环进化', desc: '持续优化身体状态' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{opacity:0, y:20}}
                whileInView={{opacity:1, y:0}}
                transition={{delay: i * 0.1}}
                viewport={{once:true}}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <div className="text-[#C8FF00] font-mono font-bold text-sm mb-2">{item.step}</div>
                <div className="text-white font-bold mb-2">{item.title}</div>
                <div className="text-white/40 text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 03. 三位一体 */}
      <section className="py-24 md:py-[120px] bg-[#F5F5F7] relative">
        <div className="w-full px-6 md:px-[120px] mx-auto">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] mb-6 text-[#1D1D1F]">三位一体健康基石</h2>
            <p className="text-lg text-[#86868B]">不仅仅是监测，更是从数据到行动的全程陪伴</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '精准采集 (硬件)',
                icon: Activity,
                points: ['工业级高精度传感器', '24/7 不间断体征监测', '无感佩戴，长效续航'],
                delay: 0
              },
              {
                title: '智能解析 (App)',
                icon: Smartphone,
                points: ['AwakHealth 核心算法', '生成个体生理基线表', '多维度趋势预测分析'],
                delay: 0.1
              },
              {
                title: '全周期服务',
                icon: Globe,
                points: ['AI 专属健康教练', '专业体检/保险服务联动', '全球化销售与售后支持'],
                delay: 0.2
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{opacity:0, y:30}}
                whileInView={{opacity:1, y:0}}
                transition={{delay: item.delay, duration: 0.8}}
                viewport={{once:true}}
                className="bg-white rounded-3xl p-10 flex flex-col items-center text-center group border border-transparent transition-all shadow-sm"
              >
                <div className="w-16 h-16 bg-[#F5F5F7] text-[#1D1D1F] rounded-full flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-[#1D1D1F]">{item.title}</h3>
                <ul className="space-y-3 text-left w-full">
                  {item.points.map((p, j) => (
                    <li key={j} className="text-[#86868B] text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#DDF700] mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. AwakHealth App 深度展示 */}
      <section className="py-24 md:py-[160px] bg-white">
        <div className="w-full px-6 md:px-[120px] mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] mb-8 text-[#1D1D1F]">
              你的数字健康控制中心
            </h2>
            <p className="text-[18px] md:text-xl text-[#86868B] mb-12 leading-[1.7] max-w-xl">
              AwakHealth 不是一个冷冰冰的数据看板，而是懂你的私人健康助理。每一次心跳，每一夜睡眠，都化作最直观的建议。
            </p>
            <div className="space-y-8 mb-12">
              {[
                {title: "多维度健康指标", desc: "心率、血氧、HRV、体温，一站式整合分析，告别碎片化应用", icon: BarChart3},
                {title: "智能洞察模型", desc: "依托百万级大数据库，建立仅属你一个人的个体生理基线", icon: Zap},
                {title: "动态健康建议", desc: "不仅告诉你昨晚睡得差，还会告诉你今晚如何能睡得更好", icon: Target}
              ].map((item, i) => (
                <motion.div key={i} className="flex gap-6" initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay: i*0.1}}>
                  <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center shrink-0">
                     <item.icon className="w-6 h-6 text-[#1D1D1F]" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold mb-2 text-[#1D1D1F]">{item.title}</h3>
                     <p className="text-[#86868B] leading-[1.6]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => navigate('/download')} className="px-10 py-4 bg-[#1D1D1F] text-white font-bold rounded-full hover:bg-black transition-all flex items-center gap-2 group">
              立即下载 APP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="md:col-span-5 relative flex justify-center">
            <img src="https://i.ibb.co/pCtZ7GG/app.png" alt="App Control Center" className="w-full max-w-[380px] rounded-[52px]" />
          </div>
        </div>
      </section>

      {/* 合作伙伴 Logo 横排 */}
      <section className="py-12 bg-white border-y border-[#F5F5F7]">
        <div className="w-full px-6 md:px-[120px] mx-auto flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-30 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-700">
           <span className="text-lg font-black tracking-tighter">Apple Health</span>
           <span className="text-lg font-black tracking-tighter">Google Fit</span>
           <span className="text-lg font-black tracking-tighter">WeiXin Health</span>
           <span className="text-lg font-black tracking-tighter">Keep</span>
           <span className="text-lg font-black tracking-tighter">Garmin Sync</span>
        </div>
      </section>

      {/* 05. App 功能模块详解 */}
      <section className="py-24 md:py-[160px] bg-[#F5F5F7]">
        <div className="w-full px-6 md:px-[120px] mx-auto">
           <div className="mb-16 md:mb-20">
             <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] mb-6 text-[#1D1D1F]">全场景健康守护</h2>
             <p className="text-xl text-[#86868B]">打破生活边界，用科技守护每个重要时刻</p>
           </div>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               {title:'深睡眠解码', desc:'识别五大睡眠阶段，下探至分钟级的生理指标波动，定位疲惫根源。'},
               {title:'专业运动图谱', desc:'全量同步血氧、心率轨迹，深度分析肌肉恢复与有氧/无氧负荷占比。'},
               {title:'压力与心流', desc:'全天候 HRV 实时监测，在压力临界点提示并引导深呼吸与正念练习。'},
               {title:'女性健康闭环', desc:'基于精细的基础体温变化趋势，精准预测生理周期，闭环管理身心健康。'},
               {title:'家庭共享关怀', desc:'异地也能实时关怀父母长辈，当采集端出现数据异常时，即刻推送预警。'},
               {title:'智慧饮食同步', desc:'打通国际主流营养库，根据你的能量消耗模型，推荐最佳的热量摄入比。'},
             ].map((m, i) => (
               <motion.div 
                 key={i} 
                 className="bg-white p-10 rounded-[32px] transition-all duration-500 border border-transparent group" 
                 initial={{opacity:0, y:20}} 
                 whileInView={{opacity:1, y:0}} 
                 viewport={{once:true}} 
                 transition={{delay: i*0.1}}
               >
                 <h3 className="text-2xl font-bold mb-4 text-[#1D1D1F] transition-colors group-hover:text-[#C8FF00]">{m.title}</h3>
                 <p className="text-[#86868B] leading-[1.8] text-[15px]">{m.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* 07. 开放平台 / API 生态 */}
      <section className="py-24 md:py-[140px] bg-[#080808]">
        <div className="w-full px-6 md:px-[120px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] mb-8 text-white">数据互联，无限可能</h2>
              <p className="text-lg text-white/40 leading-[1.7]">
                支持开放 API 并与主流生态实现双向同步。我们不仅是记录者，更是数字健康的纽带。
              </p>
            </div>
            <button onClick={() => navigate('/ecosystem/open-api')} className="px-8 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all">申请接入平台</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="text-white font-bold text-sm mb-1">{platform.name}</div>
                <div className="text-white/30 text-[10px] uppercase font-mono">{platform.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 08. 健康数据安全与隐私 */}
      <section className="py-24 md:py-[160px] bg-[#FBFBFD] text-[#1D1D1F]">
        <div className="w-full px-6 md:px-[120px] mx-auto">
           <div className="grid md:grid-cols-2 gap-12 md:gap-12 items-center">
             <div>
               <div className="inline-flex w-16 h-16 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] items-center justify-center mb-8">
                 <Fingerprint className="w-8 h-8"/>
               </div>
               <h2 className="text-[clamp(36px,5vw,68px)] font-extrabold leading-[1.1] tracking-[-2px] mb-6 text-[#1D1D1F]">
                 你的健康数据<br/>神圣不可侵犯
               </h2>
               <p className="text-[18px] md:text-xl text-[#86868B] mb-12 leading-[1.7]">
                 在 AWAK，我们深知生理数据的极度敏感性。每一组心跳、每一次深睡数据，都经过彻底的金融级端到端加密，即便在我们自己的服务器上也无法被随意解析窥探。
               </p>
               <ul className="space-y-8 mb-10">
                 <li className="flex gap-5">
                   <Lock className="w-8 h-8 shrink-0 text-[#1D1D1F]"/> 
                   <div>
                     <h4 className="font-bold text-xl mb-2 text-[#1D1D1F]">端到端加密体系</h4>
                     <p className="text-[#86868B] text-[16px] leading-[1.6]">传输链路与云端存储全程采用 AES-256 加密，唯一解密密钥永远存放在您的本地安全芯片中。</p>
                   </div>
                 </li>
                 <li className="flex gap-5">
                   <Shield className="w-8 h-8 shrink-0 text-[#1D1D1F]"/> 
                   <div>
                     <h4 className="font-bold text-xl mb-2 text-[#1D1D1F]">隐私匿名化聚合</h4>
                     <p className="text-[#86868B] text-[16px] leading-[1.6]">用于改善健康模型与算法训练的数据，全部经过严格的脱敏与噪声处理程序，绝对无法逆向追溯溯源至个体身源。</p>
                   </div>
                 </li>
               </ul>
             </div>
             <div className="bg-[#F5F5F7] p-10 md:p-14 rounded-[40px] relative">
               <h3 className="text-[28px] font-black mb-8 border-b-2 border-gray-200 pb-6 text-[#1D1D1F]">
                 用户隐私最高承诺宣言
               </h3>
               <div className="space-y-6 text-[#1D1D1F] font-bold text-lg leading-[1.7]">
                 <div className="flex gap-4">
                   <span className="text-[#1D1D1F] bg-[#DDF700] rounded-full w-8 h-8 flex items-center justify-center shrink-0">1</span>
                   <p>我们绝不（也永远不会）将您的任何个人标识健康数据出售给第三方广告商敛财。</p>
                 </div>
                 <div className="flex gap-4">
                   <span className="text-[#1D1D1F] bg-[#DDF700] rounded-full w-8 h-8 flex items-center justify-center shrink-0">2</span>
                   <p>您拥有您的硬件所产生的个人历史数据的 100% 绝对所有权与控制权。</p>
                 </div>
                 <div className="flex gap-4">
                   <span className="text-[#1D1D1F] bg-[#DDF700] rounded-full w-8 h-8 flex items-center justify-center shrink-0">3</span>
                   <p>您随时可以通过 App 一键彻底清空账号绑定，并永久从服务器销毁所有相关数字生命痕迹。</p>
                 </div>
                 <div className="pt-4 border-t border-gray-200 mt-6">
                   <button 
                     onClick={() => setIsPrivacyModalOpen(true)}
                     className="text-[#1D1D1F] hover:text-[#86868B] transition-colors underline underline-offset-4 text-sm font-bold flex items-center gap-2"
                   >
                     查看完整隐私政策 <ArrowRight className="w-4 h-4 text-[#DDF700]" />
                   </button>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 08. 用户成长路径区 */}
      <section className="py-24 md:py-[160px] bg-[#F5F5F7] relative overflow-hidden">
        <div className="w-full px-6 md:px-[120px] mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] text-[#1D1D1F] mb-6">
              从第一天到改变的那天
            </h2>
            <p className="text-lg text-[#86868B]">见证科技与意志共同创造的奇迹</p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto relative">
            {/* 中央引导轴 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#1D1D1F]/5 hidden md:block" />
            
            {[
              {time: "Day 1", title: "「你戴上了它」", desc: "AWAK Ring 开始采集原始信号，系统建立你的基础生理模型。第一份睡眠报告生成，揭开你从未觉察的信息。", quote: "「原来我每晚竟然只有这么一丁点深度睡眠。」", x: -50},
              {time: "Week 2", title: "「数据开始说话」", desc: "AI 计算出你的压力分布规律，发现你在每周三最易疲劳。建议你调整周二夜间的屏幕使用时长。", quote: "「它真的在读懂我，而不是在说废话。」", x: 50},
              {time: "Month 2", title: "「习惯重塑期」", desc: "你开始遵循动态建议调整作息，HRV（心率变异率）提升了12%，静息心率稳步下降。你感到精力显著回升。", quote: "「我第一次感觉到健康是可以被量化和管理的。」", x: -50},
              {time: "Month 6", title: "「生活截然不同」", desc: "深度睡眠占比稳定在 20% 以上，你的年度健康报告获得医生点赞。AWAK 记录了这段从内而外的蜕变路径。", quote: "「它不是科技产品，而是我生命进阶的见证。」", x: 50}
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{opacity: 0, x: s.x, y: 20}}
                whileInView={{opacity: 1, x: 0, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1}}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1 w-full bg-white p-10 rounded-[32px] border border-transparent transition-all shadow-sm">
                  <div className="text-[12px] font-bold text-[#A1A1A6] tracking-[2px] mb-4 uppercase">{s.time}</div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] mb-6">{s.title}</h3>
                  <p className="text-[15px] text-[#86868B] leading-[1.8] mb-8">{s.desc}</p>
                  <p className="text-[15px] text-[#A1A1A6] italic leading-[1.8] font-medium border-l-4 border-[#DDF700] pl-4">{s.quote}</p>
                </div>
                <div className="hidden md:flex w-12 h-12 rounded-full bg-[#1D1D1F] border-4 border-white items-center justify-center text-white text-xs font-black z-10 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. App 下载 CTA 区 */}
      <section className="py-24 md:py-[180px] bg-[#333333] relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80')] bg-cover bg-center"
        />
        <div className="w-full px-6 md:px-[120px] mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-[-2px] mb-8 text-white"
            >
              准备好了吗？感知你的健康
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/40 max-w-2xl mx-auto"
            >
              无论您是处于了解阶段，还是已准备好佩戴，这里都有您的下一步。
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: 硬件 */}
            <div className="bg-white/5 rounded-[40px] p-10 flex flex-col items-center text-center border border-white/10 group transition-all hover:bg-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 text-white group-hover:bg-[#C8FF00] group-hover:text-black transition-all">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-black text-[#86868B] mb-4 tracking-widest uppercase">还没有 AWAK 硬件</h3>
              <h4 className="text-2xl font-bold text-white mb-6">先拥有一枚戒指</h4>
              <p className="text-white/30 text-sm leading-[1.7] mb-10 flex-1">从 AWAK Ring 开始，这是最简单、也最完整的数字健康管理入口。</p>
              <button onClick={() => navigate('/products')} className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-[#DDF700] transition-all">
                选购所有产品
              </button>
            </div>

            {/* Card 2: APP */}
            <div className="bg-[#C8FF00] rounded-[40px] p-10 flex flex-col items-center text-center border border-transparent shadow-[0_40px_80px_-20px_rgba(200,255,0,0.2)] group">
              <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mb-8 text-white">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-black text-black/50 mb-4 tracking-widest uppercase">已有硬件，尚未配对</h3>
              <h4 className="text-2xl font-bold text-black mb-6">下载 AwakHealth</h4>
              <p className="text-black/60 text-sm leading-[1.7] mb-10 flex-1">让硬件开始为您工作。目前已在主流市场同步上架，配对只需 30 秒。</p>
              <button onClick={() => navigate('/download')} className="w-full bg-black text-white font-black py-4 rounded-2xl hover:brightness-125 transition-all">
                下载应用
              </button>
            </div>

            {/* Card 3: PREMIUM */}
            <div className="bg-white/5 rounded-[40px] p-10 flex flex-col items-center text-center border border-white/10 group transition-all hover:bg-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 text-white group-hover:bg-[#C8FF00] group-hover:text-black transition-all">
                <img src="https://i.ibb.co/LHyyMHs/jimeng-2026-04-03-1677.png" alt="Health perception" className="w-8 h-8 object-cover" />
              </div>
              <h3 className="text-sm font-black text-[#86868B] mb-4 tracking-widest uppercase">已是用户，考虑升级</h3>
              <h4 className="text-2xl font-bold text-white mb-6">解锁 Premium</h4>
              <p className="text-white/30 text-sm leading-[1.7] mb-10 flex-1">是时候让 AI 顾问为您做更深入的报告分析了。首单订阅享 14 天试用。</p>
              <button onClick={() => navigate('/auth?plan=plus_trial')} className="w-full bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all">
                开始免费试用
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10 mt-20 opacity-30 grayscale saturate-0">
            <span className="text-white font-black text-lg">App Store 4.9</span>
            <span className="text-white font-black text-lg">Google Play 4.8</span>
            <span className="text-white font-black text-lg">Huawei Market 4.9</span>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <FooterSections />
    </div>
  );
}
