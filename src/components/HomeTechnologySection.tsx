import { Clock, LayoutGrid, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Spec = { n: string; l: string };
type CarouselSlide = {
  image: string;
  title: string;
  dataRows: { label: string; value: string }[];
};

const SPEC_ICONS = [LayoutGrid, Zap, Clock, ShieldCheck] as const;
const AUTO_MS = 4800;

export default function HomeTechnologySection() {
  const { t } = useTranslation('common');
  const specs = t('home.technology.specs', { returnObjects: true }) as Spec[];
  const slides = useMemo(() => {
    const raw = t('home.technology.carousel', { returnObjects: true });
    return Array.isArray(raw) ? (raw as CarouselSlide[]) : [];
  }, [t]);

  const [idx, setIdx] = useState(0);
  const n = slides.length;
  const leftColRef = useRef<HTMLDivElement>(null);
  const carouselHostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const left = leftColRef.current;
    const host = carouselHostRef.current;
    if (!left || !host || typeof ResizeObserver === 'undefined') return;

    const sync = () => {
      host.style.height = `${left.offsetHeight}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(left);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [n, specs]);

  useEffect(() => {
    if (n < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % n), AUTO_MS);
    return () => window.clearInterval(id);
  }, [n]);

  return (
    <section id="technology" className="relative z-[3] hidden lg:block">
      <div className="wrap r d5">
        <div className="two-col min-h-0">
          <div ref={leftColRef} className="min-h-0">
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

          {n > 0 ? (
            <div
              ref={carouselHostRef}
              className="tech-carousel-wrap flex min-h-0 w-full min-w-0 justify-center self-start"
            >
              <div
                className="tech-carousel-outer relative h-full min-h-0 w-full max-w-[min(100%,480px)] overflow-hidden rounded-[10px] border border-black/[0.06] bg-[#e8e8e8] shadow-[0_28px_90px_rgba(0,0,0,0.1)]"
                role="region"
                aria-roledescription="carousel"
                aria-label={t('home.technology.carouselAria')}
              >
                <div
                  className="tech-carousel-track flex h-full transition-transform duration-[720ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: `${n * 100}%`,
                    transform: `translateX(-${(100 * idx) / n}%)`,
                  }}
                >
                  {slides.map((slide, i) => (
                    <div
                      key={i}
                      className="relative h-full shrink-0 overflow-hidden"
                      style={{ width: `${100 / n}%` }}
                      aria-hidden={i !== idx}
                    >
                      <img
                        src={slide.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        referrerPolicy="no-referrer"
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center px-[9%] pb-[10%] pt-[20%]">
                        <div className="tech-carousel-glass w-[88%] max-h-[42%] min-h-0 overflow-hidden">
                          <div className="tech-carousel-glass-title">{slide.title}</div>
                          <table className="tech-carousel-table">
                            <tbody>
                              {(slide.dataRows ?? []).slice(0, 4).map((row, ri) => (
                                <tr key={ri}>
                                  <th scope="row">{row.label}</th>
                                  <td>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pointer-events-auto absolute bottom-3 left-0 right-0 z-[4] flex justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`tech-carousel-dot h-2 w-2 rounded-full border-0 p-0 transition-transform duration-300 ${
                        i === idx ? 'tech-carousel-dot--active scale-110' : 'tech-carousel-dot--idle'
                      }`}
                      aria-label={t('home.technology.carouselDot', { index: i + 1 })}
                      aria-current={i === idx}
                      onClick={() => setIdx(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
