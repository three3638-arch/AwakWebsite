import { useEffect, useMemo, useState } from 'react';
import { useCycleStore } from '../../stores/cycleStore';
import { useObjectiveStore } from '../../stores/objectiveStore';
import { useKrStore } from '../../stores/krStore';
import { useTodoStore } from '../../stores/todoStore';
import { useUserStore } from '../../stores/userStore';
import { CycleSelector } from '../../components/CycleSelector';
import { Todo } from '../../types';

/** 获取状态颜色 */
function getBarStyle(todo: Todo): { bg: string; fill: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = todo.status !== 'completed' && new Date(todo.plannedEnd) < today;

  if (isOverdue) return { bg: 'bg-red-100', fill: 'bg-red-500' };
  if (todo.status === 'completed') return { bg: 'bg-green-100', fill: 'bg-green-500' };
  if (todo.status === 'in_progress') return { bg: 'bg-blue-100', fill: 'bg-blue-500' };
  return { bg: 'bg-gray-100', fill: 'bg-gray-400' };
}

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10);
}

export function TimelinePage() {
  const { currentCycle, fetchCycles } = useCycleStore();
  const { objectives, fetchObjectives } = useObjectiveStore();
  const { fetchKeyResults, keyResults } = useKrStore();
  const { fetchTodosByCycle, timelineTodos } = useTodoStore();
  const { users, fetchUsers } = useUserStore();
  const [loadedCycleId, setLoadedCycleId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchCycles();
    if (users.length === 0) fetchUsers();
  }, [fetchCycles, fetchUsers, users.length]);

  // 当选中周期时加载 O 和 Todo
  useEffect(() => {
    if (!currentCycle) return;
    if (loadedCycleId === currentCycle.id) return;
    fetchObjectives(currentCycle.id);
    fetchTodosByCycle(currentCycle.id);
    setLoadedCycleId(currentCycle.id);
  }, [currentCycle, fetchObjectives, fetchTodosByCycle, loadedCycleId]);

  // 加载每个 O 的 KR
  useEffect(() => {
    const cycleObjectives = objectives.filter((o) => o.cycleId === currentCycle?.id);
    cycleObjectives.forEach((obj) => {
      if (!keyResults[obj.id]) {
        fetchKeyResults(obj.id).catch(console.error);
      }
    });
  }, [objectives, currentCycle, keyResults, fetchKeyResults]);

  // 按O分组 Todo（并根据人员筛选）
  const groupedTodos = useMemo(() => {
    const cycleObjectives = objectives.filter((o) => o.cycleId === currentCycle?.id);
    const groups: { objectiveId: string; objectiveTitle: string; todos: (Todo & { krTitle: string })[] }[] = [];

    for (const obj of cycleObjectives) {
      const krs = keyResults[obj.id] || [];
      const objTodos: (Todo & { krTitle: string })[] = [];
      for (const kr of krs) {
        const krTodos = timelineTodos.filter((t) => t.krId === kr.id);
        objTodos.push(...krTodos.map((t) => ({ ...t, krTitle: kr.title })));
      }
      // Filter by selected user
      const filteredObjTodos = selectedUserId
        ? objTodos.filter((t) => t.createdBy === selectedUserId)
        : objTodos;
      if (filteredObjTodos.length > 0) {
        groups.push({
          objectiveId: obj.id,
          objectiveTitle: obj.title,
          todos: filteredObjTodos,
        });
      }
    }
    return groups;
  }, [objectives, currentCycle, keyResults, timelineTodos, selectedUserId]);

  // 计算时间范围
  const { totalWeeks, startDate } = useMemo(() => {
    if (!currentCycle) return { totalWeeks: 0, startDate: new Date() };
    const start = new Date(currentCycle.startDate);
    const end = new Date(currentCycle.endDate);
    const weeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return { totalWeeks: Math.max(weeks, 1), startDate: start };
  }, [currentCycle]);

  // 计算某日期在时间轴上的位置百分比
  const getDatePosition = (dateStr: string): number => {
    if (!currentCycle) return 0;
    const date = new Date(dateStr);
    const start = new Date(currentCycle.startDate);
    const end = new Date(currentCycle.endDate);
    const totalMs = end.getTime() - start.getTime();
    if (totalMs <= 0) return 0;
    return Math.max(0, Math.min(100, ((date.getTime() - start.getTime()) / totalMs) * 100));
  };

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  const todayPosition = currentCycle ? getDatePosition(new Date().toISOString()) : 0;

  if (!currentCycle) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">时间线</h1>
        <p className="mt-2 text-gray-500">请先选择一个周期</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">时间线</h1>
        <CycleSelector />
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">全部人员</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.displayName}</option>
          ))}
        </select>
      </div>

      {/* 甘特图 */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* 时间轴头部 - 按周显示 */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-48 shrink-0 px-3 py-2 text-xs font-medium text-gray-500">
            待办事项
          </div>
          <div className="relative flex-1" style={{ minWidth: totalWeeks * 80 }}>
            {/* 周标记 */}
            {Array.from({ length: totalWeeks + 1 }).map((_, i) => {
              const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
              const leftPercent = (i / totalWeeks) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-gray-200"
                  style={{ left: `${leftPercent}%` }}
                >
                  <span className="relative -left-1 top-1 whitespace-nowrap text-[9px] text-gray-400">
                    {formatDate(weekStart.toISOString()).slice(5)}
                  </span>
                </div>
              );
            })}
            {/* 头部占位 */}
            <div className="h-6" />
          </div>
        </div>

        {/* 内容区域 */}
        {groupedTodos.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            该周期下暂无待办事项
          </div>
        ) : (
          groupedTodos.map((group) => (
            <div key={group.objectiveId}>
              {/* O 分组标题 */}
              <div className="flex items-center border-b border-gray-100 bg-blue-50/50">
                <div className="w-48 shrink-0 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {group.objectiveTitle}
                </div>
                <div className="flex-1" />
              </div>

              {/* 每行一个 Todo */}
              {group.todos.map((todo) => {
                const barStyle = getBarStyle(todo);
                const leftPercent = getDatePosition(todo.plannedStart);
                const rightPercent = getDatePosition(todo.plannedEnd);
                const widthPercent = Math.max(rightPercent - leftPercent, 1);

                return (
                  <div
                    key={todo.id}
                    className="group/item flex items-center border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    {/* 左侧标签 */}
                    <div className="w-48 shrink-0 px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-xs text-gray-700">{todo.title}</span>
                      </div>
                      <div className="mt-0.5 text-[9px] text-gray-400">
                        {todo.krTitle} · {getUserDisplayName(todo.createdBy)}
                      </div>
                    </div>

                    {/* 右侧甘特条 */}
                    <div className="relative flex-1 py-2" style={{ minWidth: totalWeeks * 80 }}>
                      {/* 今日线 */}
                      {todayPosition >= 0 && todayPosition <= 100 && (
                        <div
                          className="absolute bottom-0 top-0 w-px bg-red-300"
                          style={{ left: `${todayPosition}%` }}
                        />
                      )}

                      {/* Todo 条 */}
                      <div
                        className="group/bar relative"
                        style={{
                          position: 'absolute',
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          top: '4px',
                          height: '24px',
                        }}
                      >
                        <div className={`h-full w-full rounded ${barStyle.bg}`}>
                          <div
                            className={`h-full rounded transition-all ${barStyle.fill}`}
                            style={{ width: `${todo.progress}%` }}
                          />
                        </div>
                        {/* hover tooltip */}
                        <div className="pointer-events-none absolute bottom-full left-0 z-10 mb-1 hidden min-w-max rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover/bar:block">
                          <div className="font-medium">{todo.title}</div>
                          <div className="mt-0.5 text-gray-300">
                            {getUserDisplayName(todo.createdBy)} · 进度 {todo.progress}%
                          </div>
                          <div className="text-gray-400">
                            {formatDate(todo.plannedStart)} ~ {formatDate(todo.plannedEnd)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-5 rounded bg-gray-400" />
          未开始
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-5 rounded bg-blue-500" />
          进行中
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-5 rounded bg-green-500" />
          已完成
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-5 rounded bg-red-500" />
          逾期
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-px bg-red-300" />
          今日
        </div>
      </div>
    </div>
  );
}
