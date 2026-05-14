import { useEffect, useRef } from 'react';
import { loadUnicornStudioScript, runUnicornStudioInit } from '../lib/unicornStudio';

const UNICORN_PROJECT_ID = 'Hr8zIwDSD99zGwLZgQu7';

/**
 * PC 首页首屏：Unicorn Studio WebGL 底层背景（置于文案与主图之下）。
 * 仅在大屏挂载与加载脚本，避免影响移动端。
 */
export default function HeroUnicornStudioBackground() {
  const projectHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    let cancelled = false;

    const trySetup = () => {
      if (!mq.matches || cancelled) return;
      if (!projectHostRef.current) return;

      loadUnicornStudioScript()
        .then(() => {
          if (cancelled) return;
          runUnicornStudioInit();
        })
        .catch(() => {
          /* 静默失败，首屏不依赖 WebGL */
        });
    };

    trySetup();
    mq.addEventListener('change', trySetup);

    return () => {
      cancelled = true;
      mq.removeEventListener('change', trySetup);
    };
  }, []);

  return (
    <div
      className="hero-unicorn-studio-host pointer-events-none absolute inset-0 z-[-1] hidden min-h-0 w-full min-w-0 overflow-hidden lg:block"
      aria-hidden
    >
      <div
        ref={projectHostRef}
        className="hero-unicorn-studio-inner absolute inset-0 h-full min-h-full w-full min-w-0"
      >
        <div
          data-us-project={UNICORN_PROJECT_ID}
          className="h-full min-h-full w-full min-w-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!max-w-none [&_canvas]:object-cover"
          style={{ width: '100%', height: '100%', minHeight: '100%' }}
        />
      </div>
    </div>
  );
}
