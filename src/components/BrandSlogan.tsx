import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function BrandSlogan() {
  const { t } = useTranslation('common');
  const easeStd: [number, number, number, number] = [0.4, 0, 0.2, 1];

  const titleMotion = {
    initial: { letterSpacing: "0.35em", opacity: 0, filter: "blur(12px)", y: 20 },
    whileInView: {
      letterSpacing: "-0.02em",
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
    transition: { duration: 1.6, ease: easeStd },
    viewport: { once: true, margin: "-20%" },
  };

  const descMotion = {
    initial: { y: 20, opacity: 0, filter: "blur(4px)" },
    whileInView: { y: 0, opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.85, delay: 0.35, ease: easeStd },
    viewport: { once: true, margin: "-20%" },
  };

  return (
    <section className="flex w-full flex-col items-center justify-center overflow-hidden border-t border-[rgba(255,255,255,0.1)] bg-black px-6 py-20 md:px-[168px] md:py-24">
      <motion.h2
        {...titleMotion}
        className="text-center text-7xl font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[90px] lg:text-[100px]"
      >
        {t('home.slogan.titleLine1')}
        <br />
        {t('home.slogan.titleLine2')}
      </motion.h2>

      <motion.p {...descMotion} className="mt-12 max-w-2xl text-center text-xl font-normal text-[#a1a1aa] md:text-2xl">
        {t('home.slogan.desc')}
      </motion.p>
    </section>
  );
}
