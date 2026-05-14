import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import Masonry, { type MasonryItem } from './Masonry';

const newsItems = [
  { id: 'b1', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80', nbg: 'nbg1' as const, main: true },
  { id: 'b2', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80', nbg: 'nbg2' as const, main: false },
  { id: 'b3', img: 'https://i.ibb.co/wFCQp2wk/image.png', nbg: 'nbg3' as const, main: false },
  { id: 'b4', img: 'https://i.ibb.co/8LKkcKPL/Open-positions-at-Oura.jpg', nbg: 'nbg4' as const, main: false },
  { id: 'b5', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80', nbg: 'nbg5' as const, main: false },
  { id: 'b6', img: 'https://i.ibb.co/m5J3KvJN/Alzheimers.jpg', nbg: 'nbg2' as const, main: false },
  { id: 'b7', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', nbg: 'nbg3' as const, main: false },
  {
    id: 'b8',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80',
    nbg: 'nbg4' as const,
    main: false,
  },
  {
    id: 'b9',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80',
    nbg: 'nbg5' as const,
    main: false,
  },
];

/** 传给 Masonry 的 height 越大，该卡片在瀑布流里占位越高（内部会 /2） */
const masonryHeights: Record<string, number> = {
  b1: 920,
  b2: 560,
  b3: 620,
  b4: 600,
  b5: 660,
  b6: 540,
  b7: 600,
  b8: 640,
  b9: 580,
};

export default function BrandDynamics() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const { t, i18n } = useTranslation('common');

  const go = (id: string) => navigate(withPath(`/news/${id}`));

  const masonryItems: MasonryItem[] = useMemo(
    () =>
      newsItems.map((item) => ({
        id: item.id,
        img: item.img,
        url: withPath(`/news/${item.id}`),
        height: masonryHeights[item.id] ?? 560,
        meta: (
          <div className="news-masonry-meta">
            <p className="ndate">{t(`home.brandDynamics.news.${item.id}.date`)}</p>
            <h3 className="ntitle">{t(`home.brandDynamics.news.${item.id}.title`)}</h3>
            <p className="nexcerpt">{t(`home.brandDynamics.news.${item.id}.excerpt`)}</p>
          </div>
        ),
      })),
    [t, withPath],
  );

  return (
    <section id="news" className="relative z-[3]">
      <div className="wrap r d3">
        <header className="news-hdr">
          <h2>{t('home.brandDynamics.title')}</h2>
          <Link to={withPath('/news')} className="news-more">
            {t('home.brandDynamics.more')}
          </Link>
        </header>

        <div className="news-masonry-wrap hidden lg:block">
          <Masonry
            key={i18n.language}
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover
            hoverScale={0.97}
            blurToFocus
            colorShiftOnHover={false}
            onItemClick={(it) => go(it.id)}
          />
        </div>

        <div className="flex flex-col gap-[3px] lg:hidden">
          {newsItems.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              layout="stack"
              onNavigate={() => go(item.id)}
              title={t(`home.brandDynamics.news.${item.id}.title`)}
              dateStr={t(`home.brandDynamics.news.${item.id}.date`)}
              excerpt={t(`home.brandDynamics.news.${item.id}.excerpt`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type Item = (typeof newsItems)[number];

function NewsCard({
  item,
  layout,
  onNavigate,
  title,
  dateStr,
  excerpt,
}: {
  item: Item;
  layout: 'featured' | 'stack';
  onNavigate: () => void;
  title: string;
  dateStr: string;
  excerpt: string;
}) {
  const isMain = layout === 'featured' && item.main;

  return (
    <article
      className={`ncard ${isMain ? 'ncard-main' : ''}`}
      onClick={onNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={`nimg ${item.nbg}`}>
        <img className="nimg-bg" src={item.img} alt={title} referrerPolicy="no-referrer" />
      </div>
      <div className="nbody">
        <p className="ndate">{dateStr}</p>
        <h3 className="ntitle">{title}</h3>
        <p className="nexcerpt">{excerpt}</p>
      </div>
    </article>
  );
}
