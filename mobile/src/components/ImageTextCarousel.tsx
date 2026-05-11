import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  title: string;
  desc?: string;
  image: string;
};

export default function ImageTextCarousel({
  slides,
  imageHeightPx = 260,
  tone = 'light',
  outerRoundedClassName = 'rounded-[28px]',
  imageWrapperClassName,
  imageClassName = 'h-full w-full object-cover',
  align = 'center',
  titleClassName,
}: {
  slides: Slide[];
  imageHeightPx?: number;
  tone?: 'light' | 'dark';
  /** Card outer corners (default matches previous 28px carousel). */
  outerRoundedClassName?: string;
  /** Image area: corners + bg. Defaults to top-rounded match of outer. */
  imageWrapperClassName?: string;
  imageClassName?: string;
  align?: 'center' | 'left';
  titleClassName?: string;
}) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const total = slides.length;

  if (total <= 0) return null;

  const go = (next: number) => {
    const normalized = ((next % total) + total) % total;
    setActiveIdx(normalized);
  };

  const controlBg = tone === 'dark' ? 'bg-white/15 text-white' : 'bg-[#E8E8ED] text-black';
  const dotOn = tone === 'dark' ? 'bg-white' : 'bg-black';
  const dotOff = tone === 'dark' ? 'bg-white/25' : 'bg-black/20';
  const titleTone = tone === 'dark' ? 'text-white' : 'text-[#1D1D1F]';
  const descTone = tone === 'dark' ? 'text-white/60' : 'text-[#6E6E73]';
  const surface = tone === 'dark' ? 'bg-[#0B0B0C]' : 'bg-white';
  const imgWrap =
    imageWrapperClassName ??
    (tone === 'dark' ? 'bg-white/5 rounded-t-[28px]' : 'bg-[#EEF0F3] rounded-t-[28px]');
  const textAlign = align === 'left' ? 'text-left' : 'text-center';
  const titleDefault = `${titleTone} text-[22px] font-black tracking-tight leading-snug`;
  const titleCls = titleClassName ?? titleDefault;

  return (
    <div>
      <div className="mx-auto w-full max-w-[520px]">
        <div className={`relative overflow-hidden ${outerRoundedClassName} ${surface}`}>
          <motion.div
            className="flex"
            animate={{ x: `-${activeIdx * 100}%` }}
            transition={{ type: 'tween', duration: 0.45, ease: 'easeInOut' }}
          >
            {slides.map((s) => (
              <div key={s.title} className="w-full shrink-0">
                <div className={`w-full overflow-hidden ${outerRoundedClassName} ${surface}`}>
                  <div className={imgWrap} style={{ height: imageHeightPx }}>
                    <img src={s.image} alt={s.title} className={imageClassName} referrerPolicy="no-referrer" />
                  </div>
                  <div className={`px-6 pt-8 pb-10 ${textAlign}`}>
                    <div className={titleCls}>
                      {s.title}
                    </div>
                    {s.desc ? (
                      <div className={`mt-3 ${descTone} text-[14px] leading-relaxed ${textAlign}`}>{s.desc}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => go(activeIdx - 1)}
            aria-label="Prev"
            className={`h-12 w-12 rounded-full ${controlBg} flex items-center justify-center`}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${i === activeIdx ? dotOn : dotOff}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(activeIdx + 1)}
            aria-label="Next"
            className={`h-12 w-12 rounded-full ${controlBg} flex items-center justify-center`}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

