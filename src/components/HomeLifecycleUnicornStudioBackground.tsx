import { useEffect, useRef } from 'react';
import { loadUnicornStudioScript, runUnicornStudioInit } from '../lib/unicornStudio';

/** 用户提供的 Unicorn 项目（全生命周期文案区底层氛围） */
const LIFECYCLE_UNICORN_PROJECT_ID = 'rIAS0a38G6T4I6tSnixD';

/**
 * PC 首页「多元智能穿戴 / 全生命周期」文案模块：WebGL 底层，置于所有文字之下（z-index: -1），随区块滚动。
 */
export default function HomeLifecycleUnicornStudioBackground() {
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
          /* 静默失败 */
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
      className="lifecycle-unicorn-studio-host pointer-events-none absolute inset-0 z-[-1] hidden min-h-0 w-full min-w-0 overflow-hidden lg:block"
      aria-hidden
    >
      <div
        ref={projectHostRef}
        className="lifecycle-unicorn-studio-inner absolute inset-0 h-full min-h-full w-full min-w-0"
      >
        <div
          data-us-project={LIFECYCLE_UNICORN_PROJECT_ID}
          className="h-full min-h-full w-full min-w-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!max-w-none [&_canvas]:object-cover"
          style={{ width: '100%', height: '100%', minHeight: '100%' }}
        />
      </div>
    </div>
  );
}
