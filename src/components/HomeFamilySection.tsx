import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Briefcase, Code2, Heart, User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

type FamCard = { name: string; role: string; detail: string };

const PERSONA_ICONS = [User, Users, Heart, Activity, Briefcase, Code2] as const;

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
          <span className="label r">{t('home.family.sectionLabel')}</span>
          <h2 className="heading r d1">{t('home.family.title')}</h2>
        </header>

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

        {/* 与参考稿一致：#persona-detail 由当前选中 persona 填充文案（非进度条） */}
        <div id="persona-detail" className="persona-detail show" role="tabpanel" aria-labelledby={`persona-tab-${active}`}>
          <div className="pd-name">{activeCard.name}</div>
          <div className="pd-sub">{activeCard.role}</div>
          <p className="pd-copy">{activeCard.detail}</p>
        </div>

        <div className="fam-copy r">
          <p>{t('home.family.ctaIntro')}</p>
          <Link to={withPath('/brand-story')} className="btn-outline">
            {t('home.family.ctaLabel')}
          </Link>
        </div>
      </div>
    </section>
  );
}
