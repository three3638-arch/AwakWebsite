import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FooterSections from '../components/FooterSections';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function BrandStoryPage() {
  const { t } = useTranslation('common');
  const pillars = useMemo(
    () =>
      (t('brandStoryPage.pillars', { returnObjects: true }) as { title: string; body: string }[]) ?? [],
    [t],
  );

  return (
    <div className="min-h-screen bg-[#050508] text-[#F5F5F5]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 15%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 70%, rgba(221,247,0,0.04) 0%, transparent 50%), #050508',
          }}
          aria-hidden
        />
      </div>

      <section className="relative z-[1] px-6 pb-24 pt-28 md:px-[170px] md:pb-32 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.05, ease }}
        >
          <p className="mb-8 text-[11px] font-light uppercase tracking-[0.22em] text-[#A7A7B2]">
            {t('brandStoryPage.label')}
          </p>
          <h1 className="max-w-[18ch] font-[family-name:var(--display)] text-[clamp(2.5rem,6vw,4.25rem)] font-normal leading-[1.06] tracking-[-0.03em] text-[#F5F5F5]">
            {t('brandStoryPage.title')}
          </h1>
          <p className="home-section-lede mt-10 max-w-[42rem] text-[#A7A7B2]">{t('brandStoryPage.lede')}</p>
        </motion.div>

        <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar, i) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.95, delay: i * 0.08, ease }}
              className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md md:p-10"
            >
              <h2 className="font-[family-name:var(--display)] text-xl font-normal tracking-[-0.02em] text-[#F5F5F5] md:text-2xl">
                {pillar.title}
              </h2>
              <p className="mt-5 text-[15px] font-light leading-[1.75] text-[#A7A7B2]">{pillar.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.p
          className="mt-16 max-w-[42rem] text-[15px] font-light leading-[1.75] text-[#8E8E93] md:mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          {t('brandStoryPage.closing')}
        </motion.p>
      </section>

      <div className="relative z-[1] bg-white">
        <FooterSections />
      </div>
    </div>
  );
}
