import { motion } from 'motion/react';

const categories = [
  { name: "实时监测", tag: "Real-time", img: "https://picsum.photos/seed/health-cat1/400/400" },
  { name: "AI 分析", tag: "Intelligence", img: "https://picsum.photos/seed/health-cat2/400/400", active: true },
  { name: "专家指导", tag: "Expertise", img: "https://picsum.photos/seed/health-cat3/400/400" },
  { name: "健康报告", tag: "Reports", img: "https://picsum.photos/seed/health-cat4/400/400" },
  { name: "运动追踪", tag: "Activity", img: "https://picsum.photos/seed/health-cat5/400/400" },
  { name: "睡眠优化", tag: "Sleep", img: "https://picsum.photos/seed/health-cat6/400/400" },
];

export default function StrikingConcepts() {
  return (
    <section className="py-40 bg-black text-white">
      <div className="w-full mx-auto px-6 md:px-[170px]">
        <div className="text-center mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start text-left gap-12">
            <p className="text-base font-light text-white/60 max-w-sm leading-relaxed">
              我们结合先进的传感器技术、医疗级算法和人性化设计，为您提供精准、直观的健康管理方案。
            </p>
            <p className="text-base font-light text-white/60 max-w-sm leading-relaxed">
              从数据采集到深度分析，我们致力于通过科技手段提升全球用户的生命质量，让健康管理真正触手可及。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1.05 }}
              className={`relative h-64 rounded-3xl overflow-hidden group cursor-pointer ${cat.active ? 'bg-white/10 text-white' : 'bg-white/5 text-white'}`}
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${cat.active ? 'opacity-60' : 'opacity-20 group-hover:opacity-40'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <span className={`font-mono text-xs uppercase tracking-widest ${cat.active ? 'text-white/60' : 'text-white/30'}`}>
                  {cat.tag}
                </span>
                <div>
                  <h3 className="text-xl font-light leading-tight mb-4">{cat.name}</h3>
                  {cat.active && (
                    <button className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-widest rounded-full">
                      Get started
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
