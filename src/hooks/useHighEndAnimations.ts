import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

/**
 * PC 首页首屏高阶动效（与 useSmoothScroll 中的 Lenis 共用，不在此重复创建 Lenis）。
 * 在 gsap.context 回调内调用，以便 ScrollTrigger / tween 随 ctx.revert 一并回收。
 */
export function setupHighEndHeroAnimations(root: HTMLElement): () => void {
  const splitInstances: SplitType[] = [];
  const magneticCleanups: Array<() => void> = [];
  let glowMove: ((e: MouseEvent) => void) | undefined;

  if (!root.querySelector('#hero')) return () => {};

  // —— 1. 电影级文本切片（#hero 内 .split-text-reveal）——
  root.querySelectorAll<HTMLElement>('#hero .split-text-reveal').forEach((text) => {
    const st = new SplitType(text, { types: 'chars' });
    splitInstances.push(st);
    const chars = st.chars;
    if (!chars?.length) return;
    gsap.from(chars, {
      y: '110%',
      opacity: 0,
      rotationZ: 4,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.022,
      scrollTrigger: {
        trigger: text,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    });
  });

  // —— 2. 磁性吸附（.magnetic-btn：首屏 CTA + 首页导航）——
  const magneticEls = document.querySelectorAll<HTMLElement>('.magnetic-btn');
  magneticEls.forEach((el) => {
    gsap.set(el, { x: 0, y: 0 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.95, ease: 'elastic.out(1, 0.32)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.95, ease: 'elastic.out(1, 0.32)' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      xTo(relX * 0.28);
      yTo(relY * 0.28);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    magneticCleanups.push(() => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { clearProps: 'x,y' });
    });
  });

  // —— 3. 荧光绿环境光晕跟从 ——
  const glowCursor = root.querySelector<HTMLElement>('.cyber-glow-cursor');
  if (glowCursor) {
    const glowX = gsap.quickTo(glowCursor, 'left', { duration: 0.65, ease: 'power3.out' });
    const glowY = gsap.quickTo(glowCursor, 'top', { duration: 0.65, ease: 'power3.out' });
    glowMove = (e: MouseEvent) => {
      glowX(e.clientX);
      glowY(e.clientY);
    };
    window.addEventListener('mousemove', glowMove, { passive: true });
  }

  ScrollTrigger.refresh();

  return () => {
    splitInstances.forEach((s) => {
      try {
        s.revert();
      } catch {
        /* noop */
      }
    });
    magneticCleanups.forEach((fn) => fn());
    if (glowMove) window.removeEventListener('mousemove', glowMove);
  };
}
