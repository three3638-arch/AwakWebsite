/**
 * 不依赖 WebGL 的流体感背景（高对比），与 SplashCursor 同区叠放。
 */
export default function HomeLifecycleStripBackdrop() {
  return <div className="lifecycle-fluid-fallback pointer-events-none absolute inset-0 z-0" aria-hidden />;
}
