import React from 'react';
import { ChevronDown } from 'lucide-react';

type StatItem = {
  label: string;
  value: string;
  sublabel?: string;
};

export default function CompareStatsPanel({
  compareLabel,
  items,
}: {
  compareLabel: string;
  items: StatItem[];
}) {
  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="rounded-[28px] bg-[#F5F5F7] p-6">
        <div className="text-[#86868B] text-[14px] font-semibold tracking-tight">相比</div>

        <button
          type="button"
          className="mt-3 w-full rounded-full bg-white px-5 py-3 flex items-center justify-between"
        >
          <span className="text-[#1D1D1F] text-[18px] font-semibold">{compareLabel}</span>
          <ChevronDown className="h-5 w-5 text-[#1D1D1F]/70" />
        </button>

        <div className="mt-6 flex flex-col gap-5">
          {items.slice(0, 3).map((it, idx) => (
            <div key={`${it.label}-${idx}`} className="rounded-[16px] bg-white p-5">
              <div className="text-[#6E6E73] text-[12px] font-semibold">{it.label}</div>
              <div className="mt-2 text-[#1D1D1F] text-[28px] font-black tracking-tight leading-none">
                {it.value}
              </div>
              {it.sublabel ? (
                <div className="mt-2 text-[#6E6E73] text-[12px] font-medium">{it.sublabel}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

