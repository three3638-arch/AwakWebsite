import { motion } from 'motion/react';
import { ArrowRight, Smartphone, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-end justify-center pt-24 pb-24 mb-0 overflow-hidden bg-[#161617] text-white w-full pl-6 pr-6 md:pl-[170px] md:pr-[85px]">
      {/* 交互式背景 - 视频/图片 */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-brand-white">
        <img 
          src="https://i.ibb.co/6JqSk9k4/hero.png"
          alt="Hero Background"
          className="w-full h-full object-cover transition-all duration-1000 scale-[1.2]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full mx-auto pb-12 flex flex-col items-end text-right">
        <div className="max-w-7xl flex flex-col items-end">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[100px] lg:text-[120px] font-black leading-[1.05] tracking-[-3px] text-white"
          >
            看得懂的健康
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-end mt-6 text-white/70 text-lg md:text-xl font-normal tracking-wide"
          >
            行业TOP级精准监测 | 医疗级AI算法 | 全人群健康守护
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-end gap-6 mt-12"
          >
            <motion.button
              whileHover={{ scale: 0.97, backgroundColor: "#E6FF00", color: "#1D1D1F" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = '/store'}
              className="group relative flex items-center justify-center bg-[#DDF700] px-10 py-4 rounded-full overflow-hidden text-[#080808] min-w-[160px] transition-colors duration-200"
            >
              <span className="relative z-10 font-bold tracking-widest text-sm">立即购买</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 0.97, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center justify-center bg-white/10 px-10 py-4 rounded-full overflow-hidden backdrop-blur-md text-white min-w-[160px] transition-all duration-200"
            >
              <span className="relative z-10 font-bold tracking-widest text-sm">下载APP</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
