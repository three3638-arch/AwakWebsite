import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
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
    <div className="bg-white min-h-screen font-sans selection:bg-[#C8FF00] selection:text-black pt-[100px]">
      <Navbar />
      
      {/* Header Section */}
      <section className="px-6 md:px-[170px] pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[#86868B] font-mono tracking-widest uppercase mb-4 block">AWAK NEWS & VISION</span>
          <h1 className="text-[clamp(48px,8vw,90px)] font-black text-black leading-[1.05] tracking-[-3px]">
            品牌动态
          </h1>
          <p className="text-xl text-[#86868B] max-w-2xl mt-8 leading-relaxed">
            在这里，我们分享关于健康科技、工业设计以及对未来生活的思考。不仅仅是产品的更新，更是对生命律动的持续探索。
          </p>
        </motion.div>
      </section>

      {/* Narrative Card Flow */}
      <section className="px-6 md:px-[170px] pb-24">
        <div className="flex flex-col gap-6">
          {/* Row 1: 3 Images - Asymmetric */}
          <div className="flex flex-row gap-6 h-[500px]">
            {newsItems.slice(0, 3).map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-[32px] bg-[#F5F5F7] group ${item.size} cursor-pointer`}
              >
                <img 
                  src={item.img} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2.5s] ease-out" 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h4 className="text-white text-2xl font-black mb-2 tracking-tight">{item.title}</h4>
                  <p className="text-white/60 text-base font-medium">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: 4 Images - Asymmetric */}
          <div className="flex flex-row gap-6 h-[400px]">
            {newsItems.slice(3, 7).map((item, idx) => (
              <motion.div 
                key={idx + 3}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 3) * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-[24px] bg-[#F5F5F7] group ${item.size} cursor-pointer`}
              >
                <img 
                  src={item.img} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2.5s] ease-out" 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="text-white text-xl font-bold mb-1 tracking-tight">{item.title}</h4>
                  <p className="text-white/60 text-sm font-medium">{item.subtitle}</p>
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
