import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

const newsItems = [
  {
    id: 'b1',
    img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80',
    size: 'flex-[2]',
  },
  {
    id: 'b2',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
    size: 'flex-[1]',
  },
  {
    id: 'b3',
    img: 'https://i.ibb.co/wFCQp2wk/image.png',
    size: 'flex-[1]',
  },
  {
    id: 'b4',
    img: 'https://i.ibb.co/8LKkcKPL/Open-positions-at-Oura.jpg',
    size: 'flex-[1.5]',
  },
  {
    id: 'b5',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    size: 'flex-[2]',
  },
  {
    id: 'b6',
    img: 'https://i.ibb.co/m5J3KvJN/Alzheimers.jpg',
    size: 'flex-[1]',
  },
  {
    id: 'b7',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    size: 'flex-[1.2]',
  },
];

export default function BrandDynamics() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');

  return (
    <section className="bg-white py-12 px-6 md:px-[170px] font-sans overflow-hidden">
      <div className="mb-10">
        <h2 className="text-[40px] font-black tracking-tight text-black">{t('home.brandDynamics.title')}</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 h-[400px]">
          {newsItems.slice(0, 3).map((item, idx) => {
            const title = t(`home.brandDynamics.news.${item.id}.title`);
            const subtitle = t(`home.brandDynamics.news.${item.id}.subtitle`);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(withPath(`/news/${item.id}`))}
                className={`relative overflow-hidden rounded-[24px] bg-[#F5F5F7] group ${item.size} cursor-pointer`}
              >
                <img
                  src={item.img}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  alt={title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="text-white text-xl font-bold mb-1 tracking-tight">{title}</h4>
                  <p className="text-white/60 text-sm font-medium">{subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-row gap-4 h-[350px]">
          {newsItems.slice(3, 7).map((item, idx) => {
            const title = t(`home.brandDynamics.news.${item.id}.title`);
            const subtitle = t(`home.brandDynamics.news.${item.id}.subtitle`);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 3) * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(withPath(`/news/${item.id}`))}
                className={`relative overflow-hidden rounded-[24px] bg-[#F5F5F7] group ${item.size} cursor-pointer`}
              >
                <img
                  src={item.img}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  alt={title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-white text-lg font-bold mb-1 tracking-tight">{title}</h4>
                  <p className="text-white/60 text-xs font-medium">{subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
