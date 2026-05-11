import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useTranslation } from 'react-i18next';

export type HomeHeroGlassProductId = 'ring' | 'band' | 'watch' | 'glasses';

/** 与参考 HTML 一致：毛玻璃、圆角 20px、右下角 */
const GLASS_SHELL =
  'pointer-events-none absolute bottom-16 right-3 z-[5] rounded-[20px] border border-white/[0.38] bg-white/[0.18] p-4 text-white shadow-lg [backdrop-filter:blur(22px)_saturate(1.4)] [WebkitBackdropFilter:blur(22px)_saturate(1.4)] transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:bottom-20 md:right-4';

const WIDTH: Record<'audio' | 'sleep' | 'ecg' | 'sport', string> = {
  audio: 'w-[min(180px,calc(100%-1.25rem))]',
  sleep: 'w-[min(190px,calc(100%-1.25rem))]',
  ecg: 'w-[min(186px,calc(100%-1.25rem))]',
  sport: 'w-[min(188px,calc(100%-1.25rem))]',
};

function useCountUp(target: number, enabled: boolean, durationMs: number, formatter?: (n: number) => string) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setDisplay(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const ease = 1 - (1 - p) ** 3;
      setDisplay((target - 0) * ease);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, target, durationMs]);
  const n = display;
  return formatter ? formatter(n) : Math.round(n).toString();
}

function panelKind(id: HomeHeroGlassProductId): keyof typeof WIDTH {
  if (id === 'glasses') return 'audio';
  if (id === 'ring') return 'sleep';
  if (id === 'band') return 'ecg';
  return 'sport';
}

function GlassAudio({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation('common');
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const heights = useMemo(
    () => [40, 55, 70, 80, 85, 82, 78, 72, 75, 80, 78, 70, 62, 55, 50, 45, 40, 35],
    [],
  );
  const hz = useCountUp(250, enabled, 1200);
  const dev = useCountUp(4, enabled, 800);
  const noise = useCountUp(-32, enabled, 1000, (v) => `${Math.round(v)}`);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root || !enabled) return;
    root.innerHTML = '';
    const bars: { el: HTMLDivElement; min: number; max: number }[] = [];
    for (let i = 0; i < heights.length; i++) {
      const h = heights[i]!;
      const b = document.createElement('div');
      b.className = 'min-h-[2px] flex-1 origin-bottom rounded-t-[2px] bg-white/60';
      const min = Math.max(0.15, (h / 100) * 0.4);
      const max = h / 100;
      b.style.height = '100%';
      b.style.transform = `scaleY(${min})`;
      b.style.opacity = String(0.3 + (h / 100) * 0.7);
      root.appendChild(b);
      bars.push({ el: b, min, max });
    }
    bars.forEach((bar, i) => {
      window.setTimeout(() => {
        bar.el.style.transform = `scaleY(${bar.max})`;
        bar.el.style.transition = `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`;
      }, 200 + i * 30);
    });
    const anim = () => {
      const tt = Date.now() / 1000;
      bars.forEach((bar, i) => {
        const wave = 0.5 + 0.5 * Math.sin(tt * 2.1 + i * 0.45);
        const val = bar.min + (bar.max - bar.min) * (0.4 + wave * 0.6);
        bar.el.style.transform = `scaleY(${val.toFixed(3)})`;
        bar.el.style.transition = 'transform 0.18s ease';
      });
      rafRef.current = requestAnimationFrame(anim);
    };
    const t0 = window.setTimeout(anim, 1000);
    return () => {
      clearTimeout(t0);
      cancelAnimationFrame(rafRef.current);
      root.innerHTML = '';
    };
  }, [enabled, heights]);

  return (
    <>
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">
        {t('home.heroGlass.audio.label')}
      </span>
      <div ref={wrapRef} className="mb-3 flex h-10 items-end gap-[3px]" />
      <div className="mt-2.5 flex justify-between text-center">
        <div>
          <div className="text-lg font-extrabold tracking-[-0.04em] text-white">{hz}</div>
          <div className="text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.audio.colHz')}</div>
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-[-0.04em] text-white">{dev}</div>
          <div className="text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.audio.colDev')}</div>
        </div>
        <div>
          <div className="text-lg font-extrabold tracking-[-0.04em] text-white">{noise}</div>
          <div className="text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.audio.colNoise')}</div>
        </div>
      </div>
      <div className="my-2.5 h-px bg-white/[0.18]" />
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white/85">
        <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-white" />
        {t('home.heroGlass.audio.badge')}
      </div>
    </>
  );
}

