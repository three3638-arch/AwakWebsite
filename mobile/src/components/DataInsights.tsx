import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type InsightItem = {
  title: string;
  valueHtml: React.ReactNode;
  kind: 'sleep' | 'sport' | 'fat' | 'heart' | 'meta' | 'goal';
};

/** Full-bleed backgrounds; charts sit in bottom 25% of card */
const KIND_BACKGROUNDS: Record<InsightItem['kind'], string> = {
  sleep:
    'https://i.ibb.co/B5tmTR92/Circular-Ring-2-Your-Personal-Health-Companion-Smart-Ring-3.jpg',
  sport: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
  fat: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
  heart: 'https://i.ibb.co/wFCQp2wk/image.png',
  meta: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
  goal: 'https://i.ibb.co/4gS1WHS4/51-Pinterest.jpg',
};

/** 数据洞察卡片背景图 URL，供首页预加载 */
export const DATA_INSIGHTS_IMAGE_URLS = Object.values(KIND_BACKGROUNDS);

const ITEMS: InsightItem[] = [
  {
    title: '睡眠恢复',
    valueHtml: (
      <>
        深睡时长 <b className="font-semibold">+18%</b>
      </>
    ),
    kind: 'sleep',
  },
  {
    title: '运动表现',
    valueHtml: (
      <>
        心肺能力 <b className="font-semibold">+15%</b>
      </>
    ),
    kind: 'sport',
  },
  {
    title: '体脂变化',
    valueHtml: (
      <>
        12周体脂率 <b className="font-semibold">-4.2%</b>
      </>
    ),
    kind: 'fat',
  },
  {
    title: '心率状态',
    valueHtml: <>静息心率恢复正常区间</>,
    kind: 'heart',
  },
  {
    title: '基础代谢',
    valueHtml: (
      <>
        每日代谢提升 <b className="font-semibold">+15%</b>
      </>
    ),
    kind: 'meta',
  },
  {
    title: '健康达标',
    valueHtml: (
      <>
        连续达标 <b className="font-semibold">88 天</b>
      </>
    ),
    kind: 'goal',
  },
];

/** Label shown above the chart inside the frosted bottom strip */
const CHART_STRIP_LABEL: Record<InsightItem['kind'], string> = {
  sleep: '睡眠分期',
  sport: '运动负荷',
  fat: '体脂走势',
  heart: '心率区间',
  meta: '代谢曲线',
  goal: '达标热力',
};

type TipState = { open: boolean; x: number; y: number; text: string };

