import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

// “智能硬件的场景”左侧按钮顺序（含对应内容/图片）
const PRODUCT_IDS = ['ring', 'band', 'glasses', 'watch'] as const;

const FEATURE_IMAGES: Record<(typeof PRODUCT_IDS)[number], string[]> = {
  ring: [
    'https://i.ibb.co/TDY245bK/image.png',
    'https://i.ibb.co/xKgfc5rN/Oura.jpg',
    'https://i.ibb.co/MkPGBT9k/Oura.jpg',
    'https://i.ibb.co/fYmtwXGT/p12-2.jpg',
    'https://i.ibb.co/cKjxbXng/image.png',
    'https://i.ibb.co/9m2JVLrV/p12-2.jpg',
  ],
  band: [
    'https://i.ibb.co/whtz0KFz/The-Best-Ways-To-Prevent-Falling-In-Your-Home-Health-Digest.jpg',
    'https://i.ibb.co/d4VkCTvf/10-Pains-You-Should-Never-Ever-Ignore.jpg',
    'https://i.ibb.co/7dw6GWmS/Olive-Stress-Management-Bracelet-by-Hardy-Simes.jpg',
    'https://i.ibb.co/hxQb6mB2/jimeng-2026-04-20-5496-logo.png',
    'https://i.ibb.co/zTJpVzSv/image.png',
    'https://i.ibb.co/99yZStWr/image.png',
  ],
  glasses: [
    'https://i.ibb.co/fGyWsKLp/image.png',
    'https://i.ibb.co/Xrkc6FL9/XRAI-AR2-The-Original-Captioning-Glasses-Redesigned.jpg',
    'https://i.ibb.co/39b8QJZW/jimeng-2026-04-03-6916.png',
    'https://i.ibb.co/bn5r2Hm/jimeng-2026-04-23-1745-1.png',
    'https://i.ibb.co/Y4sjjjMg/jimeng-2026-04-23-1426.png',
    'https://i.ibb.co/TxfjjQ91/jimeng-2026-04-23-5862-1.png',
  ],
  watch: [
    'https://i.ibb.co/1fyLt5S6/jimeng-2026-04-03-6305.png',
    'https://i.ibb.co/ynTmxzW7/image.png',
    'https://i.ibb.co/yFD7J0BZ/image.png',
    'https://i.ibb.co/HDfCRBt8/jimeng-2026-04-20-7301-1.png',
    'https://i.ibb.co/DDk1xWyM/image.png',
    'https://i.ibb.co/vx1DpGTL/jimeng-2026-04-22-7846.png',
  ],
};

/** PC ≥1024px：12×10 网格线坐标 [rowStart, colStart, rowEnd, colEnd)，20 张不规则卡片 + 8px 间距由外层 grid gap-2 实现 */
const LG_MASONRY_PLACEMENTS: [number, number, number, number][] = [
  [5, 3, 8, 5],
  [3, 5, 7, 9],
  [7, 8, 9, 12],
  [1, 1, 5, 5],
  [1, 10, 5, 13],
  [7, 6, 11, 8],
  [8, 1, 11, 4],
  [8, 4, 10, 6],
  [9, 12, 11, 13],
  [1, 6, 3, 10],
  [5, 9, 7, 13],
  [9, 8, 11, 12],
  [6, 2, 8, 3],
  [5, 1, 6, 2],
  [10, 4, 11, 6],
  [7, 12, 9, 13],
  [4, 9, 5, 10],
  [3, 9, 4, 10],
  [6, 1, 7, 2],
  [1, 5, 3, 6],
];

const LARGE_TILE_INDEXES = new Set(
  LG_MASONRY_PLACEMENTS.map((placement, idx) => {
    const [r1, c1, r2, c2] = placement;
    return { idx, cells: (r2 - r1) * (c2 - c1) };
  })
    .sort((a, b) => b.cells - a.cells || a.idx - b.idx)
    .slice(0, 6)
    .map((item) => item.idx),
);

