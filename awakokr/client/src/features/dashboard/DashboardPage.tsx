import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { useAuthStore } from '../../stores/authStore';
import { useCycleStore } from '../../stores/cycleStore';
import { useObjectiveStore } from '../../stores/objectiveStore';
import { useKrStore } from '../../stores/krStore';
import { useTodoStore } from '../../stores/todoStore';
import type { KeyResult, Todo } from '../../types';

interface DashboardStats {
  totalObjectives: number;
  totalKRs: number;
  totalTodos: number;
  overallCompletion: number;
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { currentCycle, fetchCycles } = useCycleStore();
  const { objectives, fetchObjectives } = useObjectiveStore();
  const { keyResults, fetchKeyResults } = useKrStore();
  const { fetchTodosByCycle, timelineTodos } = useTodoStore();

  const [loading, setLoading] = useState(true);

  // 初始化加载周期
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        await fetchCycles();
      } catch { /* ignore */ }
      setLoading(false);
    }
    init();
  }, [fetchCycles]);

  // 当周期变化时加载 O 和 Todo
  useEffect(() => {
    if (!currentCycle) return;
    const cycle = currentCycle;
    async function loadCycleData() {
      setLoading(true);
      try {
        await fetchObjectives(cycle.id);
        await fetchTodosByCycle(cycle.id);
      } catch { /* ignore */ }
      setLoading(false);
    }
    loadCycleData();
  }, [currentCycle, fetchObjectives, fetchTodosByCycle]);

  // 当前用户在活跃周期的 O 列表
  const myObjectives = useMemo(() => {
    if (!user) return [];
    return objectives.filter((o) => o.createdBy === user.id);
  }, [objectives, user]);

  // 加载我的 O 下面的 KR
  useEffect(() => {
    if (myObjectives.length === 0) return;
    for (const obj of myObjectives) {
      fetchKeyResults(obj.id);
    }
  }, [myObjectives, fetchKeyResults]);

  // 从 store 中派生我的 KRs（避免闭包陈旧问题）
  const myKRs = useMemo<KeyResult[]>(() => {
    const all: KeyResult[] = [];
    for (const obj of myObjectives) {
      const krs = keyResults[obj.id];
      if (krs) all.push(...krs);
    }
    return all;
  }, [myObjectives, keyResults]);

  // 当前用户的 Todo
  const myTodos = useMemo<Todo[]>(() => {
    if (!user) return [];
    return timelineTodos.filter((t) => t.createdBy === user.id);
  }, [timelineTodos, user]);

  // 统计数据
  const stats: DashboardStats = useMemo(() => {
    const totalObjectives = myObjectives.length;
    const totalKRs = myKRs.length;
    const totalTodos = myTodos.length;

    let overallCompletion = 0;
    if (totalObjectives > 0) {
      const totalCompletion = myObjectives.reduce((sum, o) => sum + o.completion, 0);
      overallCompletion = Math.round((totalCompletion / totalObjectives) * 100);
    }

    return { totalObjectives, totalKRs, totalTodos, overallCompletion };
  }, [myObjectives, myKRs, myTodos]);

  // 逾期 Todo
  const overdueTodos = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return myTodos.filter((t) => t.plannedEnd.slice(0, 10) < today && t.status !== 'completed');
  }, [myTodos]);

  // 剩余天数
  const remainingDays = useMemo(() => {
    if (!currentCycle) return null;
    const end = new Date(currentCycle.endDate).getTime();
    const now = Date.now();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  }, [currentCycle]);

  // 最近更新的项目
  const recentUpdates = useMemo(() => {
    const items: { id: string; title: string; type: 'objective' | 'todo'; updatedAt: string; status?: string }[] = [];

    for (const o of myObjectives) {
      items.push({ id: o.id, title: o.title, type: 'objective', updatedAt: o.updatedAt });
    }
    for (const t of myTodos) {
      items.push({ id: t.id, title: t.title, type: 'todo', updatedAt: t.updatedAt, status: t.status });
    }

    return items
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);
  }, [myObjectives, myTodos]);

  if (loading && !currentCycle) {
    return (
      <div className="py-16">
        <Loading text="加载仪表盘..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user ? `${user.displayName}，欢迎回来` : '加载中...'}
        </p>
      </div>

      {/* 当前周期信息 */}
      {currentCycle && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">{currentCycle.name}</h2>
              <p className="mt-0.5 text-sm text-blue-600">
                {currentCycle.startDate.slice(0, 10)} — {currentCycle.endDate.slice(0, 10)}
              </p>
            </div>
            <div className="text-right">
              {remainingDays !== null && (
                <>
                  <div className={`text-3xl font-bold ${remainingDays <= 7 ? 'text-red-600' : remainingDays <= 30 ? 'text-amber-600' : 'text-blue-700'}`}>
                    {remainingDays > 0 ? remainingDays : 0}
                  </div>
                  <div className="text-xs text-blue-500">剩余天数</div>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {!currentCycle && (
        <Card>
          <div className="py-8 text-center text-gray-400">暂无活跃周期，请联系管理员创建</div>
        </Card>
      )}

      {/* 统计卡片行 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="我的目标" value={stats.totalObjectives} icon="🎯" />
        <StatCard label="关键结果" value={stats.totalKRs} icon="📊" />
        <StatCard label="待办事项" value={stats.totalTodos} icon="✅" />
        <StatCard
          label="整体完成率"
          value={`${stats.overallCompletion}%`}
          icon="🚀"
          highlight={stats.overallCompletion >= 70}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 我的 OKR 概览 */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">我的 OKR 概览</h3>
          {myObjectives.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">当前周期暂无目标</p>
          ) : (
            <div className="space-y-3">
              {myObjectives.map((obj) => {
                const completionPercent = Math.round(obj.completion * 100);
                return (
                  <div key={obj.id} className="rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{obj.title}</span>
                      <span className="text-xs font-medium text-gray-500">{completionPercent}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${completionPercent}%`,
                          backgroundColor: completionPercent >= 70 ? '#22c55e' : completionPercent >= 40 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* 逾期提醒 */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            逾期提醒
            {overdueTodos.length > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                {overdueTodos.length}
              </span>
            )}
          </h3>
          {overdueTodos.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">没有逾期待办，做得不错！</p>
          ) : (
            <div className="space-y-2">
              {overdueTodos.slice(0, 10).map((todo) => (
                <div key={todo.id} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-red-800">{todo.title}</p>
                    <p className="mt-0.5 text-xs text-red-500">
                      计划结束：{todo.plannedEnd.slice(0, 10)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    {todo.status === 'not_started' ? '未开始' : '进行中'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 最近更新 */}
      {recentUpdates.length > 0 && (
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">最近更新</h3>
          <div className="divide-y divide-gray-100">
            {recentUpdates.map((item) => (
              <div key={item.id + item.type} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                    item.type === 'objective'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-green-50 text-green-600'
                  }`}>
                    {item.type === 'objective' ? 'O' : 'Todo'}
                  </span>
                  <span className="text-sm text-gray-700">{item.title}</span>
                  {item.status && (
                    <span className="text-xs text-gray-400">
                      ({item.status === 'completed' ? '已完成' : item.status === 'in_progress' ? '进行中' : '未开始'})
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(item.updatedAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── 统计卡片子组件 ──────────────────────────
function StatCard({ label, value, icon, highlight }: {
  label: string;
  value: number | string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-lg">
          {icon}
        </div>
        <div>
          <div className={`text-xl font-bold ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
            {value}
          </div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </Card>
  );
}