function Tip({ tip }: { tip: TipState }) {
  return (
    <div
      className={[
        'absolute z-20 whitespace-nowrap rounded-[8px] bg-white/70 px-[9px] py-[4px] text-[11px] font-medium text-ink backdrop-blur-xl transition-opacity duration-150 border-none',
        tip.open ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      style={{ left: tip.x, top: tip.y, pointerEvents: 'none' }}
    >
      {tip.text}
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMinutesToHoursMinutes(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h${m}m`;
}

function HeartGauge({
  bpm,
  onHover,
  onLeave,
}: {
  bpm: number;
  onHover: (x: number, y: number, text: string) => void;
  onLeave: () => void;
}) {
  const ARC_MIN = 40;
  const ARC_MAX = 110;
  const RANGE = ARC_MAX - ARC_MIN;
  const START_DEG = 200;
  const TOTAL_DEG = 140;
  const R = 22;
  const STROKE = 5;
  const SVGW = 108;
  const SVGH = 44;
  const CX = SVGW / 2;
  const CY = SVGH - 6;

  const zones = [
    { min: 40, max: 60, col: 'rgba(0,0,0,0.18)', label: '偏低' },
    { min: 60, max: 70, col: 'rgba(0,0,0,0.32)', label: '正常' },
    { min: 70, max: 85, col: 'rgba(0,0,0,0.22)', label: '偏高' },
    { min: 85, max: 110, col: 'rgba(0,0,0,0.14)', label: '过高' },
  ];

  const valToDeg = (v: number) => START_DEG + ((v - ARC_MIN) / RANGE) * TOTAL_DEG;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const activeZone = zones.find((z) => bpm >= z.min && bpm < z.max) ?? zones[1];

  const deg = valToDeg(bpm);
  const nx = CX + R * Math.cos(toRad(deg));
  const ny = CY + R * Math.sin(toRad(deg));

  const onEnter = () => onHover(SVGW / 2, 10, `静息心率 ${bpm} bpm · ${activeZone.label}`);

  return (
    <div className="h-full w-full" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <svg viewBox={`0 0 ${SVGW} ${SVGH}`} width="100%" height="100%" aria-label="心率仪表盘" role="img">
        {zones.map((z) => {
          const d1 = valToDeg(z.min);
          const d2 = valToDeg(z.max);
          const x1 = CX + R * Math.cos(toRad(d1));
          const y1 = CY + R * Math.sin(toRad(d1));
          const x2 = CX + R * Math.cos(toRad(d2));
          const y2 = CY + R * Math.sin(toRad(d2));
          const large = d2 - d1 > 180 ? 1 : 0;
          const d = `M${x1.toFixed(2)} ${y1.toFixed(2)} A${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
          return (
            <path
              key={z.label}
              d={d}
              fill="none"
              stroke={z.col}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          );
        })}

        <circle cx={nx} cy={ny} r="3.5" fill="rgba(0,0,0,0.55)" stroke="#fff" strokeWidth="1.25" />
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#111">
          {bpm}
        </text>
        <text x={CX} y={CY + 2} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.32)">
          bpm
        </text>
      </svg>
    </div>
  );
}

function GoalHeatmap({
  weeks,
  days,
  streak,
  onHover,
  onLeave,
}: {
  weeks: number;
  days: number;
  streak: number;
  onHover: (x: number, y: number, text: string) => void;
  onLeave: () => void;
}) {
  const total = weeks * days;
  const missed = Math.max(0, total - streak);
  const cells = Array.from({ length: total }, (_, i) => {
    if (i < missed) return 0;
    const d = i - missed;
    if (d < streak * 0.15) return 1;
    if (d < streak * 0.5) return 2;
    return 3;
  });
  const GRAY = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.16)', 'rgba(0,0,0,0.30)', 'rgba(0,0,0,0.44)'];
  const EMPTY = 'rgba(0,0,0,0.07)';

  const W = 118;
  const H = 40;
  const PAD_X = 4;
  const PAD_Y = 2;
  const GAP = 1.5;
  const CW = Math.floor((W - 8) / weeks);
  const CH = Math.floor((H - 4) / days);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="健康达标热力图">
      {Array.from({ length: weeks }).map((_, w) =>
        Array.from({ length: days }).map((__, d) => {
          const idx = w * days + d;
          const lv = cells[idx] ?? 0;
          const x = PAD_X + w * (CW + GAP);
          const y = PAD_Y + d * (CH + GAP);
          const fill = lv === 0 ? EMPTY : GRAY[lv]!;
          const label = idx < missed ? '未达标' : `第 ${idx - missed + 1} 天 · 已达标`;
          return (
            <rect
              key={`${w}-${d}`}
              x={x}
              y={y}
              width={Math.max(1, CW - GAP)}
              height={Math.max(1, CH - GAP)}
              rx={2}
              fill={fill}
              onMouseEnter={() => onHover(x + (CW - GAP) / 2, y, label)}
              onMouseLeave={onLeave}
              style={{ cursor: 'pointer' }}
            />
          );
        }),
      )}
    </svg>
  );
}

