import { useEffect, useRef, useState } from 'react';

/**
 * PC 首页参考稿：双圆自定义光标（≥lg，且未开启「减少动态效果」）。
 */
export default function HomeCursor() {
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setActive(mq.matches && !mqReduce.matches);
    sync();
    mq.addEventListener('change', sync);
    mqReduce.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      mqReduce.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector('.home-page-root');
    if (!root) return;
    if (active) root.classList.add('home-cursor-active');
    else root.classList.remove('home-cursor-active');
    return () => root.classList.remove('home-cursor-active');
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { ...pointer };
    const ring = { ...pointer };
    const trail = { ...pointer };
    let raf = 0;

    const move = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setHover(Boolean(target?.closest('a,button,.home-shadow-allow,.tech-spec-card,.intro-feat-card,.vpd-fc')));
    };

    const tick = () => {
      dot.x += (pointer.x - dot.x) * 0.58;
      dot.y += (pointer.y - dot.y) * 0.58;
      ring.x += (pointer.x - ring.x) * 0.18;
      ring.y += (pointer.y - ring.y) * 0.18;
      trail.x += (pointer.x - trail.x) * 0.08;
      trail.y += (pointer.y - trail.y) * 0.08;

      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      if (trailRef.current) trailRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={trailRef} className={`cur-trail${hover ? ' is-hover' : ''}`} aria-hidden />
      <div ref={ringRef} className={`cur2${hover ? ' is-hover' : ''}`} aria-hidden />
      <div ref={dotRef} className={`cur${hover ? ' is-hover' : ''}`} aria-hidden />
    </>
  );
}
