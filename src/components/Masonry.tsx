import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const [value, setValue] = useState<number>(() => values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue);

  useEffect(() => {
    const handler = () => setValue(values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue);
    queries.forEach((q) => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach((q) => matchMedia(q).removeEventListener('change', handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

export interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
  meta?: React.ReactNode;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: MasonryItem) => void;
  className?: string;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
  className,
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1,
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = useCallback(
    (item: GridItem) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return { x: item.x, y: item.y };

      let direction = animateFrom;

      if (animateFrom === 'random') {
        const directions = ['top', 'bottom', 'left', 'right'] as const;
        direction = directions[Math.floor(Math.random() * directions.length)] as typeof animateFrom;
      }

      switch (direction) {
        case 'top':
          return { x: item.x, y: -200 };
        case 'bottom':
          return { x: item.x, y: window.innerHeight + 200 };
        case 'left':
          return { x: -200, y: item.y };
        case 'right':
          return { x: window.innerWidth + 200, y: item.y };
        case 'center':
          return {
            x: containerRect.width / 2 - item.w / 2,
            y: containerRect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef],
  );

  useEffect(() => {
    setImagesReady(false);
    void preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, listHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], listHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const grid = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    const listHeight = Math.max(...colHeights, 0);
    return { grid, listHeight };
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!imagesReady || grid.length === 0 || !root) return;

    const firstPaint = !hasMounted.current;

    grid.forEach((item, index) => {
      const el = root.querySelector<HTMLElement>(`[data-masonry-key="${CSS.escape(item.id)}"]`);
      if (!el) return;

      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (firstPaint) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' }),
        };

        gsap.fromTo(el, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease,
          delay: index * stagger,
        });
      } else {
        gsap.to(el, {
          ...animationProps,
          duration,
          ease,
          overwrite: 'auto',
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, blurToFocus, duration, ease, getInitialPosition]);

  const handleMouseEnter = (e: React.MouseEvent, _item: GridItem) => {
    const el = e.currentTarget as HTMLElement;

    if (scaleOnHover) {
      gsap.to(el, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay') as HTMLElement | null;
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3,
        });
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent, _item: GridItem) => {
    const el = e.currentTarget as HTMLElement;

    if (scaleOnHover) {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (colorShiftOnHover) {
      const overlay = el.querySelector('.color-overlay') as HTMLElement | null;
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  };

  const onActivate = (item: MasonryItem) => {
    if (onItemClick) onItemClick(item);
    else window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={containerRef}
      className={`rb-masonry-list${className ? ` ${className}` : ''}`}
      style={{ height: listHeight > 0 ? listHeight : undefined }}
    >
      {grid.map((item) => {
        return (
          <div
            key={item.id}
            data-masonry-key={item.id}
            className="rb-masonry-item-wrapper"
            role="button"
            tabIndex={0}
            onClick={() => onActivate(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivate(item);
              }
            }}
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseLeave={(e) => handleMouseLeave(e, item)}
          >
            <div className="rb-masonry-item-img" style={{ backgroundImage: `url(${item.img})` }}>
              {item.meta}
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                    opacity: 0,
                    pointerEvents: 'none',
                    borderRadius: '8px',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
