import { motion } from 'motion/react';
import { useRef } from 'react';

// 动画配置常量，确保持续时间和缓动效果高级且统一
const duration = 1.2;
const ease = [0.16, 1, 0.3, 1]; // 自定义高级缓动曲线 (easeOutExpo)

// 错位进场动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 子元素依次进场的时间间隔
      delayChildren: 0.3,    // 容器加载后的延迟
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 1, ease }
  },
};

export default function IntroSection() {
  const constraintsRef = useRef(null); // 用于 3D 悬浮的引用

  return (
    <section className="py-2 bg-[#FFFFFF] text-brand-black overflow-hidden relative">
      {/* 🌟 超级炫酷背景：流动光束 */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-brand-black/10 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-brand-black/5 to-transparent animate-pulse delay-700" />
      </div>

      <motion.div 
        className="w-full mx-auto px-6 md:px-[170px] relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // 当 30% 进入视口时触发
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
          
          {/* 🌟 Left Content: 错位依次进场 */}
          <div className="w-full lg:w-2/5 max-w-3xl">
            <div className="space-y-4 mb-6">
              
              {/* 1. 服务生态：流光标题 */}
              <motion.div variants={itemVariants} className="relative group overflow-hidden inline-block">
                <h2 className="text-7xl md:text-[90px] lg:text-[100px] font-black leading-[1.05] tracking-[-3px] mb-2 relative z-10 text-brand-black">
                  服务生态
                </h2>
                {/* 超级炫酷：滑过的流光 */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent z-0"
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '100%' }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                  style={{ mixBlendMode: 'multiply', opacity: 0.5 }}
                />
              </motion.div>

              {/* 2. APP名称：淡入 & 模糊解冻 */}
              <motion.p variants={itemVariants} className="text-xl font-light text-brand-black/80 mb-8 mt-4">
                AwakHealth APP — 全栈健康服务
              </motion.p>
              
              {/* 3. 描述文本：淡入 & 上浮 */}
              <motion.div variants={itemVariants} className="space-y-4 mb-6">
                <p className="text-base md:text-lg font-light text-brand-black/60 leading-relaxed max-w-xl pl-6">
                  提供健康+睡眠+运动+营养全链路解决方案。涵盖睡眠管理、健康监测、运动指导、AI营养师及社区互动，满足【商城/保险/体检】全方位需求。
                </p>
              </motion.div>

              {/* 4. 按钮组：弹性光圈效果 */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-6 mt-4">
                <motion.button
                  whileHover={{ 
                    scale: 0.97
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="px-8 py-3 bg-accent text-brand-black font-medium text-sm rounded-full relative overflow-hidden group shadow-none"
                >
                  <span className="relative z-10">立即体验</span>
                  {/* 悬浮时的背景光波 */}
                  <div className="absolute inset-0 bg-brand-black/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 0.97 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 font-medium text-sm rounded-full hover:bg-brand-black/5 transition-all duration-300 text-brand-black/90 shadow-none"
                >
                  查看演示
                </motion.button>
              </motion.div>

              {/* 5. 状态栏：数字“加载”动画 (模拟视觉) */}
              <motion.div 
                variants={itemVariants} 
                className="grid grid-cols-3 gap-8 pt-6"
              >
                {[
                  { label: '体检', value: '首年优惠', desc: '首年优惠赠送' },
                  { label: '100万', value: '1,000,000', desc: '医疗报销' },
                  { label: '一站式', value: '全流程', desc: '体检/保险预约服务' },
                ].map((stat, i) => (
                  <div key={i}>
                    {/* 炫酷：模拟数字滚动淡入 */}
                    <motion.p 
                      className="text-2xl font-light mb-2 text-brand-black"
                      initial={{ opacity: 0, filter: "blur(5px)" }}
                      whileInView={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 1.2 + i * 0.2, duration: 0.8 }}
                    >
                      {stat.label}
                    </motion.p>
                    <p className="font-mono text-xs text-brand-black/40 uppercase tracking-widest">{stat.desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* 🌟 Right Content: 3D 视差悬浮 & 呼吸光晕 */}
          <div className="w-full lg:w-3/5 relative flex justify-center items-center" ref={constraintsRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 60, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ 
                duration: 1.5, 
                ease: ease,
                scale: { delay: 0.2, duration: 1.2, ease } // 组合动画，让进场更有层次
              }}
              className="relative z-10 cursor-grab active:cursor-grabbing"
              
              /* 超级炫酷：鼠标 3D 悬浮视差 */
              whileHover={{ 
                rotateX: [0, -5, 5, 0], 
                rotateY: [0, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
            >
              <img 
                src="https://i.ibb.co/RkYkRwH5/app.png" 
                alt="AwakHealth App Interface" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* 超级炫酷装饰：呼吸光晕 */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-accent rounded-full blur-3xl -z-10" 
                animate={{
                  opacity: [0.03, 0.08, 0.03],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
