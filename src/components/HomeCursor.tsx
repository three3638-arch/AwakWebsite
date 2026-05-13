import { useEffect, useState } from 'react';

/**
 * PC 首页参考稿：双圆自定义光标（≥lg，且未开启「减少动态效果」）。
 */
export default function HomeCursor() {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

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
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className="cur" style={{ left: pos.x, top: pos.y }} aria-hidden />
      <div className="cur2" style={{ left: pos.x, top: pos.y }} aria-hidden />
    </>
  );
}
