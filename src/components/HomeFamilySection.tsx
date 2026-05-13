import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Briefcase, Code2, Heart, User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

type FamCard = { name: string; role: string; detail: string };

const PERSONA_ICONS = [User, Users, Heart, Activity, Briefcase, Code2] as const;

/** 与上方 persona 选中态呼应的详情区底色（PC 首页） */
const PERSONA_DETAIL_BG = ['#ffffff', '#eef6ff', '#fff5f2', '#eefcf4', '#f4efff', '#fffbeb'] as const;

export default function HomeFamilySection() {
  const { t } = useTranslation('common');
  const { withPath } = useLocalePath();
  const cards = t('home.family.cards', { returnObjects: true }) as FamCard[];
  const [active, setActive] = useState(0);
  const activeCard = cards[active] ?? cards[0];

  return (
    <section id="family" className="sec sec-alt relative z-[3]">
      <div className="wrap">
        <header className="fam-header">
          <h2 className="heading r d1">{t('home.family.title')}</h2>
        </header>

        <div className="persona-block">
          <div className="persona-rail" id="persona-rail" role="tablist" aria-label={t('home.family.sectionLabel')}>
            {cards.map((card, i) => {
              const Icon = PERSONA_ICONS[i] ?? User;
              const isOn = active === i;
              return (
                <button
                  key={card.name}
                  type="button"
                  role="tab"
                  aria-selected={isOn}
                  id={`persona-tab-${i}`}
                  className={`persona${isOn ? ' on' : ''}`}
                  data-persona={String(i)}
                  onClick={() => setActive(i)}
                >
                  <div className="p-icon" aria-hidden>
                    <Icon width={22} height={22} strokeWidth={1} className="text-[#8e8e93]" />
                  </div>
                  <div className="p-name">{card.name}</div>
                  <div className="p-sub">{card.role}</div>
                </button>
              );
            })}
          </div>

          <div
            id="persona-detail"
            className="persona-detail show"
            role="tabpanel"
            aria-labelledby={`persona-tab-${active}`}
            style={{ backgroundColor: PERSONA_DETAIL_BG[active] ?? PERSONA_DETAIL_BG[0] }}
          >
            <div className="pd-name">{activeCard.name}</div>
            <div className="pd-sub">{activeCard.role}</div>
            <p className="pd-copy">{activeCard.detail}</p>
          </div>
        </div>

        <div className="fam-copy r">
          <Link to={withPath('/brand-story')} className="btn-outline">
            {t('home.family.ctaLabel')}
          </Link>
        </div>
      </div>
    </section>
  );
}
