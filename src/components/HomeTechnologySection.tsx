import { Clock, LayoutGrid, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Spec = { n: string; l: string };
type SensorNode = { label: string };

const ARM_DEG = [-90, 0, 90, 180] as const;

const SPEC_ICONS = [LayoutGrid, Zap, Clock, ShieldCheck] as const;

export default function HomeTechnologySection() {
  const { t } = useTranslation('common');
  const specs = t('home.technology.specs', { returnObjects: true }) as Spec[];
  const nodes = t('home.technology.sensor.nodes', { returnObjects: true }) as SensorNode[];

  return (
    <section id="technology" className="relative z-[3] hidden lg:block">
      <div className="wrap r d5">
        <div className="two-col">
          <div>
            <h2 className="tech-h2">{t('home.technology.title')}</h2>
            <p className="tech-desc">{t('home.technology.description')}</p>
            <div className="tech-spec-grid">
              {specs.slice(0, 4).map((spec, i) => {
                const Icon = SPEC_ICONS[i] ?? LayoutGrid;
                return (
                  <div key={i} className="tech-spec-card">
                    <span className="tech-spec-card-icon" aria-hidden>
                      <Icon className="h-5 w-5 text-[#080808]/75" strokeWidth={1.35} />
                    </span>
                    <span className="tech-spec-card-n">{spec.n}</span>
                    <span className="tech-spec-card-l">{spec.l}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sensor-wrap" aria-hidden>
            <div className="sensor">
              <div className="s-ring s-ring-a" />
              <div className="s-ring s-ring-b" />
              <div className="s-ring s-ring-c" />
              {nodes.slice(0, 4).map((node, i) => {
                const deg = ARM_DEG[i] ?? -90;
                return (
                  <div key={i} className="sensor-arm" style={{ transform: `rotate(${deg}deg)` }}>
                    <div className="sensor-arm-shift">
                      <span className="s-dot" />
                      <span className="s-lbl" style={{ transform: `rotate(${-deg}deg)` }}>
                        {node.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="s-center">
                <span className="s-num">{t('home.technology.sensor.centerNum')}</span>
                <span className="s-tag">{t('home.technology.sensor.centerTag')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
