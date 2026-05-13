import { Layers, Cloud, Puzzle, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type EcoCard = { title: string; desc: string };

const ICONS = [Layers, Cloud, Puzzle, ShieldCheck] as const;

export default function HomeEcosystemSection() {
  const { t } = useTranslation('common');
  const cards = t('home.ecosystem.cards', { returnObjects: true }) as EcoCard[];

  return (
    <section id="eco" className="relative z-[3]">
      <div className="wrap r d4">
        <header className="eco-hdr">
          <p className="section-label">{t('home.ecosystem.sectionLabel')}</p>
          <h2>{t('home.ecosystem.title')}</h2>
        </header>

        <div className="eco-grid">
          {cards.slice(0, 4).map((card, i) => {
            const Icon = ICONS[i] ?? ICONS[0];
            return (
              <article key={i} className="ecard">
                <div className="eicon" aria-hidden>
                  <Icon className="h-[22px] w-[22px] text-[var(--g4)]" strokeWidth={1.25} />
                </div>
                <h3 className="etitle">{card.title}</h3>
                <p className="edesc">{card.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
