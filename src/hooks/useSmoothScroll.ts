import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { setupHighEndHeroAnimations } from './useHighEndAnimations';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('awakEase', '0.22,1,0.36,1');

const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'awakEase';

function addMagneticInteraction(root: HTMLElement, ctx: gsap.Context) {
  const targets = gsap.utils.toArray<HTMLElement>(
    [
      'button',
      'a',
      '.tech-spec-card',
      '.intro-feat-card',
      '.vpd-fc',
      '.persona',
      '.ecard',
      '.ncard',
      '.home-shadow-allow',
    ].join(','),
    root,
  );

  const cleanups: Array<() => void> = [];

  targets.forEach((target) => {
    if (
      (target.tagName === 'BUTTON' || target.tagName === 'A') &&
      target.closest('.magnetic-btn')
    ) {
      return;
    }
    if (target.classList.contains('tech-team-cta-arrow')) {
      return;
    }
    const moveX = gsap.quickTo(target, 'x', { duration: 0.6, ease: EASE });
    const moveY = gsap.quickTo(target, 'y', { duration: 0.6, ease: EASE });
    const rotateX = gsap.quickTo(target, 'rotateX', { duration: 0.6, ease: EASE });
    const rotateY = gsap.quickTo(target, 'rotateY', { duration: 0.6, ease: EASE });

    const onMove = (event: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      const strength = target.matches('button,a') ? 0.18 : 0.08;
      moveX(relX * strength);
      moveY(relY * strength);
      rotateX((-relY / Math.max(rect.height, 1)) * 3.5);
      rotateY((relX / Math.max(rect.width, 1)) * 3.5);
      target.classList.add('is-magnetic');
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
      rotateX(0);
      rotateY(0);
      target.classList.remove('is-magnetic');
    };

    target.addEventListener('mousemove', onMove);
    target.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      target.removeEventListener('mousemove', onMove);
      target.removeEventListener('mouseleave', onLeave);
      gsap.set(target, { clearProps: 'x,y,rotateX,rotateY,transformPerspective,transformStyle' });
    });

    gsap.set(target, { transformPerspective: 900, transformStyle: 'preserve-3d' });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

export function useSmoothScroll() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.home-page-root');
    if (!root || !isDesktop() || prefersReducedMotion()) return;
    root.classList.add('home-gsap-ready');

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.15,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let teardownHighEnd: (() => void) | undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-hero img',
        {
          opacity: 0,
          scale: 0.54,
          y: 34,
          filter: 'blur(18px) saturate(0.85)',
        },
        {
          opacity: 1,
          scale: 0.63,
          y: 0,
          filter: 'blur(0px) saturate(1)',
          duration: 1.8,
          ease: EASE,
        },
      );

      gsap.fromTo(
        '.home-hero-image-layer',
        {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
        },
        {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 1.8,
          ease: EASE,
        },
      );

      gsap.fromTo(
        '.hero-content > .hero-label, .hero-content > .hero-sub, .hero-content > .hero-btns',
        {
          opacity: 0,
          y: 36,
          filter: 'blur(14px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.12,
          ease: EASE,
          delay: 0.18,
        },
      );

      teardownHighEnd = setupHighEndHeroAnimations(root);

      gsap.fromTo(
        '.home-hero-light-sweep',
        { xPercent: -140, opacity: 0 },
        {
          xPercent: 140,
          opacity: 0.72,
          duration: 1.8,
          ease: EASE,
          repeat: -1,
          repeatDelay: 2.2,
        },
      );

      gsap.utils.toArray<HTMLElement>('.animate-reveal, .reveal', root).forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 84,
            scale: 0.985,
            filter: 'blur(16px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: index < 2 ? 1.8 : 1.2,
            ease: EASE,
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              end: 'bottom 18%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.animate-reveal', root).forEach((section, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        gsap.fromTo(
          section,
          { yPercent: direction * 2 },
          {
            yPercent: direction * -2,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.15,
            },
          },
        );
      });

      gsap.to('.product-hero img', {
        scale: 0.72,
        y: -64,
        rotateZ: -0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.product-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.text-glow', {
        color: '#d4ff00',
        textShadow: '0 0 38px rgba(212,255,0,0.26)',
        duration: 1.2,
        stagger: 0.1,
        ease: EASE,
        scrollTrigger: {
          trigger: '.text-glow',
          start: 'top 70%',
        },
      });

      gsap.to('.home-ambient-light', {
        xPercent: 10,
        yPercent: -8,
        scale: 1.12,
        opacity: 0.92,
        duration: 1.8,
        ease: EASE,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4,
        },
      });
    }, root);

    const removeMagneticInteraction = addMagneticInteraction(root, ctx);

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      const heroImageLayer = root.querySelector<HTMLElement>('.home-hero-image-layer');
      if (heroImageLayer) {
        gsap.to(heroImageLayer, {
          x: x * 34,
          y: y * 24,
          rotateX: y * -3.2,
          rotateY: x * 4.2,
          duration: 0.8,
          ease: EASE,
        });
      }
      gsap.to(root, {
        '--home-mouse-x': x.toFixed(4),
        '--home-mouse-y': y.toFixed(4),
        duration: 0.6,
        ease: EASE,
      });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      removeMagneticInteraction();
      cancelAnimationFrame(rafId);
      ctx.revert();
      teardownHighEnd?.();
      lenis.destroy();
      root.classList.remove('home-gsap-ready');
    };
  }, []);
}
