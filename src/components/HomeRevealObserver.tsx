import { useEffect } from 'react';

/**
 * 参考稿 REVEAL：`.home-atomic .r` 进入视口时添加 `.on`（与参考 HTML 的 `.r.on` 一致）。
 */
export default function HomeRevealObserver() {
  useEffect(() => {
    const container = document.querySelector('.home-page-root');
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    const scan = () => {
      container.querySelectorAll('.r:not(.observed)').forEach((el) => {
        el.classList.add('observed');
        io.observe(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(container, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
