import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function BrandSlogan() {
  const { t } = useTranslation('common');
  const titleMotion = {
    initial: { letterSpacing: "0.5em", opacity: 0, filter: "blur(15px)", y: 20 },
    whileInView: { 
      letterSpacing: "-0.02em", 
      opacity: 1, 
      filter: "blur(0px)",
      y: 0
    },
    transition: { duration: 2, ease: [0.16, 1, 0.3, 1] },
    viewport: { once: true, margin: "-20%" }
  };

  const descMotion = {
    initial: { y: 20, opacity: 0, filter: "blur(5px)" },
    whileInView: { y: 0, opacity: 1, filter: "blur(0px)" },
    transition: { duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] },
    viewport: { once: true, margin: "-20%" }
  };

  return (
    <section className="w-full bg-[#000000] py-[80px] px-6 md:px-[170px] flex flex-col items-center justify-center overflow-hidden">
      <motion.h2 
        {...titleMotion} 
        animate={{ opacity: [1, 0.9, 1] }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          default: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
        }}
        className="text-[#FFFFFF] text-7xl md:text-[90px] lg:text-[100px] font-black leading-[1.05] tracking-[-3px] text-center"
      >
        {t('home.slogan.titleLine1')}<br />{t('home.slogan.titleLine2')}
      </motion.h2>
      
      <motion.p {...descMotion} className="text-[#FFFFFF]/60 text-xl md:text-2xl font-medium max-w-2xl text-center mt-12">
        {t('home.slogan.desc')}
      </motion.p>
    </section>
  );
}
