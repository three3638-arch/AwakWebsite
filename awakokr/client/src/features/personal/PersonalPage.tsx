import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useObjectiveStore } from '../../stores/objectiveStore';
import { useUserStore } from '../../stores/userStore';
import { useCycleStore } from '../../stores/cycleStore';
import { ObjectiveWithCompletion, Cycle } from '../../types';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';

export function PersonalPage() {
  const { user } = useAuth();
  const { objectives, loading, fetchObjectives } = useObjectiveStore();
  const { users, fetchUsers } = useUserStore();
  const { cycles, fetchCycles } = useCycleStore();

  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // 加载用户列表和周期列表
  useEffect(() => {
    if (users.length === 0) fetchUsers();
    if (cycles.length === 0) fetchCycles();
  }, [users.length, cycles.length, fetchUsers, fetchCycles]);

  // 默认选择当前用户
  useEffect(() => {
    if (user && !selectedUserId) {
      setSelectedUserId(user.id);
    }
  }, [user, selectedUserId]);

  // 加载目标（不传 cycleId 获取所有周期的）
  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  // 当前查看的用户的目标
  const filteredObjectives = selectedUserId
    ? objectives.filter((o) => o.createdBy === selectedUserId)
    : [];

  // 按周期分组
  const groupedByCycle = groupByCycle(filteredObjectives, cycles);

  // 获取用户显示名
  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">个人视图</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">查看用户:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName} ({u.team})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 内容 */}
      {loading ? (
        <div className="py-16">
          <Loading text="加载中..." />
        </div>
      ) : filteredObjectives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-sm">该用户暂无目标</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByCycle.map(({ cycle, objectives: cycleObjectives }) => (
            <div key={cycle.id}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">{cycle.name}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    cycle.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cycle.status === 'active' ? '进行中' : '已归档'}
                </span>
              </div>
              <div className="space-y-2">
                {cycleObjectives.map((obj) => (
                  <PersonalObjectiveCard key={obj.id} objective={obj} getUserDisplayName={getUserDisplayName} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 按周期分组工具 ─────────────────────────────

function groupByCycle(
  objectives: ObjectiveWithCompletion[],
  cycles: Cycle[],
): { cycle: Cycle; objectives: ObjectiveWithCompletion[] }[] {
  const cycleMap = new Map<string, Cycle>();
  for (const c of cycles) {
    cycleMap.set(c.id, c);
  }

  const groups = new Map<string, ObjectiveWithCompletion[]>();
  for (const obj of objectives) {
    const list = groups.get(obj.cycleId) || [];
    list.push(obj);
    groups.set(obj.cycleId, list);
  }

  // 按周期开始日期降序排列
  const result: { cycle: Cycle; objectives: ObjectiveWithCompletion[] }[] = [];
  for (const [cycleId, objs] of groups) {
    const cycle = cycleMap.get(cycleId);
    if (cycle) {
      result.push({ cycle, objectives: objs });
    }
  }

  result.sort(
    (a, b) => new Date(b.cycle.startDate).getTime() - new Date(a.cycle.startDate).getTime(),
  );

  return result;
}

// ─── 单个目标卡片 ───────────────────────────────

interface PersonalObjectiveCardProps {
  objective: ObjectiveWithCompletion;
  getUserDisplayName: (userId: string) => string;
}

function PersonalObjectiveCard({ objective, getUserDisplayName }: PersonalObjectiveCardProps) {
  const percent = Math.round(objective.completion * 100);
  let colorClass = 'bg-gray-300';
  if (percent >= 70) colorClass = 'bg-green-500';
  else if (percent >= 40) colorClass = 'bg-blue-500';
  else if (percent > 0) colorClass = 'bg-amber-500';

  return (
    <Card className="py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-gray-900">{objective.title}</h4>
          {objective.description && (
            <p className="mt-0.5 truncate text-xs text-gray-400">{objective.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${colorClass}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500">{percent}%</span>
          </div>
          <span className="text-xs text-gray-400">
            {getUserDisplayName(objective.createdBy)}
          </span>
        </div>
      </div>
    </Card>
  );
}
