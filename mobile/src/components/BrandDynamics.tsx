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
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ delay: idx * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => navigate(withPath(`/news/${item.id}`))}
        className="group cursor-pointer"
      >
        <div className="overflow-hidden rounded-[12px] bg-black/5">
          <div className={['relative w-full', aspectClass].join(' ')}>
            <img
              src={item.img}
              alt={title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/25 to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
              <h3 className="text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
                {title}
              </h3>
              {excerpt ? (
                <p className="mt-1.5 text-[13px] leading-[1.45] text-white/88 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
                  {excerpt}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <section className="overflow-hidden bg-[#F8F8F8] px-[12px] py-18 font-sans text-ink md:px-[170px]">
      <div className="mb-5">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[26px] font-normal leading-[1.25] tracking-[-0.02em] text-ink"
        >
          探索 AWAK 动态
          <br />
          照见生活新意
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-[44rem] text-[18px] font-normal leading-[1.6] tracking-[-0.01em] text-black/45"
        >
          在睡眠、运动与日常节律中，记录身体的真实变化与成长
        </motion.p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">{columnLeft.map((item, idx) => renderCard(item, idx, 'L'))}</div>
        <div className="flex flex-col gap-3">{columnRight.map((item, idx) => renderCard(item, idx, 'R'))}</div>
      </div>
    </section>
  );
}
