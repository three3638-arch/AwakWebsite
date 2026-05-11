import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function BrandSlogan() {
  const { t } = useTranslation('common');

  const descLines = t('home.slogan.desc').split('\n');

  return (
    <section className="flex w-full flex-col items-start justify-center overflow-hidden bg-[#F8F8F8] px-5 py-18 md:px-[170px] md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
        }}
        className="w-full"
      >
        <motion.h2
          className="text-left text-[clamp(36px,8vw,72px)] font-normal leading-none tracking-tighter text-ink md:text-[72px]"
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {[t('home.slogan.titleLine1'), t('home.slogan.titleLine2')].map((line) => (
            <motion.span
              key={line}
              variants={{
                hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {line}
            </motion.span>
          ))}
        </motion.h2>

        <motion.div className="mt-10 max-w-2xl space-y-2 text-left text-[15px] font-normal leading-[1.75] text-ink/65 md:text-[20px] md:leading-[1.65]">
          {descLines.map((line) => (
            <motion.p
              key={line}
              variants={{
                hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