function buildDesktopCollageItems(t: TFunction): { src: string; title: string; desc: string }[] {
  const out: { src: string; title: string; desc: string }[] = [];
  for (const id of PRODUCT_IDS) {
    const featTexts = t(`home.immersive.products.${id}.features`, { returnObjects: true }) as {
      title: string;
      desc: string;
    }[];
    const imgs = FEATURE_IMAGES[id];
    for (let i = 0; i < featTexts.length; i++) {
      out.push({
        src: imgs[i] ?? '',
        title: featTexts[i]?.title ?? '',
        desc: featTexts[i]?.desc ?? '',
      });
    }
  }
  return out.slice(0, 20);
}

/** 四种占位规格档（由网格单元格数量划分），用于叠字层级 */
function placementTier(pl: [number, number, number, number]): 0 | 1 | 2 | 3 {
  const [r1, c1, r2, c2] = pl;
  const cells = (r2 - r1) * (c2 - c1);
  if (cells >= 15) return 0;
  if (cells >= 10) return 1;
  if (cells >= 6) return 2;
  return 3;
}

function buildScenarioInsight(title: string, desc: string, index: number) {
  const safeTitle = title || '智能硬件场景';
  return {
    summary: `${safeTitle}会把硬件采集到的身体状态、环境变化和行为节奏整合成一条连续的健康线索，让用户在真实生活场景里更快理解风险、恢复和行动建议。`,
    detail: desc
      ? `${desc} 系统会在后台同步分析心率、睡眠、运动、位置与异常事件，并把关键提醒压缩成可以马上执行的建议。`
      : '系统会在后台同步分析心率、睡眠、运动、位置与异常事件，并把关键提醒压缩成可以马上执行的建议。',
    metrics: [
      { label: '响应速度', value: index % 2 === 0 ? '<3s' : '<5s' },
      { label: '数据维度', value: `${6 + (index % 4)}项` },
      { label: '场景覆盖', value: index % 3 === 0 ? '全天候' : '高频' },
    ],
  };
}

