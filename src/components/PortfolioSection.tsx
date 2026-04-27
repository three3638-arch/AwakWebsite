import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  { name: "智能心率监测", client: "@heartcare", desc: "实时监测心率波动，通过AI算法预警潜在风险，守护心脏健康。", img: "https://picsum.photos/seed/health-proj1/600/400" },
  { name: "深度睡眠分析", client: "@sleepwell", desc: "多维度分析睡眠质量，提供个性化的助眠建议，提升您的生命活力。", img: "https://picsum.photos/seed/health-proj2/600/400" },
  { name: "运动表现追踪", client: "@activepulse", desc: "精准记录运动数据，分析体能表现，助您科学健身，突破自我。", img: "https://picsum.photos/seed/health-proj3/600/400" },
  { name: "全家健康管理", client: "@familyguard", desc: "一个账号管理全家健康，远程关注长辈状态，让关爱无处不在。", img: "https://picsum.photos/seed/health-proj4/600/400" },
];

export default function PortfolioSection() {
  return (
    <section className="py-40 bg-black">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-medium mb-6">见证健康的力量</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">从个人到家庭，我们通过科技手段，让每一个健康目标都变得清晰可见。</p>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="min-w-[320px] md:min-w-[450px] bg-white/5 border border-white/10 rounded-[40px] overflow-hidden group snap-start"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={project.img} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-accent font-bold text-xs">{project.client}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-6">{project.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{project.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
