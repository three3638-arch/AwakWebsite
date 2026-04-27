import { motion } from 'motion/react';

export default function TrustBanner() {
  const stats = [
    { value: "1,000,000+", label: "目标用户" },
    { value: "50+", label: "健康指标" },
    { value: "99.2%", label: "满意度" },
    { value: "18个月", label: "质保" },
  ];

  return (
    <section className="bg-[#080808] py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-8 md:gap-16">
        {stats.map((stat, i) => (
          <div key={i} className="flex-1 min-w-[140px] text-center border-r border-white/10 last:border-0">
            <div className="text-white text-3xl md:text-4xl font-black mb-2">{stat.value}</div>
            <div className="text-white text-sm tracking-widest uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
