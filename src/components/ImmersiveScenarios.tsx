import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useTranslation } from 'react-i18next';

// “智能硬件的场景”左侧按钮顺序（含对应内容/图片）
const PRODUCT_IDS = ['ring', 'band', 'glasses', 'watch'] as const;

const FEATURE_IMAGES: Record<(typeof PRODUCT_IDS)[number], string[]> = {
  ring: [
    'https://i.ibb.co/TDY245bK/image.png',
    'https://i.ibb.co/xKgfc5rN/Oura.jpg',
    'https://i.ibb.co/MkPGBT9k/Oura.jpg',
    'https://i.ibb.co/fYmtwXGT/p12-2.jpg',
    'https://i.ibb.co/cKjxbXng/image.png',
    'https://i.ibb.co/9m2JVLrV/p12-2.jpg',
  ],
  band: [
    'https://i.ibb.co/whtz0KFz/The-Best-Ways-To-Prevent-Falling-In-Your-Home-Health-Digest.jpg',
    'https://i.ibb.co/d4VkCTvf/10-Pains-You-Should-Never-Ever-Ignore.jpg',
    'https://i.ibb.co/7dw6GWmS/Olive-Stress-Management-Bracelet-by-Hardy-Simes.jpg',
    'https://i.ibb.co/hxQb6mB2/jimeng-2026-04-20-5496-logo.png',
    'https://i.ibb.co/zTJpVzSv/image.png',
    'https://i.ibb.co/99yZStWr/image.png',
  ],
  glasses: [
    'https://i.ibb.co/fGyWsKLp/image.png',
    'https://i.ibb.co/Xrkc6FL9/XRAI-AR2-The-Original-Captioning-Glasses-Redesigned.jpg',
    'https://i.ibb.co/39b8QJZW/jimeng-2026-04-03-6916.png',
    'https://i.ibb.co/bn5r2Hm/jimeng-2026-04-23-1745-1.png',
    'https://i.ibb.co/Y4sjjjMg/jimeng-2026-04-23-1426.png',
    'https://i.ibb.co/TxfjjQ91/jimeng-2026-04-23-5862-1.png',
  ],
  watch: [
    'https://i.ibb.co/1fyLt5S6/jimeng-2026-04-03-6305.png',
    'https://i.ibb.co/ynTmxzW7/image.png',
    'https://i.ibb.co/yFD7J0BZ/image.png',
    'https://i.ibb.co/HDfCRBt8/jimeng-2026-04-20-7301-1.png',
    'https://i.ibb.co/DDk1xWyM/image.png',
    'https://i.ibb.co/vx1DpGTL/jimeng-2026-04-22-7846.png',
  ],
};

export default function ImmersiveScenarios() {
  const { t } = useTranslation('common');
  const productsData = useMemo(() => {
    return PRODUCT_IDS.map((id) => {
      const featTexts = t(`home.immersive.products.${id}.features`, { returnObjects: true }) as {
        title: string;
        desc: string;
      }[];
      const imgs = FEATURE_IMAGES[id];
      return {
        id,
        name: t(`home.immersive.products.${id}.name`),
        features: featTexts.map((f, i) => ({ ...f, img: imgs[i] ?? '' })),
      };
    });
  }, [t]);

  const [activeProductId, setActiveProductId] = useState<(typeof PRODUCT_IDS)[number]>(PRODUCT_IDS[0]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const activeProductData =
    productsData.find((p) => p.id === activeProductId) ?? productsData[0];

  return (
    <section ref={containerRef} className="bg-[#F5F5F7] pt-2 pb-16 font-sans relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-0 bottom-0 w-[300px] z-[40] pointer-events-none flex flex-col justify-center pl-[170px]"
      >
        <div
          className="absolute inset-y-0 left-0 w-[500px] bg-gradient-to-right from-[#F5F5F7] via-[#F5F5F7]/80 to-transparent z-[-1]"
          style={{
            background:
              'linear-gradient(to right, #F5F5F7 0%, rgba(245, 245, 247, 0.8) 40%, transparent 100%)',
          }}
        />

        <div className="flex flex-col gap-10 pointer-events-auto relative">
          {productsData.map((product) => {
            const isActive = activeProductId === product.id;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveProductId(product.id)}
                className={`relative group text-left transition-all duration-300 w-fit ${
                  isActive ? 'text-[#1D1D1F]' : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                <span className="text-[20px] font-bold tracking-tight uppercase block leading-none">
                  {product.name}
                </span>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderlineSide"
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="relative group z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProductId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 pl-6 pr-6 md:pl-[170px] md:pr-6"
          >
            {activeProductData.features.map((feature, idx: number) => {
              const widthClass = idx === 0 ? 'w-[65vw]' : 'w-[30vw]';

              return (
                <div
                  key={idx}
                  className={`relative flex-shrink-0 snap-start rounded-[24px] overflow-hidden bg-black group/item ${widthClass} aspect-[16/10] shadow-2xl shadow-black/5`}
                >
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[2s] group-hover/item:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-700" />

                  <div className={`absolute bottom-10 ${idx === 0 ? 'right-10 text-right' : 'left-10'} z-20`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-white text-3xl font-black mb-3 tracking-tight leading-tight">{feature.title}</h3>
                      <p
                        className={`text-white/40 text-sm max-w-[350px] leading-relaxed font-medium ${idx === 0 ? 'ml-auto' : ''}`}
                      >
                        {feature.desc}
                      </p>
                    </motion.div>
                  </div>

                  <div className="absolute top-8 right-8 text-white/20 text-[10px] font-mono tracking-widest uppercase">
                    SCENARIO.0{idx + 1}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .snap-x {
            scroll-behavior: smooth;
          }
        `}</style>
      </div>

      <div className="absolute left-[170px] top-0 bottom-0 w-[1px] bg-black/5 pointer-events-none z-[45]" />
    </section>
  );
}
