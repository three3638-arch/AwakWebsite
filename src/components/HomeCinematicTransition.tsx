import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function HomeCinematicTransition() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!desktop.matches || reduce.matches) return;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 720);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="home-cinematic-transition"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />
      ) : null}
    </AnimatePresence>
  );
}
