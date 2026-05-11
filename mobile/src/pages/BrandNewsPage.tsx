import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import FooterSections from '../components/FooterSections';

const newsItems = [
  {
    title: "AWAK 2026 春季发布会回顾",
    subtitle: "探索科技与美学的共生",
    img: "https://i.ibb.co/xKX2CFGN/1.png",
    size: "flex-[2]"
  },
  {
    title: "关于呼吸的艺术",
    subtitle: "对话首席健康官",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80",
    size: "flex-[1]"
  },
  {
    title: "城市骑行计划",
    subtitle: "用轨迹连接社区",
    img: "https://i.ibb.co/wFCQp2wk/image.png",
    size: "flex-[1]"
  },
  {
    title: "无障碍设计的未来",
    subtitle: "让技术服务于每一个人",
    img: "https://i.ibb.co/8LKkcKPL/Open-positions-at-Oura.jpg",
    size: "flex-[1.5]"
  },
  {
    title: "材质实验室",
    subtitle: "寻找更亲肤的配戴答案",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    size: "flex-[2]"
  },
  {
    title: "全球睡眠研究峰会",
    subtitle: "解码深度睡眠的奥秘",
    img: "https://i.ibb.co/m5J3KvJN/Alzheimers.jpg",
    size: "flex-[1]"
  },
  {
    title: "生态伙伴计划",
    subtitle: "共筑开放的数字生命蓝图",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    size: "flex-[1.2]"
  }
];

export default function BrandNewsPage() {
  return (
    <div className="min-h-screen bg-base font-sans text-fg-primary antialiased selection:bg-accent selection:text-ink pt-[var(--nav-height-expanded)]">
      {/* Header Section — 与首页 Hero / 章节：同色面、正文字重、大边距 */}
      <section className="px-4 pb-[var(--block-gap)] pt-20 md:px-[170px] md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-fg-tertiary">
            AWAK NEWS & VISION
          </span>
          <h1 className="max-w-[min(100%,20ch)] text-[clamp(40px,8vw,72px)] font-normal leading-none tracking-tighter text-fg-primary">
            品牌动态
          </h1>
          <p className="mt-6 max-w-2xl text-base font-normal leading-[1.7] text-fg-secondary md:text-[18px]">
            在这里，我们分享关于健康科技、工业设计以及对未来生活的思考。不仅仅是产品的更新，更是对生命律动的持续探索。
          </p>
        </motion.div>
      </section>

      {/* Narrative Card Flow — 圆角与分割与全站 token 一致 */}
      <section className="px-4 pb-[clamp(64px,10vw,96px)] md:px-[170px]">
        <div className="flex flex-col gap-[var(--card-gap)] md:gap-6">
          {/* Row 1: 3 Images - Asymmetric */}
          <div className="flex min-h-0 flex-col gap-[var(--card-gap)] md:h-[min(500px,70vh)] md:flex-row md:gap-6">
            {newsItems.slice(0, 3).map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 1.02 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative min-h-[220px] w-full cursor-pointer overflow-hidden rounded-card-lg bg-surface-2 md:min-h-0 md:h-full ${item.size}`}
              >
                <img 
                  src={item.img} 
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[2.5s] ease-out group-hover:scale-110" 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-95" />
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/90 backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:right-5 md:top-5">
                  <ArrowUpRight className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="absolute bottom-8 left-6 right-6 pr-14 md:bottom-10 md:left-10 md:right-10 md:pr-16">
                  <h4 className="mb-2 text-2xl font-normal tracking-tight text-white">{item.title}</h4>
                  <p className="text-base font-normal leading-relaxed text-white/65">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: 4 Images - Asymmetric */}
          <div className="flex min-h-0 flex-col gap-[var(--card-gap)] md:h-[min(400px,60vh)] md:flex-row md:gap-6">
            {newsItems.slice(3, 7).map((item, idx) => (
              <motion.div 
                key={idx + 3}
                initial={{ opacity: 0, scale: 1.02 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 3) * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative min-h-[200px] w-full cursor-pointer overflow-hidden rounded-card-lg bg-surface-2 md:min-h-0 md:h-full ${item.size}`}
              >
                <img 
                  src={item.img} 
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[2.5s] ease-out group-hover:scale-110" 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-95" />
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/90 backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:right-4 md:top-4 md:h-9 md:w-9">
                  <ArrowUpRight className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="absolute bottom-6 left-6 right-6 pr-12 md:bottom-8 md:left-8 md:right-8 md:pr-14">
                  <h4 className="mb-1 text-xl font-normal tracking-tight text-white">{item.title}</h4>
                  <p className="text-sm font-normal leading-relaxed text-white/65">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterSections />
    </div>
  );
}