export default function DataInsights() {
  const sleepData = useMemo(
    () =>
      [
        { d: '一', deep: 62, light: 120, rem: 48 },
        { d: '二', deep: 68, light: 115, rem: 52 },
        { d: '三', deep: 65, light: 118, rem: 50 },
        { d: '四', deep: 72, light: 110, rem: 55 },
        { d: '五', deep: 74, light: 108, rem: 54 },
        { d: '六', deep: 78, light: 104, rem: 58 },
        { d: '日', deep: 82, light: 100, rem: 60 },
      ].map((row) => ({ ...row, total: row.deep + row.light + row.rem })),
    [],
  );

  const sportData = useMemo(
    () => [
      { name: '游泳', v: 62, a: 0.52 },
      { name: 'HIIT', v: 70, a: 0.55 },
      { name: '跑步', v: 88, a: 1 },
    ],
    [],
  );

  const fatPoints = useMemo(() => {
    const fat = [23.4, 23.1, 22.8, 22.4, 22.1, 21.8, 21.5, 21.2, 20.9, 20.6, 20.3, 19.2];
    return fat.map((y, i) => ({ x: i + 1, y }));
  }, []);

  const metaData = useMemo(
    () => [
      { d: '一', v: 1580 },
      { d: '二', v: 1610 },
      { d: '三', v: 1620 },
      { d: '四', v: 1648 },
      { d: '五', v: 1670 },
      { d: '六', v: 1695 },
      { d: '日', v: 1720 },
    ],
    [],
  );

  return (
    <section className="overflow-hidden bg-[#F8F8F8] px-5 py-18 text-ink md:px-[170px] md:py-24">
      <div className="mb-5">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[26px] font-normal leading-[1.25] tracking-[-0.02em] text-ink"
        >
          看懂数据，身体开始改变
        </motion.h2>
        <p className="mt-3 max-w-[38rem] text-[14px] tracking-[-0.01em] text-black/45">
          通过可视化数据，直观看见身体变化。
        </p>
      </div>

      <InsightsCarousel
        sleepData={sleepData}
        sportData={sportData}
        fatPoints={fatPoints}
        metaData={metaData}
      />
    </section>
  );
}