export default function ImmersiveScenarios() {
  const { t } = useTranslation('common');
  const productsData = useMemo(() => {
    return PRODUCT_IDS.map((id) => {
      const featTexts = t(`home.immersive.products.${id}.features`, { returnObjects: true }) as {
        title: string;
        desc: string;
      }[];
      const imgs = FEATURE_IMAGES[id];
      return {
        id,
        name: t(`home.immersive.products.${id}.name`),
        features: featTexts.map((f, i) => ({ ...f, img: imgs[i] ?? '' })),
      };
    });
  }, [t]);

  const [activeProductId, setActiveProductId] = useState<(typeof PRODUCT_IDS)[number]>(PRODUCT_IDS[0]);
  const [selectedScenario, setSelectedScenario] = useState<{
    index: number;
    title: string;
    desc: string;
    src: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const activeProductData =
    productsData.find((p) => p.id === activeProductId) ?? productsData[0];

  const desktopCollageItems = useMemo(() => buildDesktopCollageItems(t), [t]);
  const selectedInsight = selectedScenario
    ? buildScenarioInsight(selectedScenario.title, selectedScenario.desc, selectedScenario.index)
    : null;

  return (
    <>
      <section
        ref={containerRef}
        className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-black pb-16 pt-2 font-sans lg:hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute bottom-0 left-0 top-0 z-[40] flex w-[300px] flex-col justify-center pl-[170px]"
        >
          <div
            className="absolute inset-y-0 left-0 z-[-1] w-[500px]"
            style={{
              background:
                'linear-gradient(to right, #000000 0%, rgba(0, 0, 0, 0.82) 38%, rgba(0, 0, 0, 0.35) 62%, transparent 100%)',
            }}
          />

          <div className="pointer-events-auto relative flex flex-col gap-10">
            {productsData.map((product) => {
              const isActive = activeProductId === product.id;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setActiveProductId(product.id)}
                  className={`group relative w-fit text-left transition-all duration-300 ${
                    isActive ? 'text-[#F5F5F5]' : 'text-[#A7A7B2] hover:text-[#F5F5F5]'
                  }`}
                >
                  <span className="block text-[20px] font-medium uppercase leading-none tracking-tight">
                    {product.name}
                  </span>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeUnderlineSide"
                        className="absolute -left-6 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-[#DDF700]"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="group relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProductId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              ref={scrollRef}
              className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-10 pl-6 pr-6 md:pl-[168px] md:pr-6"
            >
              {activeProductData.features.map((feature, idx: number) => {
                const widthClass = idx === 0 ? 'w-[65vw]' : 'w-[30vw]';

                return (
                  <div
                    key={idx}
                    className={`group/item relative aspect-[16/10] flex-shrink-0 snap-start overflow-hidden rounded-[12px] bg-[#09090b] ${widthClass}`}
                  >
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[2s] group-hover/item:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.38) 35%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0) 100%)',
                      }}
                    />

                    <div className={`absolute bottom-10 z-20 ${idx === 0 ? 'right-10 text-right' : 'left-10'}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="mb-3 font-medium leading-[1.15] tracking-[-0.02em] text-[#F5F5F5] [font-size:clamp(1.75rem,2.2vw,2rem)]">
                          {feature.title}
                        </h3>
                        <p
                          className={`max-w-[350px] text-[15px] font-normal leading-[1.5] text-[#A7A7B2] md:text-[16px] ${
                            idx === 0 ? 'ml-auto' : ''
                          }`}
                        >
                          {feature.desc}
                        </p>
                      </motion.div>
                    </div>

                    <div className="absolute right-8 top-8 font-mono text-[10px] uppercase tracking-widest text-white/20">
                      SCENARIO.0{idx + 1}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .snap-x {
            scroll-behavior: smooth;
          }
        `}</style>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-[170px] top-0 z-[45] w-[1px] bg-black/5" />
      </section>

      {/* PC ≥1024px：20 张不规则拼贴 + 顶黑/底白多段渐变 + 大图叠字 + 左右交错进场 */}
      <section
        id="immersive-desktop"
        className="relative z-[3] hidden h-[100dvh] max-h-[100vh] w-full overflow-hidden bg-black text-white lg:block"
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-[40] h-[26%] min-h-[120px]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 12%, rgba(0,0,0,0.42) 30%, rgba(0,0,0,0.18) 52%, rgba(0,0,0,0.06) 74%, rgba(0,0,0,0.015) 90%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[40] h-[28%] min-h-[120px]"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.72) 18%, rgba(0,0,0,0.34) 48%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden
        />

        <div className="home-immersive-frame absolute inset-0 z-10 box-border p-2 lg:p-0">
          <div
            className="home-immersive-masonry grid h-full w-full gap-[4px]"
            style={{
              gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
            }}
          >
            {desktopCollageItems.map((item, idx) => {
              const placement = LG_MASONRY_PLACEMENTS[idx] ?? [1, 1, 2, 2];
              const [r1, c1, r2, c2] = placement;
              const tier = placementTier(placement);
              const cells = (r2 - r1) * (c2 - c1);
              const showOverlay = tier <= 2 && cells >= 6;
              const showDesc = tier <= 1 && cells >= 10 && item.title.trim().length > 0;
              const isLargeInteractiveTile = LARGE_TILE_INDEXES.has(idx);

              const titleClass =
                'home-immersive-tile-title text-[clamp(12px,1.05vw,16px)] font-medium leading-snug tracking-[-0.01em]';
              const descClass = 'mt-1 line-clamp-2 text-[11px] font-normal leading-relaxed text-white/85';

              const fromLeft = idx % 2 === 0;
              const staggerDelay = idx * 0.065;
              const dur = 1.05 + idx * 0.012;

              return (
                <motion.article
                  key={`collage-${idx}-${item.src}`}
                  className="home-shadow-allow group/tile relative min-h-0 overflow-hidden rounded-[8px] bg-neutral-900/40 shadow-[0_28px_72px_rgba(0,0,0,0.45)] backdrop-blur-[2px] transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_32px_72px_rgba(0,0,0,0.5)]"
                  style={{
                    gridRow: `${r1} / ${r2}`,
                    gridColumn: `${c1} / ${c2}`,
                  }}
                  initial={{
                    opacity: 0,
                    x: fromLeft ? '-14%' : '14%',
                    filter: 'blur(10px)',
                  }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    delay: staggerDelay,
                    duration: dur,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, rotate: fromLeft ? 0.35 : -0.35 }}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[1.85s] ease-out group-hover/tile:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  {showOverlay ? (
                    <div
                      className="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-end bg-gradient-to-t from-black/88 via-black/45 to-transparent p-2 md:p-3"
                      aria-hidden={!item.title}
                    >
                      {item.title ? (
                        <p className={`text-white ${titleClass}`}>{item.title}</p>
                      ) : null}
                      {showDesc && item.desc ? <p className={descClass}>{item.desc}</p> : null}
                    </div>
                  ) : null}

                  {isLargeInteractiveTile ? (
                    <div className="group/control absolute bottom-4 right-4 z-[5]">
                      <button
                        type="button"
                        aria-label={`查看${item.title || `场景 ${idx + 1}`}介绍`}
                        onClick={() => setSelectedScenario({ index: idx, title: item.title, desc: item.desc, src: item.src })}
                        className="home-shadow-allow flex h-8 w-8 items-center justify-center rounded-full bg-white text-[18px] font-light leading-none text-black shadow-[0_14px_32px_rgba(0,0,0,0.32)] transition-all duration-300 hover:scale-105 hover:bg-[#DDF700] hover:text-black"
                      >
                        +
                      </button>

                      <div className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 w-[230px] translate-y-2 rounded-[16px] border border-white/20 bg-white/[0.08] p-4 text-left opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 group-hover/control:translate-y-0 group-hover/control:opacity-100">
                        <div className="mb-3 flex items-center justify-between pb-2">
                          <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">DATA</span>
                          <span className="font-mono text-[10px] text-[#DDF700]">0{idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-[52px_1fr] gap-x-3 gap-y-2 text-[11px] leading-relaxed">
                          <span className="text-white/42">场景</span>
                          <span className="line-clamp-1 text-white/90">{item.title || '智能硬件场景'}</span>
                          <span className="text-white/42">说明</span>
                          <span className="line-clamp-3 text-white/72">{item.desc || '点击查看完整介绍'}</span>
                          <span className="text-white/42">状态</span>
                          <span className="text-[#DDF700]">可查看</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedScenario && selectedInsight ? (
            <motion.div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/68 px-6 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScenario(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={selectedScenario.title || '场景介绍'}
                className="home-shadow-allow relative grid w-full max-w-[1080px] overflow-hidden rounded-[32px] bg-[#080809] shadow-[0_44px_140px_rgba(0,0,0,0.62)] md:grid-cols-[1fr_1.18fr]"
                initial={{ y: 34, scale: 0.96, opacity: 0, filter: 'blur(12px)' }}
                animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: 18, scale: 0.98, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative min-h-[520px] overflow-hidden">
                  <img
                    src={selectedScenario.src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>

                <div className="relative flex min-h-[520px] flex-col justify-center p-8 md:p-12">
                  <button
                    type="button"
                    aria-label="关闭场景介绍"
                    onClick={() => setSelectedScenario(null)}
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-[22px] font-light text-white/80 transition-colors duration-300 hover:bg-white/14 hover:text-white"
                  >
                    ×
                  </button>
                  <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#DDF700]">
                    Scenario.0{selectedScenario.index + 1}
                  </div>
                  <h3 className="max-w-[420px] text-[clamp(2rem,3vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
                    {selectedScenario.title || '智能硬件应用场景'}
                  </h3>
                  <p className="mt-6 max-w-[560px] text-[16px] font-normal leading-[1.85] text-white/72">
                    {selectedInsight.summary}
                  </p>
                  <p className="mt-4 max-w-[560px] text-[14px] font-normal leading-[1.8] text-white/52">
                    {selectedInsight.detail}
                  </p>
                  <div className="mt-8 grid max-w-[560px] grid-cols-3 gap-3">
                    {selectedInsight.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-[18px] bg-white/[0.06] p-4">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/38">{metric.label}</div>
                        <div className="mt-3 text-[clamp(1.35rem,2vw,2rem)] font-medium leading-none text-white">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </>
  );
}