function GlassSleep({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation('common');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deep = useCountUp(28, enabled, 1200);
  const score = useCountUp(91, enabled, 1000);
  const hrv = useCountUp(58, enabled, 900);
  const wake = useCountUp(1, enabled, 600);

  useEffect(() => {
    if (!enabled) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width;
    const H = cv.height;
    const stages = [0, 2, 3, 3, 2, 3, 3, 2, 1, 2, 3, 2, 1, 2, 1, 2, 2, 1, 2, 1, 0];
    const yMap: Record<number, number> = { 0: H * 0.05, 1: H * 0.32, 2: H * 0.62, 3: H * 0.92 };
    let drawn = 0;
    const segW = W / (stages.length - 1);
    const timers: number[] = [];
    const drawStep = () => {
      if (drawn >= stages.length - 1) return;
      const x1 = drawn * segW;
      const y1 = yMap[stages[drawn]!]!;
      const x2 = (drawn + 1) * segW;
      const y2 = yMap[stages[drawn + 1]!]!;
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, 'rgba(255,255,255,0.12)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x1, y1, segW, H - y1);
      drawn++;
      timers.push(window.setTimeout(drawStep, 55));
    };
    ctx.clearRect(0, 0, W, H);
    drawStep();
    return () => {
      for (const tid of timers) window.clearTimeout(tid);
    };
  }, [enabled]);

  return (
    <>
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">
        {t('home.heroGlass.sleep.label')}
      </span>
      <div className="relative my-1 h-12 w-full">
        <canvas ref={canvasRef} width={160} height={48} className="h-full w-full" />
      </div>
      <div className="mt-0.5 flex justify-between text-[9px] text-white/40">
        <span>23:00</span>
        <span>02:00</span>
        <span>05:00</span>
        <span>07:00</span>
      </div>
      <div className="my-2.5 h-px bg-white/[0.18]" />
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-[10px] bg-white/12 px-2.5 py-2">
          <div className="text-base font-extrabold tracking-tight text-white">{deep}%</div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sleep.deep')}</div>
        </div>
        <div className="rounded-[10px] bg-white/12 px-2.5 py-2">
          <div className="text-base font-extrabold tracking-tight text-white">{score}</div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sleep.score')}</div>
        </div>
        <div className="rounded-[10px] bg-white/12 px-2.5 py-2">
          <div className="text-base font-extrabold tracking-tight text-white">{hrv}</div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sleep.hrv')}</div>
        </div>
        <div className="rounded-[10px] bg-white/12 px-2.5 py-2">
          <div className="text-base font-extrabold tracking-tight text-white">{wake}</div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sleep.wake')}</div>
        </div>
      </div>
    </>
  );
}

function ecgY(t: number) {
  const phase = ((t % 1) + 1) % 1;
  if (phase < 0.07) return 0.5;
  if (phase < 0.14) return 0.5 - phase * 0.3;
  if (phase < 0.2) return 0.5 - 0.02;
  if (phase < 0.27) return 0.8;
  if (phase < 0.3) return -0.4;
  if (phase < 0.35) return 0.7;
  if (phase < 0.44) return 0.5;
  if (phase < 0.52) return 0.4;
  if (phase < 0.6) return 0.5;
  return 0.5;
}

function GlassEcg({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation('common');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);
  const bpm = useCountUp(72, enabled, 900);
  const spo2 = useCountUp(98, enabled, 1000);

  const drawECG = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width;
    const H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < H; y += H / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.82)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const tt = (px / W) * 2.5 + offsetRef.current;
      const y = ecgY(tt) * H;
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,255,255,0.10)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const tt = (px / W) * 2.5 + offsetRef.current;
      const y = ecgY(tt) * H;
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    const scanX = ((Date.now() % 1200) / 1200) * W;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(scanX, 0);
    ctx.lineTo(scanX, H);
    ctx.stroke();
    offsetRef.current += 0.008;
    rafRef.current = requestAnimationFrame(drawECG);
  }, []);

  useEffect(() => {
    if (!enabled) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    drawECG();
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, drawECG]);

  return (
    <>
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">
        {t('home.heroGlass.ecg.label')}
      </span>
      <div className="relative mb-2.5 h-12 overflow-hidden border-b border-white/15">
        <canvas ref={canvasRef} width={160} height={48} className="h-full w-full" />
      </div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <div>
          <span className="text-[30px] font-extrabold leading-none tracking-[-0.05em] text-white">{bpm}</span>
          <span className="text-xs font-medium text-white/65"> bpm</span>
        </div>
        <div>
          <span className="text-[13px] font-bold text-white">{spo2}</span>
          <span className="text-xs font-medium text-white/65">% SpO₂</span>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 text-[11px] text-white/80">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/25">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          {t('home.heroGlass.ecg.alert1')}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 text-[11px] text-white/80">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/25">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          {t('home.heroGlass.ecg.alert2')}
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-2 py-1.5 text-[11px] text-white/80">
          <span className="flex h-4 w-4 shrink-0 animate-pulse items-center justify-center rounded-full bg-white/25">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" aria-hidden>
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          {t('home.heroGlass.ecg.alert3')}
        </div>
      </div>
    </>
  );
}

