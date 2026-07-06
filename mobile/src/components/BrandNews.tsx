import React from 'react';
import { motion } from 'motion/react';

const newsItems = [
  {
    title: "Awak Health 2026 春季发布会回顾",
    subtitle: "探索科技与美学的共生",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80",
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
    img: "https://images.unsplash.com/photo-1471506480208-8e93acc6c04a?auto=format&fit=crop&q=80",
    size: "flex-[1]"
  },
  {
    title: "无障碍设计的未来",
    subtitle: "让技术服务于每一个人",
    img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80",
    size: "flex-[1]"
  },
  {
    title: "材质实验室",
    subtitle: "寻找更亲肤的佩戴答案",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    size: "flex-[2]"
  },
  {
    title: "全球睡眠研究峰会",
    subtitle: "解码深度睡眠的奥秘",
    img: "https://images.unsplash.com/photo-1511296265581-c24500444084?auto=format&fit=crop&q=80",
    size: "flex-[1]"
  },
  {
    title: "生态伙伴计划",
    subtitle: "共筑开放的数字生命蓝图",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    size: "flex-[1]"
  }
];

export default function BrandNews() {
  return (
    <section className="bg-white py-12 px-6 md:px-[170px] font-sans">
      <div className="mb-12">
        <h2 className="text-[40px] font-black tracking-tight text-black">品牌动态</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Row 1: 3 Images */}
        <div className="flex flex-row gap-4 h-[400px]">
          {newsItems.slice(0, 3).map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className={`relative overflow-hidden rounded-[24px] bg-black group ${item.size}`}
            >
              <img 
                src={item.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" 
                alt={item.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-white text-xl font-bold mb-1 tracking-tight">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 2: 4 Images */}
        <div className="flex flex-row gap-4 h-[350px]">
          {newsItems.slice(3, 7).map((item, idx) => (
            <motion.div 
              key={idx + 3}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx + 3) * 0.1, duration: 0.8 }}
              className={`relative overflow-hidden rounded-[24px] bg-black group ${item.size}`}
            >
              <img 
                src={item.img} 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" 
                alt={item.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-white text-lg font-bold mb-1 tracking-tight">{item.title}</h4>
                <p className="text-white/60 text-xs">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
