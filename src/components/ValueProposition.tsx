import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

const NODE_ANGLES = [-90, -18, 54, 126, 198];

export default function ValueProposition() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { t } = useTranslation('common');

  const cycleNodes = useMemo(() => {
    const nodes = t('home.valueLoop.nodes', { returnObjects: true }) as { title: string; desc: string }[];
    return nodes.map((n, i) => ({
      ...n,
      id: String(i + 1).padStart(2, '0'),
      angle: NODE_ANGLES[i],
    }));
  }, [t]);

  return (
    <section className="relative bg-[#F5F5F7] py-[100px] px-6 md:px-[170px] overflow-hidden min-h-[850px] flex flex-col items-center justify-start w-full">
      
      {/* Title - Optimized spacing and contrast */}
      <div className="relative text-center z-[10] mt-[20px] px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#1D1D1F] text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight mb-4"
        >
          {t('home.valueLoop.title')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#1D1D1F]/60 text-lg md:text-xl max-w-2xl mx-auto font-medium"
        >
          {t('home.valueLoop.subtitle')}
        </motion.p>
      </div>

      <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] mt-[60px] flex items-center justify-center shrink-0">
        
        {/* Orbital Structure - Precision base layer with explicit viewBox */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Orbital Circle - Radius 40 */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="url(#orbitGradient)" strokeWidth="0.5" strokeOpacity="1" />
          
          {/* Active Data Trace */}
          <motion.circle 
            cx="50" cy="50" r="40" fill="none" stroke="#DDF700" strokeWidth="1" 
            strokeDasharray="4 1000"
            strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          />
        </svg>

        {/* Central Core Pulse - Top layer of the center */}
        <div className="relative z-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-[60px] h-[60px] rounded-full border border-white/20 flex items-center justify-center bg-black/10 backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 bg-[#DDF700] rounded-full shadow-[0_0_15px_#DDF700]" />
          </motion.div>
        </div>

        {/* Nodes - Center Anchored Coordinate Positioning (Middle layer) */}
        {cycleNodes.map((node, index) => {
          const angleRad = (node.angle * Math.PI) / 180;
          // Exact coordinate calculation to lock onto the 40 radius orbit
          const x = 50 + 40 * Math.cos(angleRad);
          const y = 50 + 40 * Math.sin(angleRad);

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="absolute z-10"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative cursor-pointer group"
              >
                {/* Premium Dark Glassmorphism Card for Absolute Contrast */}
                <div className="w-[140px] md:w-[170px] p-5 rounded-[22px] bg-[#1D1D1F] backdrop-blur-2xl border border-white/[0.05] transition-all duration-500 group-hover:border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                  
                  {/* Cyber Green Number ID */}
                  <span className="text-white text-4xl font-extralight leading-none mb-3 block">
                    {node.id}
                  </span>
                  
                  <h3 className="text-[#FFFFFF] text-sm md:text-base font-black mb-1.5 tracking-tight uppercase">
                    {node.title}
                  </h3>
                  
                  {/* High Contrast White Text for readability on Dark Background */}
                  <p className="text-[#FFFFFF]/70 text-[10px] md:text-[11px] leading-relaxed font-medium">
                    {node.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Data Ripple interaction */}
        <AnimatePresence>
          {hoveredNode && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]">
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0 }}
                x1="50%" y1="50%"
                x2={`${50 + 40 * Math.cos((cycleNodes.find(n => n.id === hoveredNode)!.angle * Math.PI) / 180)}%`}
                y2={`${50 + 40 * Math.sin((cycleNodes.find(n => n.id === hoveredNode)!.angle * Math.PI) / 180)}%`}
                stroke="#DDF700"
                strokeWidth="0.5"
                strokeOpacity="0.3"
                strokeDasharray="2 4"
              />
            </svg>
          )}
        </AnimatePresence>
      </div>

      {/* Spacing Guardrails */}
      <div className="absolute left-[170px] inset-y-0 w-[1px] bg-black/5 pointer-events-none" />
      <div className="absolute right-[170px] inset-y-0 w-[1px] bg-black/5 pointer-events-none" />
    </section>
  );
}
