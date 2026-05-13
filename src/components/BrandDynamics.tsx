import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

const newsItems = [
  { id: 'b1', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80', nbg: 'nbg1' as const, main: true },
  { id: 'b2', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80', nbg: 'nbg2' as const, main: false },
  { id: 'b3', img: 'https://i.ibb.co/wFCQp2wk/image.png', nbg: 'nbg3' as const, main: false },
  { id: 'b4', img: 'https://i.ibb.co/8LKkcKPL/Open-positions-at-Oura.jpg', nbg: 'nbg4' as const, main: false },
  { id: 'b5', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80', nbg: 'nbg5' as const, main: false },
  { id: 'b6', img: 'https://i.ibb.co/m5J3KvJN/Alzheimers.jpg', nbg: 'nbg2' as const, main: false },
  { id: 'b7', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', nbg: 'nbg3' as const, main: false },
];

export default function BrandDynamics() {
  const navigate = useNavigate();
  const { withPath } = useLocalePath();
  const { t } = useTranslation('common');

  const gridFive = newsItems.filter((x) => ['b1', 'b2', 'b3', 'b4', 'b5'].includes(x.id));

  const go = (id: string) => navigate(withPath(`/news/${id}`));

  return (
    <section id="news" className="relative z-[3]">
      <div className="wrap r d3">
        <header className="news-hdr">
          <h2>{t('home.brandDynamics.title')}</h2>
          <Link to={withPath('/news')} className="news-more">
            {t('home.brandDynamics.more')}
          </Link>
        </header>

        <div className="news-grid hidden lg:grid">
          {gridFive.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              layout="featured"
              onNavigate={() => go(item.id)}
              title={t(`home.brandDynamics.news.${item.id}.title`)}
              dateStr={t(`home.brandDynamics.news.${item.id}.date`)}
              excerpt={t(`home.brandDynamics.news.${item.id}.excerpt`)}
            />
          ))}
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
