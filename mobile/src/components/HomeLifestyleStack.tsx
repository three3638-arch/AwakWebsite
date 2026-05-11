import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const SCENES = [
  { id: 'ring' as const, src: 'https://i.ibb.co/zWLc5k7G/4.jpg' },
  { id: 'band' as const, src: 'https://i.ibb.co/zVcfTmFX/2.jpg' },
  { id: 'watch' as const, src: 'https://i.ibb.co/zWdVr7yj/3.jpg' },
  { id: 'glasses' as const, src: 'https://i.ibb.co/C3BGNfSm/5.png' },
];

export default function HomeLifestyleStack() {
  const { t } = useTranslation('common');

  return (
    <section className="w-full bg-[#0D0D0D] pt-0 pb-2">
      <div className="flex flex-col gap-2">
        {SCENES.map((scene, index) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="relative w-full overflow-hidden"
          >
            <div className="relative aspect-[16/11] w-full md:aspect-[21/9]">
              <img
                src={scene.src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute left-0 top-0 max-w-[min(100%,28rem)] p-5 md:p-8">
                <div
                  className="flex max-w-xl flex-col text-left text-white [&>span]:text-[32px] [&>span]:font-black [&>span]:leading-tight"
                  style={{ gap: '14px' }}
                >
                  <span>{t(`home.lifestyle.${scene.id}.l1`)}</span>
                  <span>{t(`home.lifestyle.${scene.id}.l2`)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
