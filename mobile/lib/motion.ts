import type { Transition, Variants } from 'motion/react';

/** AWAK 全局动效 ease — cubic-bezier(0.16, 1, 0.3, 1) */
export const easeSpring = [0.16, 1, 0.3, 1] as const;

export const spring: Transition = {
  duration: 0.65,
  ease: easeSpring,
};

/** whileInView / 滚动入场通用 viewport */
export const viewport = {
  once: true as const,
  amount: 0.25 as const,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeSpring },
  },
};

/** 主 CTA 条入场 */
export const primaryBtn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeSpring },
  },
};