function InsightsCarousel({
  sleepData,
  sportData,
  fatPoints,
  metaData,
}: {
  sleepData: Array<{ d: string; deep: number; light: number; rem: number; total: number }>;
  sportData: Array<{ name: string; v: number; a: number }>;
  fatPoints: Array<{ x: number; y: number }>;
  metaData: Array<{ d: string; v: number }>;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [tip, setTip] = useState<TipState>({ open: false, x: 0, y: 0, text: '' });

  const showTipAt = (cx: number, cy: number, text: string, cardW: number) => {
    const tw = Math.max(90, text.length * 6.2);
    const left = clamp(cx - tw / 2, 4, cardW - tw - 4);
    const top = Math.max(4, cy - 36);
    setTip({ open: true, x: left, y: top, text });
  };

  const scrollByCard = (direction: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-insight-card="true"]');
    const cardWidth = card?.offsetWidth ?? 320;
    const gap = 16;
    const delta = (cardWidth + gap) * (direction === 'next' ? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 pr-1"
        onMouseLeave={() => setTip((t) => ({ ...t, open: false }))}
      >
        {ITEMS.map((it, idx) => (
          <motion.article
            key={it.kind}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            data-insight-card="true"
            className="group relative w-[min(16.25rem,calc(100vw-5.5rem))] shrink-0 snap-start md:max-w-[280px]"
          >
            <div className="relative rounded-[12px] bg-black/5">
              <div className="relative aspect-[7/11.2] w-full overflow-visible">
                <div className="absolute inset-0 overflow-hidden rounded-[12px]">
                  <img
                    src={KIND_BACKGROUNDS[it.kind]}
                    alt=""
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/35"
                    aria-hidden
                  />
                </div>

                <div className="absolute left-0 top-0 z-[15] max-w-[min(92%,17rem)] p-6">
                  <h3 className="text-[17px] font-medium leading-[1.25] tracking-[-0.01em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                    {it.title}
                  </h3>
                  <div className="mt-1.5 text-[13px] leading-[1.45] text-white/92 [&_b]:font-semibold [&_b]:text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
                    {it.valueHtml}
                  </div>
                </div>

                <Tip tip={tip} />

                <div className="absolute bottom-3 left-0 right-0 z-[15] h-[30%] px-2 pt-1">
                  <div
                    className={[
                      'flex h-full w-full flex-col rounded-[10px]',
                      'bg-white/28 border-none',
                      'backdrop-blur-xl [backdrop-filter:blur(22px)] [WebkitBackdropFilter:blur(22px)]',
                    ].join(' ')}
                  >
                    <div className="shrink-0 px-2.5 pb-0.5 pt-2">
                      <p className="text-[11px] font-semibold tracking-wide text-ink/65">
                        {CHART_STRIP_LABEL[it.kind]}
                      </p>
                    </div>
                    <div className="min-h-0 min-w-0 flex-1 overflow-visible px-1.5 pb-2 pt-0.5">
                  {it.kind === 'sleep' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sleepData}
                        margin={{ top: 6, right: 4, left: 4, bottom: 10 }}
                        onMouseMove={(st: any) => {
                          if (!st?.isTooltipActive || !st?.activeLabel) return;
                          const i = sleepData.findIndex((r) => r.d === st.activeLabel);
                          if (i < 0) return;
                          const tot = sleepData[i]!.deep + sleepData[i]!.light + sleepData[i]!.rem;
                          const text = `总 ${formatMinutesToHoursMinutes(tot)} · 深睡 ${sleepData[i]!.deep}min`;
                          showTipAt(st.chartX ?? 80, st.chartY ?? 18, text, 330);
                        }}
                      >
                        <Tooltip active={false} />
                        <XAxis dataKey="d" hide />
                        <YAxis hide />
                        <Bar dataKey="deep" stackId="s" fill="rgba(0,0,0,0.55)" radius={[2, 2, 0, 0]} isAnimationActive />
                        <Bar dataKey="light" stackId="s" fill="rgba(0,0,0,0.26)" isAnimationActive />
                        <Bar dataKey="rem" stackId="s" fill="rgba(0,0,0,0.12)" radius={[0, 0, 2, 2]} isAnimationActive>
                          <LabelList
                            dataKey="total"
                            position="top"
                            fill="rgba(0,0,0,0.72)"
                            fontSize={8}
                            formatter={(v: number | string) => `${v}`}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {it.kind === 'sport' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sportData}
                        layout="vertical"
                        margin={{ top: 2, right: 14, left: 0, bottom: 2 }}
                        onMouseMove={(st: any) => {
                          if (!st?.isTooltipActive || !st?.activePayload?.length) return;
                          const p = st.activePayload[0]?.payload as { name: string; v: number } | undefined;
                          if (!p) return;
                          showTipAt(st.chartX ?? 90, st.chartY ?? 18, `${p.name}  ${p.v} / 100`, 330);
                        }}
                      >
                        <Tooltip active={false} />
                        <XAxis type="number" domain={[0, 110]} hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 8 }}
                          width={30}
                          tickMargin={0}
                        />
                        <Bar dataKey="v" radius={2} barSize={5} isAnimationActive>
                          <LabelList
                            dataKey="v"
                            position="right"
                            fill="rgba(0,0,0,0.62)"
                            fontSize={8}
                            formatter={(v: number | string) => `${v}`}
                          />
                          {sportData.map((d) => (
                            <Cell key={d.name} fill={`rgba(0,0,0,${Math.max(0.18, Math.min(d.a * 0.55, 0.55))})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {it.kind === 'fat' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 10, right: 6, left: 6, bottom: 10 }}
                        onMouseMove={(st: any) => {
                          if (!st?.isTooltipActive || !st?.activePayload?.length) return;
                          const p = st.activePayload[0]?.payload as { x: number; y: number } | undefined;
                          if (!p) return;
                          showTipAt(st.chartX ?? 90, st.chartY ?? 18, `第 ${Math.round(p.x)} 周  ${p.y.toFixed(1)} %`, 330);
                        }}
                      >
                        <Tooltip active={false} />
                        <XAxis type="number" dataKey="x" hide domain={[0.5, 12.5]} />
                        <YAxis type="number" dataKey="y" hide domain={[18.5, 24.2]} />
                        <ReferenceLine
                          segment={[
                            { x: 1, y: 23.4 },
                            { x: 12, y: 19.2 },
                          ]}
                          stroke="rgba(0,0,0,0.35)"
                          strokeWidth={1}
                          strokeDasharray="4 3"
                        />
                        <Scatter data={fatPoints} fill="rgba(0,0,0,0.55)">
                          <LabelList
                            content={(props: {
                              x?: number;
                              y?: number;
                              value?: number;
                              index?: number;
                            }) => {
                              const { x, y, value, index } = props;
                              if (
                                x == null ||
                                y == null ||
                                value == null ||
                                index == null ||
                                (index % 2 !== 0 && index !== fatPoints.length - 1)
                              ) {
                                return null;
                              }
                              return (
                                <text
                                  x={x}
                                  y={y - 10}
                                  fill="rgba(0,0,0,0.58)"
                                  fontSize={7}
                                  textAnchor="middle"
                                >
                                  {Number(value).toFixed(1)}
                                </text>
                              );
                            }}
                          />
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  )}

                  {it.kind === 'heart' && (
                    <HeartGauge
                      bpm={65}
                      onHover={(cx, cy, text) => showTipAt(cx, cy, text, 330)}
                      onLeave={() => setTip((t) => ({ ...t, open: false }))}
                    />
                  )}

                  {it.kind === 'meta' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={metaData}
                        margin={{ top: 10, right: 6, left: 6, bottom: 10 }}
                        onMouseMove={(st: any) => {
                          if (!st?.isTooltipActive || !st?.activeLabel) return;
                          const row = metaData.find((r) => r.d === st.activeLabel);
                          if (!row) return;
                          showTipAt(st.chartX ?? 90, st.chartY ?? 18, `周${row.d}  ${row.v.toLocaleString()} kcal`, 330);
                        }}
                      >
                        <Tooltip active={false} />
                        <CartesianGrid vertical={false} stroke="transparent" />
                        <XAxis
                          dataKey="d"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'rgba(0,0,0,0.35)', fontSize: 8 }}
                        />
                        <YAxis hide domain={[1520, 'dataMax']} />
                        <Bar dataKey="v" radius={2} barSize={8} isAnimationActive>
                          <LabelList
                            dataKey="v"
                            position="top"
                            fill="rgba(0,0,0,0.62)"
                            fontSize={8}
                            formatter={(v: number | string) => `${v}`}
                          />
                          {metaData.map((row, i) => {
                            const isLast = i === metaData.length - 1;
                            const a = 0.18 + i * 0.07;
                            const fill = isLast ? 'rgba(0,0,0,0.55)' : `rgba(0,0,0,${a.toFixed(2)})`;
                            return <Cell key={row.d} fill={fill} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {it.kind === 'goal' && (
                    <div className="relative h-full w-full">
                      <GoalHeatmap
                        weeks={12}
                        days={7}
                        streak={88}
                        onHover={(cx, cy, text) => showTipAt(cx, cy, text, 330)}
                        onLeave={() => setTip((t) => ({ ...t, open: false }))}
                      />
                      <div className="pointer-events-none absolute right-1 top-0 text-[10px] font-semibold tabular-nums text-ink/65">
                        88 天
                      </div>
                    </div>
                  )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard('prev')}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-ink/70 backdrop-blur-xl transition hover:bg-white/85 hover:text-ink border-none"
          style={{ WebkitBackdropFilter: 'blur(14px)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M14.5 5L7.5 12L14.5 19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard('next')}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-ink/70 backdrop-blur-xl transition hover:bg-white/85 hover:text-ink border-none"
          style={{ WebkitBackdropFilter: 'blur(14px)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9.5 5L16.5 12L9.5 19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
