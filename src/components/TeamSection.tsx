import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

const CARD_IDS = ['ring', 'band', 'watch', 'glasses'] as const;

const PRODUCT_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/products/ring',
  band: '/products/band',
  watch: '/products/watch',
  glasses: '/products/glasses',
};

const STORE_LINK: Record<(typeof CARD_IDS)[number], string> = {
  ring: '/store/ring',
  band: '/store/bracelet',
  watch: '/store/watch',
  glasses: '/store/glasses',
};

export default function TeamSection() {
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#F5F5F7] w-full pt-12 pb-16">
      <section className="relative w-full mx-auto px-6 md:px-[170px] z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-4xl lg:text-4xl leading-[1.2] font-black text-[#1D1D1F] tracking-tight">
            {t('home.team.heading1')} <br />
            {t('home.team.heading2')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CARD_IDS.map((id, index) => {
            const img =
              id === 'ring'
                ? 'https://i.ibb.co/FLXrp6qv/image.jpg'
                : id === 'band'
                  ? 'https://i.ibb.co/1t1FyW93/image.jpg'
                  : id === 'watch'
                    ? 'https://i.ibb.co/YBjhmq8w/image.jpg'
                    : 'https://i.ibb.co/FL1q2zKP/image.jpg';

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex flex-col h-full group cursor-pointer"
                onClick={() => navigate(withPath(PRODUCT_LINK[id]))}
              >
                <div className="relative w-full aspect-[2/3] rounded-[24px] overflow-hidden bg-black/40 group-hover:bg-black/60 transition-all duration-500">
                  <img
                    src={img}
                    alt={t(`home.team.cards.${id}.brand`)}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s]"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <button
                      type="button"
                      className="bg-white text-black text-sm font-black px-10 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-black/20"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(withPath(STORE_LINK[id]));
                      }}
                    >
                      {t('home.team.cta')} <span className="text-lg">→</span>
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="mt-8 flex flex-col gap-2">
                  <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tight group-hover:text-black transition-colors uppercase">
                    {t(`home.team.cards.${id}.brand`)}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-[#86868B] font-bold tracking-widest uppercase">
                      {t(`home.team.cards.${id}.category`)}
                    </p>
                    <p className="text-[#86868B] text-base font-medium leading-relaxed max-w-[90%]">
                      {t(`home.team.cards.${id}.subtitle`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
