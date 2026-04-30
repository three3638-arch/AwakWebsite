import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

export default function Hero() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  return (
    <section className="relative flex flex-1 min-h-0 flex-col items-end justify-center pt-20 pb-6 md:pt-16 md:pb-8 mb-0 overflow-hidden bg-[#161617] text-white w-full pl-6 pr-6 md:pl-[170px] md:pr-[85px]">
      {/* 交互式背景 - 视频/图片 */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#161617]">
        <img 
          src="https://i.ibb.co/6JqSk9k4/hero.png"
          alt="Hero Background"
          className="w-full h-full object-cover object-left transition-all duration-1000 scale-[1.02] translate-x-0"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full mx-auto pb-4 md:pb-6 flex flex-col items-end text-right">
        <div className="max-w-7xl flex flex-col items-end">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[80px] lg:text-[100px] font-black leading-[1.05] tracking-[-3px] text-white"
          >
            {t('home.hero.title')}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-end mt-6 text-white/70 text-lg md:text-xl font-normal tracking-wide"
          >
            {t('home.hero.subtitle')}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-end gap-4 md:gap-6 mt-6 md:mt-8"
          >
            <motion.button
              whileHover={{ scale: 0.97, backgroundColor: "#E6FF00", color: "#1D1D1F" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(withPath('/store'))}
              className="group relative flex items-center justify-center bg-[#DDF700] px-10 py-4 rounded-full overflow-hidden text-[#080808] min-w-[160px] transition-colors duration-200"
            >
              <span className="relative z-10 font-bold tracking-widest text-sm">{t('home.hero.ctaBuy')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 0.97, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center justify-center bg-white/10 px-10 py-4 rounded-full overflow-hidden backdrop-blur-md text-white min-w-[160px] transition-all duration-200"
            >
              <span className="relative z-10 font-bold tracking-widest text-sm">{t('home.hero.ctaApp')}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
