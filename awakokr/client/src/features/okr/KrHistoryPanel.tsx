import { useState, useEffect } from 'react';
import { KeyResultSnapshot } from '../../types';
import { useKrStore } from '../../stores/krStore';
import { useUserStore } from '../../stores/userStore';

interface KrHistoryPanelProps {
  krId: string;
  objectiveId: string;
  onClose: () => void;
}

export function KrHistoryPanel({ krId, objectiveId, onClose }: KrHistoryPanelProps) {
  const { fetchHistory } = useKrStore();
  const { users, fetchUsers } = useUserStore();
  const [history, setHistory] = useState<KeyResultSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHistory(krId, objectiveId)
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [krId, objectiveId, fetchHistory]);

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  /** 对比两个版本的差异字段 */
  const getDiffFields = (snap: KeyResultSnapshot, prevSnap: KeyResultSnapshot | null) => {
    if (!prevSnap) return null;
    const fields: { label: string; oldVal: string; newVal: string }[] = [];
    const labels: Record<string, string> = {
      title: '标题',
      description: '描述',
      weight: '权重',
      targetValue: '目标值',
      currentValue: '当前值',
      score: '评分',
    };

    for (const key of Object.keys(labels) as (keyof typeof labels)[]) {
      const oldVal = (prevSnap.data as unknown as Record<string, unknown>)[key];
      const newVal = (snap.data as unknown as Record<string, unknown>)[key];
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        fields.push({
          label: labels[key],
          oldVal: String(oldVal ?? '-'),
          newVal: String(newVal ?? '-'),
        });
      }
    }
    return fields;
  };

  if (loading) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">加载历史版本...</div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">历史版本</h4>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            收起
          </button>
        </div>
        <p className="py-4 text-center text-sm text-gray-400">暂无历史版本</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">历史版本 ({history.length})</h4>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          收起
        </button>
      </div>

      {/* 时间轴 */}
      <div className="relative space-y-0">
        {history.map((snap, idx) => {
          const prevSnap = idx > 0 ? history[idx - 1] : null;
          const diffFields = getDiffFields(snap, prevSnap);
          const isExpanded = expandedVersion === snap.version;

          return (
            <div key={snap.version} className="relative flex gap-3 pb-4">
              {/* 时间轴线 */}
              <div className="flex flex-col items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  {snap.version}
                </div>
                {idx < history.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200" />
                )}
              </div>

              {/* 内容 */}
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => setExpandedVersion(isExpanded ? null : snap.version)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(snap.modifiedAt).toLocaleString('zh-CN')}
                    </span>
                    <span className="text-xs text-gray-400">by</span>
                    <span className="text-xs font-medium text-gray-600">
                      {getUserDisplayName(snap.modifiedBy)}
                    </span>
                    <svg
                      className={`h-3 w-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {snap.changeNote && (
                    <p className="mt-0.5 text-xs text-gray-500">"{snap.changeNote}"</p>
                  )}
                </button>

                {/* 展开的差异对比 */}
                {isExpanded && (
                  <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    {diffFields && diffFields.length > 0 ? (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-400">
                            <th className="w-16 text-left font-normal">字段</th>
                            <th className="text-left font-normal">修改前</th>
                            <th className="text-left font-normal">修改后</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          {diffFields.map((f) => (
                            <tr key={f.label}>
                              <td className="py-0.5 font-medium text-gray-700">{f.label}</td>
                              <td className="py-0.5 text-red-500 line-through">{f.oldVal}</td>
                              <td className="py-0.5 text-green-600">{f.newVal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-xs text-gray-400">无字段变更（仅版本号更新）</p>
                    )}

                    {/* 完整数据概览 */}
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-400">
                        v{snap.version} 完整数据：标题「{snap.data.title}」，权重 {snap.data.weight}%，
                        目标值 {snap.data.targetValue}，当前值 {snap.data.currentValue}，
                        评分 {snap.data.score !== null ? snap.data.score : '-'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
