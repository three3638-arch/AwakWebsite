import { useEffect, useState, useMemo } from 'react';
import { Todo } from '../../types';
import { useTodoStore } from '../../stores/todoStore';
import { useKrStore } from '../../stores/krStore';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../stores/userStore';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

interface TodoColumnProps {
  krId: string | null;
  objectiveId: string | null;
}

const STATUS_LABELS: Record<Todo['status'], string> = {
  not_started: '未开始',
  in_progress: '进行中',
  completed: '已完成',
};

const STATUS_COLORS: Record<Todo['status'], string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const STATUS_NEXT: Record<Todo['status'], Todo['status']> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
};

function isOverdue(todo: Todo): boolean {
  if (todo.status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(todo.plannedEnd) < today;
}

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10);
}

export function TodoColumn({ krId, objectiveId }: TodoColumnProps) {
  const { todos, fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoStore();
  const { keyResults } = useKrStore();
  const { user, isAdmin } = useAuth();
  const { users, fetchUsers } = useUserStore();
  const todoList = krId ? (todos[krId] || []) : [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPlannedStart, setFormPlannedStart] = useState('');
  const [formPlannedEnd, setFormPlannedEnd] = useState('');
  const [formStatus, setFormStatus] = useState<Todo['status']>('not_started');
  const [formProgress, setFormProgress] = useState(0);

  // Get krCreatedBy from store
  const krCreatedBy = useMemo(() => {
    if (!krId || !objectiveId) return '';
    const krs = keyResults[objectiveId] || [];
    const kr = krs.find((k) => k.id === krId);
    return kr?.createdBy || '';
  }, [krId, objectiveId, keyResults]);

  useEffect(() => { if (users.length === 0) fetchUsers(); }, [users.length, fetchUsers]);

  useEffect(() => {
    if (krId) fetchTodos(krId).catch(console.error);
  }, [krId, fetchTodos]);

  const resetForm = () => {
    setFormTitle(''); setFormDesc(''); setFormPlannedStart(''); setFormPlannedEnd('');
    setFormStatus('not_started'); setFormProgress(0); setError('');
  };

  const openCreateModal = () => { resetForm(); setShowCreateModal(true); };

  const openEditModal = (todo: Todo) => {
    setFormTitle(todo.title); setFormDesc(todo.description);
    setFormPlannedStart(formatDate(todo.plannedStart)); setFormPlannedEnd(formatDate(todo.plannedEnd));
    setFormStatus(todo.status); setFormProgress(todo.progress); setError('');
    setEditingTodo(todo);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formPlannedStart || !formPlannedEnd || !krId) {
      setError('请填写必填字段：标题、开始日期、结束日期'); return;
    }
    setSubmitting(true);
    try {
      await createTodo({
        krId, title: formTitle.trim(), description: formDesc.trim(),
        plannedStart: formPlannedStart, plannedEnd: formPlannedEnd,
      });
      setShowCreateModal(false); resetForm();
    } catch { setError('创建Todo失败'); } finally { setSubmitting(false); }
  };

  const handleUpdate = async () => {
    if (!editingTodo || !krId) return;
    if (!formTitle.trim() || !formPlannedStart || !formPlannedEnd) {
      setError('请填写必填字段：标题、开始日期、结束日期'); return;
    }
    setSubmitting(true);
    try {
      await updateTodo(editingTodo.id, krId, {
        title: formTitle.trim(), description: formDesc.trim(), status: formStatus,
        progress: formProgress, plannedStart: formPlannedStart, plannedEnd: formPlannedEnd,
      });
      setEditingTodo(null); resetForm();
    } catch { setError('更新Todo失败'); } finally { setSubmitting(false); }
  };

  const handleStatusToggle = async (todo: Todo) => {
    if (!krId) return;
    const nextStatus = STATUS_NEXT[todo.status];
    const updateData: Partial<Todo> = { status: nextStatus };
    if (nextStatus === 'completed') updateData.progress = 100;
    else if (nextStatus === 'not_started' && todo.status === 'completed') updateData.progress = 0;
    try { await updateTodo(todo.id, krId, updateData); } catch (err) { console.error('状态切换失败:', err); }
  };

  const handleProgressChange = async (todo: Todo, progress: number) => {
    if (!krId) return;
    try {
      const updateData: Partial<Todo> = { progress };
      if (progress === 100 && todo.status !== 'completed') updateData.status = 'completed';
      else if (progress < 100 && todo.status === 'completed') updateData.status = 'in_progress';
      await updateTodo(todo.id, krId, updateData);
    } catch (err) { console.error('进度更新失败:', err); }
  };

  const handleDelete = async () => {
    if (!deletingTodo || !krId) return;
    setSubmitting(true);
    try {
      await deleteTodo(deletingTodo.id, krId);
      setDeletingTodo(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '删除Todo失败');
    } finally { setSubmitting(false); }
  };

  const canModify = (todo: Todo) => isAdmin || user?.id === todo.createdBy || user?.id === krCreatedBy;

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  // Placeholder when no KR selected
  if (!krId) {
    return (
      <>
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <span className="text-xs font-semibold text-gray-500">待办事项</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
          <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-xs">请选择一个关键结果</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <span className="text-xs font-semibold text-gray-500">待办事项 ({todoList.length})</span>
        <button onClick={openCreateModal} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          新建
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {todoList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-xs">暂无待办事项</p>
            <p className="mt-1 text-[10px]">点击上方按钮创建</p>
          </div>
        ) : (
          <div className="space-y-1">
            {todoList.map((todo) => (
              <div
                key={todo.id}
                className="group rounded-lg border border-transparent p-2.5 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  {/* Status toggle */}
                  <button
                    onClick={() => handleStatusToggle(todo)}
                    className={`mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors ${STATUS_COLORS[todo.status]}`}
                    title={`点击切换为${STATUS_LABELS[STATUS_NEXT[todo.status]]}`}
                  >
                    {STATUS_LABELS[todo.status]}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm text-gray-800">{todo.title}</span>
                      {isOverdue(todo) && (
                        <span className="shrink-0 rounded bg-red-100 px-1 py-0.5 text-[9px] font-medium text-red-600">逾期</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">{formatDate(todo.plannedStart)} ~ {formatDate(todo.plannedEnd)}</span>
                      <span className="text-[10px] text-gray-400">{getUserDisplayName(todo.createdBy)}</span>
                    </div>
                    {/* Progress slider */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <input
                        type="range" min={0} max={100} value={todo.progress}
                        onChange={(e) => handleProgressChange(todo, Number(e.target.value))}
                        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                      />
                      <span className="w-7 text-right text-[10px] text-gray-500">{todo.progress}%</span>
                    </div>
                  </div>

                  {/* Operations on hover */}
                  {canModify(todo) && (
                    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => openEditModal(todo)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="编辑">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeletingTodo(todo)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500" title="删除">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Todo Modal */}
      <Modal open={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm(); }} title="新建待办事项">
        <div className="space-y-4">
          <Input label="标题" placeholder="输入待办标题" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={2} placeholder="输入描述（可选）" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="开始日期" type="date" value={formPlannedStart} onChange={(e) => setFormPlannedStart(e.target.value)} />
            <Input label="结束日期" type="date" value={formPlannedEnd} onChange={(e) => setFormPlannedEnd(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>取消</Button>
            <Button onClick={handleCreate} loading={submitting} disabled={!formTitle.trim() || !formPlannedStart || !formPlannedEnd}>创建</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal open={!!editingTodo} onClose={() => { setEditingTodo(null); resetForm(); }} title="编辑待办事项">
        <div className="space-y-4">
          <Input label="标题" placeholder="输入待办标题" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={2} placeholder="输入描述（可选）" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="开始日期" type="date" value={formPlannedStart} onChange={(e) => setFormPlannedStart(e.target.value)} />
            <Input label="结束日期" type="date" value={formPlannedEnd} onChange={(e) => setFormPlannedEnd(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="w-full">
              <label className="mb-1 block text-sm font-medium text-gray-700">状态</label>
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as Todo['status'])} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="not_started">未开始</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <Input label="进度 (%)" type="number" min={0} max={100} value={String(formProgress)} onChange={(e) => setFormProgress(Number(e.target.value))} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setEditingTodo(null); resetForm(); }}>取消</Button>
            <Button onClick={handleUpdate} loading={submitting} disabled={!formTitle.trim() || !formPlannedStart || !formPlannedEnd}>保存</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Todo Modal */}
      <Modal open={!!deletingTodo} onClose={() => { setDeletingTodo(null); setError(''); }} title="确认删除">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">确定要删除待办事项「{deletingTodo?.title}」吗？此操作不可恢复。</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setDeletingTodo(null); setError(''); }}>取消</Button>
            <Button variant="danger" onClick={handleDelete} loading={submitting}>删除</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
