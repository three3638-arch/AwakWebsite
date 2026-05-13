import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'motion/react';

/**
 * 首页：位于「AI 伴身」模块下方；逐字显现，主文案使用规范最大 Display（约 56–72px）
 */
export default function HomeLifecycleStrip() {
  const { t } = useTranslation('common');
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.25 });

  const line1Raw = t('home.immersive.desktopCollage.line1');
  const line2 = t('home.immersive.desktopCollage.line2');

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

  const line1First = line1Lines[0] ?? '';
  const line1Second = line1Lines[1] ?? '';

  useEffect(() => {
    if (!inView) return;
    setN1a(0);
    setN1b(0);
    setN2(0);

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
        return afterLine1 < line2.length;
      }
      return false;
    };

    const id = window.setInterval(() => {
      if (!tick()) window.clearInterval(id);
    }, 32);

    return () => window.clearInterval(id);
  }, [inView, line1First, line1Second, line2]);

  const line1AllDone = line1Second
    ? n1a >= line1First.length && n1b >= line1Second.length
    : n1a >= line1First.length;

  return (
    <section className="relative z-[3] m-0 w-full border-0 bg-transparent px-6 py-16 md:px-8 md:py-24 lg:px-0 lg:py-[192px]">
      <div
        ref={wrapRef}
        className="wrap r d2 mx-auto max-w-[min(96vw,920px)] text-center font-medium leading-[1.03] tracking-[-0.03em] text-[#F5F5F5] [font-size:clamp(3.5rem,5.5vw,4.5rem)] lg:max-w-none lg:overflow-x-auto lg:[font-size:clamp(5.058rem,7.948vw,6.503rem)]"
      >
        <p className="block min-h-[1.15em]">
          {line1First.slice(0, n1a)}
          {n1a < line1First.length ? (
            <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-[#F5F5F5]/80 align-middle">
              &nbsp;
            </span>
          ) : null}
        </p>
        {line1Second ? (
          <p className="mt-2 block min-h-[1.15em] lg:mt-4">
            {line1Second.slice(0, n1b)}
            {n1a >= line1First.length && n1b < line1Second.length ? (
              <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-[#F5F5F5]/80 align-middle">
                &nbsp;
              </span>
            ) : null}
          </p>
        ) : null}
        <p className="mt-2 block min-h-[1.15em] lg:mt-8">
          {line2.slice(0, n2)}
          {line1AllDone && n2 < line2.length ? (
            <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-[#F5F5F5]/80 align-middle">
              &nbsp;
            </span>
          ) : null}
        </p>
      </div>
    </section>
  );
}
