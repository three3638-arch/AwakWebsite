import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

const TOP_ITEMS = [
  { id: 'b1' as const, img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80' },
  { id: 'b2' as const, img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80' },
  { id: 'b3' as const, img: 'https://i.ibb.co/wFCQp2wk/image.png' },
  { id: 'b4' as const, img: 'https://i.ibb.co/8LKkcKPL/Open-positions-at-Oura.jpg' },
  { id: 'b5' as const, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80' },
  { id: 'b6' as const, img: 'https://i.ibb.co/m5J3KvJN/Alzheimers.jpg' },
];

/** 品牌动态配图 URL，供首页预加载 */
export const BRAND_DYNAMICS_IMAGE_URLS = TOP_ITEMS.map((it) => it.img);

/** 左列：大—小—中；右列：小—小—大（第三张在「标准大」aspect 3/5 基础上高度 +60% → aspect-[3/8]） */
function brandCardAspectClass(column: 'L' | 'R', rowIdx: number): string {
  if (column === 'L') {
    const seq = ['aspect-[3/5]', 'aspect-[1/1]', 'aspect-[3/4]'] as const;
    return seq[rowIdx] ?? 'aspect-[3/4]';
  }
  const seq = ['aspect-[1/1]', 'aspect-[1/1]', 'aspect-[3/8]'] as const;
  return seq[rowIdx] ?? 'aspect-[3/4]';
}

export default function BrandDynamics() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');

  const cards = useMemo(() => TOP_ITEMS, []);
  const columnLeft = cards.slice(0, 3);
  const columnRight = cards.slice(3, 6);

  const renderCard = (
    item: (typeof TOP_ITEMS)[number],
    idx: number,
    column: 'L' | 'R',
  ) => {
    const title = t(`home.brandDynamics.news.${item.id}.title`);
    const excerptFull = t(`home.brandDynamics.news.${item.id}.excerpt`, { defaultValue: '' });
    const excerpt = excerptFull;
    const aspectClass = brandCardAspectClass(column, idx);

    return (
      <motion.article
        key={`${column}-${item.id}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ delay: idx * 0.06, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={() => navigate(withPath(`/news/${item.id}`))}
        className="group cursor-pointer"
      >
        <div className="overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[#09090b]">
          <div className={['relative w-full', aspectClass].join(' ')}>
            <img
              src={item.img}
              alt={title}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 28%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.02) 82%, rgba(0,0,0,0) 100%)',
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
              <h3 className="text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-white">{title}</h3>
              {excerpt ? (
                <p className="mt-1.5 text-[13px] font-normal leading-[1.45] text-[#a1a1aa]">{excerpt}</p>
              ) : null}
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <section className="overflow-hidden bg-black px-4 py-16 font-sans text-white md:px-[168px] md:py-20">
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-[26px] font-medium leading-[1.25] tracking-[-0.02em] text-white md:text-[32px]"
        >
          {t('home.brandDynamics.title')}
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">{columnLeft.map((item, idx) => renderCard(item, idx, 'L'))}</div>
        <div className="flex flex-col gap-3">{columnRight.map((item, idx) => renderCard(item, idx, 'R'))}</div>
      </div>
    </section>
  );
}
