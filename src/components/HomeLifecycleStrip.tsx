import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'motion/react';

import HomeLifecycleStripBackdrop from './HomeLifecycleStripBackdrop';
import SplashCursor from './SplashCursor';

/**
 * 首页：位于「AI 伴身」模块下方；逐字显现，主文案使用规范最大 Display（约 56–72px）
 */
export default function HomeLifecycleStrip() {
  const { t } = useTranslation('common');
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.25 });

  const line1Raw = t('home.immersive.desktopCollage.line1');
  const line2 = t('home.immersive.desktopCollage.line2');
  const line3 = t('home.immersive.desktopCollage.line3');

  const line1Lines = useMemo(
    () =>
      line1Raw
        .split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    [line1Raw],
  );

  const [n1a, setN1a] = useState(0);
  const [n1b, setN1b] = useState(0);
  const [n2, setN2] = useState(0);
  const [n3, setN3] = useState(0);

  const line1First = line1Lines[0] ?? '';
  const line1Second = line1Lines[1] ?? '';

  useEffect(() => {
    if (!inView) return;
    setN1a(0);
    setN1b(0);
    setN2(0);
    setN3(0);

    let i = 0;
    const tick = () => {
      i += 1;
      if (i <= line1First.length) {
        setN1a(i);
        return true;
      }
      const j = i - line1First.length;
      if (line1Second && j <= line1Second.length) {
        setN1b(j);
        return true;
      }
      const afterLine1 = i - line1First.length - line1Second.length;
      if (afterLine1 <= line2.length) {
        setN2(afterLine1);
        return true;
      }
      const k = afterLine1 - line2.length;
      if (k <= line3.length) {
        setN3(k);
        return k < line3.length;
      }
      return false;
    };

    const id = window.setInterval(() => {
      if (!tick()) window.clearInterval(id);
    }, 32);

    return () => window.clearInterval(id);
  }, [inView, line1First, line1Second, line2, line3]);

  const line1AllDone = line1Second
    ? n1a >= line1First.length && n1b >= line1Second.length
    : n1a >= line1First.length;

  return (
    <section
      id="home-lifecycle-copy"
      className="home-lifecycle-strip relative isolate z-[40] m-0 mt-0 flex min-h-[85dvh] w-full flex-col items-center justify-center overflow-hidden border-0 bg-[#000000] px-6 pt-0 pb-16 md:px-8 md:pb-24 lg:mt-0 lg:min-h-[min(90dvh,960px)] lg:px-0 lg:py-0"
    >
      <HomeLifecycleStripBackdrop />
      <div className="pointer-events-none absolute inset-0 z-[1] min-h-0 w-full overflow-hidden">
        <SplashCursor
          DYE_RESOLUTION={640}
          DENSITY_DISSIPATION={2}
          SPLAT_FORCE={8500}
          SPLAT_RADIUS={0.3}
          CURL={4}
          BACK_COLOR={{ r: 0, g: 0, b: 0 }}
          SHADING={false}
          RAINBOW_MODE={false}
          COLOR="#DDF700"
          TRANSPARENT
        />
      </div>
      <div
        ref={wrapRef}
        className="lifecycle-strip-inner relative z-[2] wrap r d2 mx-auto w-full max-w-[min(96vw,920px)] text-center font-medium leading-[1.03] tracking-[-0.03em] text-[#ffffff] [font-size:clamp(3.5rem,5.5vw,4.5rem)] lg:max-w-[min(100%,56rem)] lg:overflow-x-auto lg:pt-0 lg:pb-[clamp(3.2rem,9.6vh,6rem)] lg:font-normal lg:[font-size:clamp(1.75rem,2.75vw,2.25rem)]"
      >
        <p className="lifecycle-display block min-h-[1.15em]">
          {line1First.slice(0, n1a)}
          {n1a < line1First.length ? (
            <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-white/90 align-middle">
              &nbsp;
            </span>
          ) : null}
        </p>
        {line1Second ? (
          <p className="lifecycle-display mt-2 block min-h-[1.15em] lg:mt-4">
            {line1Second.slice(0, n1b)}
            {n1a >= line1First.length && n1b < line1Second.length ? (
              <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-white/90 align-middle">
                &nbsp;
              </span>
            ) : null}
          </p>
        ) : null}
        <p className="lifecycle-display mt-2 block min-h-[1.15em] lg:mt-8">
          {line2.slice(0, n2)}
          {line1AllDone && n2 < line2.length ? (
            <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-white/90 align-middle">
              &nbsp;
            </span>
          ) : null}
        </p>
        <p className="lifecycle-lede home-section-lede mx-auto mt-6 max-w-[min(100%,42rem)] text-center tracking-normal text-[#d4d4d8] lg:mt-10 lg:max-w-[min(100%,56rem)] lg:leading-[1.5625]">
          {line3.slice(0, n3)}
          {line1AllDone && n2 >= line2.length && n3 < line3.length ? (
            <span aria-hidden className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-[#d4d4d8]/90 align-middle">
              &nbsp;
            </span>
          ) : null}
        </p>
      </div>
    </section>
  );
}
