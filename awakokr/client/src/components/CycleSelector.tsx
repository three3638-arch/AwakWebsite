import { useEffect } from 'react';
import { useCycleStore } from '../stores/cycleStore';

interface CycleSelectorProps {
  /** 自定义 className */
  className?: string;
}

export function CycleSelector({ className = '' }: CycleSelectorProps) {
  const { activeCycles, currentCycle, setCurrentCycle, fetchCycles, loading } = useCycleStore();

  useEffect(() => {
    // 如果还没有加载过周期数据，先加载
    fetchCycles();
  }, [fetchCycles]);

  const active = activeCycles();

  if (loading && active.length === 0) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-400 ${className}`}>
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        加载中...
      </div>
    );
  }

  if (active.length === 0) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        暂无活跃周期
      </div>
    );
  }

  return (
    <div className={className}>
      <select
        value={currentCycle?.id || ''}
        onChange={(e) => {
          const cycle = active.find((c) => c.id === e.target.value);
          setCurrentCycle(cycle || null);
        }}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {active.map((cycle) => (
          <option key={cycle.id} value={cycle.id}>
            {cycle.name}
          </option>
        ))}
      </select>
    </div>
  );
}
