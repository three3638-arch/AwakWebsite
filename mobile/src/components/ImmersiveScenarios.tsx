import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from 'motion/react';
import { useTranslation } from 'react-i18next';

const PRODUCT_IDS = ['ring', 'band', 'watch', 'glasses'] as const;

/** 标签行展示顺序：戒指 → 手环 → 眼镜 → 手表 */
const TAB_ROW_ORDER: (typeof PRODUCT_IDS)[number][] = ['ring', 'band', 'glasses', 'watch'];

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

/** 沉浸式场景轮播全部配图 URL，供首页预加载 */
export function getImmersiveFeatureImageUrls(): string[] {
  return PRODUCT_IDS.flatMap((id) => FEATURE_IMAGES[id]);
}

/** 2–3s 之间：2.5s */
const CARD_AUTOPLAY_MS = 2500;

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

  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselAutoplayDisabled, setCarouselAutoplayDisabled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const programmaticScrollRef = useRef(false);
  const isInView = useInView(containerRef, { amount: 0.15 });

  const activeProductId = PRODUCT_IDS[activeIndex];
  const activeProductData =
    productsData.find((p) => p.id === activeProductId) ?? productsData[0];

  const runProgrammaticCarouselScroll = useCallback((targetLeft: number) => {
    const root = scrollRef.current;
    if (!root) return;
    programmaticScrollRef.current = true;
    root.scrollLeft = targetLeft;
    queueMicrotask(() => {
      programmaticScrollRef.current = false;
    });
  }, []);

  useEffect(() => {
    runProgrammaticCarouselScroll(0);
  }, [activeProductId, runProgrammaticCarouselScroll]);

  const carouselSlideRef = useRef(0);

  useEffect(() => {
    carouselSlideRef.current = 0;
  }, [activeProductId]);

  useEffect(() => {
    if (!isInView || carouselAutoplayDisabled) return;
    const id = window.setInterval(() => {
      const root = scrollRef.current;
      if (!root?.children.length) return;
      const n = root.children.length;
      carouselSlideRef.current = (carouselSlideRef.current + 1) % n;
      const el = root.children[carouselSlideRef.current] as HTMLElement;
      el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }, CARD_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isInView, carouselAutoplayDisabled, activeProductId, activeProductData.features.length]);

  const onCarouselScroll = () => {
    if (programmaticScrollRef.current) return;
    setCarouselAutoplayDisabled(true);
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[70vh] flex-col justify-center overflow-hidden bg-[#F5F5F3] py-16 font-sans text-[#1a1a1a] md:py-20"
    >
      {/* 按钮与卡片共用同一左右页边距 12px（与首页其它 12px 栅格一致） */}
      <div className="z-10 flex min-w-0 flex-col gap-8 px-[12px]">
        <div className="flex w-full max-w-full flex-col md:max-w-[min(100%,520px)]">
          <div
            className="flex w-full shrink-0 flex-row flex-wrap items-center gap-x-2 gap-y-2 max-md:flex-nowrap max-md:justify-between max-md:gap-2 sm:gap-x-4 md:flex-wrap md:justify-start"
            role="tablist"
            aria-label={t('home.immersive.tablistAria')}
          >
            {TAB_ROW_ORDER.map((productId) => {
              const idx = PRODUCT_IDS.indexOf(productId);
              const product = productsData[idx]!;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={productId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  title={product.name}
                  onClick={() => setActiveIndex(idx)}
                  className={[
                    'inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-center text-[13px] font-normal leading-snug tracking-tight transition-colors duration-200 max-md:min-h-[48px] max-md:min-w-0 max-md:flex-1 max-md:px-2 max-md:py-3 sm:px-4 sm:py-2 sm:text-[14px] md:inline-flex md:min-h-0 md:flex-initial md:px-3 md:py-1.5 md:text-left md:text-[15px]',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white/80 text-neutral-600 ring-1 ring-neutral-300/80 hover:bg-white hover:text-neutral-900',
                  ].join(' ')}
                >
                  {t(`home.immersive.tabShort.${productId}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 卡片区：不再全屏 breakout，左侧与按钮对齐为 12px */}
        <div className="min-w-0 w-full">
          <div
            ref={scrollRef}
            onScroll={onCarouselScroll}
            className="immersive-scenarios-scroll flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 pt-1 [-webkit-overflow-scrolling:touch]"
          >
            {activeProductData.features.map((feature, idx) => {
              const rhythm = idx % 3;
              const isLarge = rhythm === 1;
              return (
              <article
                key={`${activeProductId}-${idx}`}
                className={
                  isLarge
                    ? 'w-[min(260px,calc(100vw-36px))] shrink-0 snap-start snap-always md:w-[min(560px,calc(100%-16px))]'
                    : 'w-[min(260px,calc(100vw-36px))] shrink-0 snap-start snap-always md:w-[min(320px,min(72vw,calc(100%-24px)))]'
                }
              >
                <div className="overflow-hidden rounded-[10px] bg-neutral-200 border-none">
                  <div
                    className={
                      isLarge
                        ? 'relative aspect-[3/4] w-full md:aspect-[4/5] lg:aspect-[16/10]'
                        : 'relative aspect-[3/4] w-full md:aspect-[3/4] lg:aspect-[4/5]'
                    }
                  >
                    {feature.img ? (
                      <img
                        src={feature.img}
                        alt={feature.title}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        draggable={false}
                      />
                    ) : null}
                    {/* 文案叠在图内左下 */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-4 pt-14 text-left">
                      <p className="text-[15px] font-semibold tracking-tight text-white drop-shadow-sm">
                        {feature.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/85 drop-shadow-sm">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .immersive-scenarios-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .immersive-scenarios-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
