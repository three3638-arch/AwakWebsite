import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const ACCENT = '#d4ff00';
const CARD_CLASSES = ['vp-m1', 'vp-m2', 'vp-m3', 'vp-m4', 'vp-m5'] as const;

export default function ValueProposition() {
  const { t } = useTranslation('common');

  const ticks = useMemo(() => Array.from({ length: 360 }, (_, i) => i), []);
  const cycleNodes = useMemo(() => {
    const nodes = t('home.valueLoop.nodes', { returnObjects: true }) as { title: string; desc: string }[];
    return nodes.map((node, i) => ({
      ...node,
      id: String(i + 1).padStart(2, '0'),
      className: CARD_CLASSES[i] ?? CARD_CLASSES[0],
    }));
  }, [t]);

  return (
    <>
      <style>{`
        :root {
          --vp-bg-deep: #050505;
          --vp-accent-glow: ${ACCENT};
          --vp-card-bg: rgba(20, 20, 20, 0.9);
          --vp-text-muted: #888;
        }

        @keyframes vp-laser-rotate {
          from { transform: rotate(0deg) translateZ(5px); }
          to { transform: rotate(360deg) translateZ(5px); }
        }

        .vp-precision-stage {
          position: relative;
          width: 1000px;
          height: 700px;
          transform: rotateX(25deg);
          transform-style: preserve-3d;
          z-index: 0;
        }

        .vp-gyro-dial {
          position: absolute;
          width: 650px;
          height: 650px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotateX(-25deg);
          z-index: 0;
          pointer-events: none;
          border-radius: 9999px;
          border: 4px solid #111;
          background:
            radial-gradient(circle at center, #1a1a1a 0%, #000 70%),
            repeating-radial-gradient(transparent, transparent 1px, rgba(255,255,255,0.02) 2px);
          box-shadow:
            0 0 50px rgba(0,0,0,0.8),
            inset 0 0 30px rgba(212, 255, 0, 0.05);
        }

        .vp-ticks-layer {
          position: absolute;
          inset: 0;
          transform: translateZ(2px);
        }

        .vp-tick {
          position: absolute;
          width: 1px;
          height: 8px;
          background: rgba(255,255,255,0.1);
          left: 50%;
          top: 0;
          transform-origin: center 325px;
        }

        .vp-laser-pointer {
          position: absolute;
          width: 6px;
          height: 310px;
          left: 50%;
          bottom: 50%;
          transform-origin: bottom center;
          border-radius: 6px;
          background: linear-gradient(to top, transparent, var(--vp-accent-glow) 80%, white);
          filter: drop-shadow(0 0 12px var(--vp-accent-glow));
          animation: vp-laser-rotate 60s linear infinite;
          z-index: 0;
        }

        .vp-awak-module {
          position: absolute;
          width: 180px;
          padding: 25px;
          border-radius: 20px;
          background: var(--vp-card-bg);
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 15px rgba(212,255,0,0.1);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          z-index: 10;
          backface-visibility: hidden;
        }

        .vp-awak-module:hover {
          border-color: var(--vp-accent-glow);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(212,255,0,0.4);
          transform: translateY(-8px) scale(1.05) !important;
        }

        /* 卡片在独立 2D 覆盖层中定位（不参与舞台 3D 绘制顺序） */
        .vp-m1 { top: -5%; left: 50%; transform: translateX(-50%); }
        .vp-m2 { top: 25%; right: -5%; }
        .vp-m3 { bottom: 5%; right: 10%; }
        .vp-m4 { bottom: 5%; left: 10%; }
        .vp-m5 { top: 25%; left: -5%; }
      `}</style>

      <section className="relative isolate h-[100dvh] bg-[#050505] px-6 md:px-[170px] pt-14 md:pt-16 pb-8 overflow-hidden text-white flex flex-col">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-20 text-center mb-4 md:mb-6 shrink-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight mb-3"
          >
            {t('home.valueLoop.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#888] text-base md:text-xl max-w-2xl mx-auto font-medium"
          >
            {t('home.valueLoop.subtitle')}
          </motion.p>
        </div>

        <div className="relative z-0 flex flex-1 min-h-0 items-center justify-center [perspective:2000px]">
          <div className="relative origin-center scale-[0.58] sm:scale-[0.68] md:scale-[0.78] lg:scale-[0.86] xl:scale-[0.92]">
            <div className="vp-precision-stage">
              <div className="vp-gyro-dial">
                <div className="vp-ticks-layer">
                  {ticks.map((tick) => {
                    const major = tick % 15 === 0;
                    const keyNode = tick % 90 === 0;
                    return (
                      <div
                        key={tick}
                        className="vp-tick"
                        style={{
                          height: major ? 18 : 8,
                          width: major ? 2 : 1,
                          background: keyNode ? ACCENT : major ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                          filter: keyNode ? `drop-shadow(0 0 5px ${ACCENT})` : undefined,
                          transform: `rotate(${tick}deg)`,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="vp-laser-pointer" aria-hidden />
              </div>
            </div>

            <div className="absolute inset-0 z-10">
              {cycleNodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.25 }}
                  className={`vp-awak-module ${node.className}`}
                >
                  <div className="mb-2.5 font-mono text-sm text-[#555]">AWAK / SYSTEM_{node.id}</div>
                  <h3 className="m-0 mb-2 text-xl font-semibold text-white">{node.title}</h3>
                  <p className="m-0 text-[13px] leading-normal text-[#888]">{node.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
