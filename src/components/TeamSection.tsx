import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const products = [
  {
    title: "Awak Ring （智能戒指）",
    subtitle: "年轻人的第一款时尚智能戒指",
    img: "https://i.ibb.co/FLXrp6qv/image.jpg",
    link: "/smart-ring",
    features: "时尚设计｜高精准监测｜智能交互｜全栈健康服务"
  },
  {
    title: "Awak Bracelet（智能手环）",
    subtitle: "55-75岁银发专属健康守护",
    img: "https://i.ibb.co/1t1FyW93/image.jpg",
    link: "/smart-bracelet",
    features: "紧急呼救｜精准预警｜超长续航｜家人共享"
  },
  {
    title: "Awak Watch （专业运动智能手表）",
    subtitle: "全年龄段专业级全场景运动腕表",
    img: "https://i.ibb.co/YBjhmq8w/image.jpg",
    link: "/smart-watch",
    features: "科学训练｜全面健康监测｜专业户外护航｜多运动模式"
  },
  {
    title: "Awak Glasses（智能眼镜）",
    subtitle: "听视障人群民生刚需智能硬件",
    img: "https://i.ibb.co/FL1q2zKP/image.jpg",
    link: "/smart-glasses",
    features: "手语翻译｜安全出行｜轻量化设计｜B端场景落地"
  }
];

export default function TeamSection() {
  return (
    <div className="relative bg-[#F5F5F7] w-full pt-12 pb-16">
      <section className="relative w-full mx-auto px-6 md:px-[170px] z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
           className="mb-8"
        >
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-black text-[#1D1D1F] tracking-tight">
            智能硬件+应用服务 <br />
            构建 7×24H 全周期健康与睡眠
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, index) => {
            const englishName = item.title.split('（')[0].split('(')[0].trim();
            const chineseName = item.title.includes('（') ? item.title.split('（')[1].replace('）','') : item.title.includes('(') ? item.title.split('(')[1].replace(')','') : '';

            return (
              <Link to={item.link} key={index} className="block group">
                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, delay: index * 0.1 }}
                   className="flex flex-col h-full"
                >
                  {/* Card Container (Image Only) */}
                  <div className="relative w-full aspect-[2/3] rounded-[24px] overflow-hidden bg-black/40 group-hover:bg-black/60 transition-all duration-500">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Bottom Overlay Button - Integrated (D.1) */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <div className="bg-white text-black text-sm font-black px-10 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-black/20">
                        立即购买 <span className="text-lg">→</span>
                      </div>
                    </div>

                    {/* Subtle vignette for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Text Below Card (D.1) */}
                  <div className="mt-8 flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors uppercase">
                      {englishName}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-[#86868B] font-bold tracking-widest uppercase">
                        {chineseName}
                      </p>
                      <p className="text-[#86868B] text-base font-medium leading-relaxed max-w-[90%]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