function GlassSport({ enabled }: { enabled: boolean }) {
  const { t } = useTranslation('common');
  const ring1Ref = useRef<SVGCircleElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);
  const dist = useCountUp(84, enabled, 1200, (n) => (n / 10).toFixed(1));

  useEffect(() => {
    if (!enabled) return;
    const tmr = window.setTimeout(() => {
      const C1 = 264;
      const C2 = 195;
      const C3 = 126;
      const r1 = ring1Ref.current;
      const r2 = ring2Ref.current;
      const r3 = ring3Ref.current;
      if (r1) {
        r1.style.strokeDashoffset = String(C1 * (1 - 0.82));
        r1.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)';
      }
      if (r2) {
        r2.style.strokeDashoffset = String(C2 * (1 - 0.75));
        r2.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.15s';
      }
      if (r3) {
        r3.style.strokeDashoffset = String(C3 * (1 - 0.9));
        r3.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s';
      }
    }, 200);
    return () => clearTimeout(tmr);
  }, [enabled]);

  return (
    <>
      <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">
        {t('home.heroGlass.sport.label')}
      </span>
      <div className="relative mx-auto my-1 flex h-20 w-full items-center justify-center">
        <svg viewBox="0 0 140 110" width={160} height={110} className="h-full w-auto max-h-[5.5rem]" aria-hidden>
          <circle className="fill-none stroke-white/15" cx="70" cy="55" r="42" strokeWidth="7" strokeLinecap="round" />
          <circle
            ref={ring1Ref}
            className="fill-none stroke-white/75"
            cx="70"
            cy="55"
            r="42"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={264}
            strokeDashoffset={264}
            transform="rotate(-90 70 55)"
          />
          <circle className="fill-none stroke-white/15" cx="70" cy="55" r="31" strokeWidth="7" strokeLinecap="round" />
          <circle
            ref={ring2Ref}
            className="fill-none stroke-white/55"
            cx="70"
            cy="55"
            r="31"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={195}
            strokeDashoffset={195}
            transform="rotate(-90 70 55)"
          />
          <circle className="fill-none stroke-white/15" cx="70" cy="55" r="20" strokeWidth="7" strokeLinecap="round" />
          <circle
            ref={ring3Ref}
            className="fill-none stroke-white/35"
            cx="70"
            cy="55"
            r="20"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={126}
            strokeDashoffset={126}
            transform="rotate(-90 70 55)"
          />
          <text x="70" y="50" textAnchor="middle" fontSize="14" fontWeight="800" fill="white" className="font-sans">
            538
          </text>
          <text x="70" y="62" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)" className="font-sans" letterSpacing="0.06em">
            KCAL
          </text>
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-lg bg-white/12 px-1.5 py-1.5">
          <div className="text-sm font-extrabold tracking-tight text-white">5&apos;12&quot;</div>
          <div className="mt-0.5 text-[8px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sport.pace')}</div>
        </div>
        <div className="rounded-lg bg-white/12 px-1.5 py-1.5">
          <div className="text-sm font-extrabold tracking-tight text-white">Z4</div>
          <div className="mt-0.5 text-[8px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sport.zone')}</div>
        </div>
        <div className="rounded-lg bg-white/12 px-1.5 py-1.5">
          <div className="text-sm font-extrabold tracking-tight text-white">{dist}</div>
          <div className="mt-0.5 text-[8px] uppercase tracking-wide text-white/50">{t('home.heroGlass.sport.km')}</div>
        </div>
      </div>
    </>
  );
}

export default function HomeHeroGlassPanel({ productId }: { productId: HomeHeroGlassProductId }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { amount: 0.28, once: false });
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (isInView) setActivated(true);
  }, [isInView]);

  const kind = panelKind(productId);
  const show = activated && isInView;

  return (
    <div
      ref={rootRef}
      className={`${GLASS_SHELL} ${WIDTH[kind]} ${
        show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.97] opacity-0'
      }`}
    >
      {kind === 'audio' && <GlassAudio enabled={show} />}
      {kind === 'sleep' && <GlassSleep enabled={show} />}
      {kind === 'ecg' && <GlassEcg enabled={show} />}
      {kind === 'sport' && <GlassSport enabled={show} />}
    </div>
  );
}
