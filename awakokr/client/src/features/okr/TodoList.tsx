import { useEffect, useState } from 'react';
import { Todo } from '../../types';
import { useTodoStore } from '../../stores/todoStore';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../stores/userStore';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

interface TodoListProps {
  krId: string;
  krCreatedBy: string;
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

export function TodoList({ krId, krCreatedBy }: TodoListProps) {
  const { todos, fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoStore();
  const { user, isAdmin } = useAuth();
  const { users, fetchUsers } = useUserStore();
  const todoList = todos[krId] || [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 表单状态
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPlannedStart, setFormPlannedStart] = useState('');
  const [formPlannedEnd, setFormPlannedEnd] = useState('');
  const [formStatus, setFormStatus] = useState<Todo['status']>('not_started');
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  useEffect(() => {
    fetchTodos(krId).catch(console.error);
  }, [krId, fetchTodos]);

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormPlannedStart('');
    setFormPlannedEnd('');
    setFormStatus('not_started');
    setFormProgress(0);
    setError('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (todo: Todo) => {
    setFormTitle(todo.title);
    setFormDesc(todo.description);
    setFormPlannedStart(formatDate(todo.plannedStart));
    setFormPlannedEnd(formatDate(todo.plannedEnd));
    setFormStatus(todo.status);
    setFormProgress(todo.progress);
    setError('');
    setEditingTodo(todo);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formPlannedStart || !formPlannedEnd) {
      setError('请填写必填字段：标题、开始日期、结束日期');
      return;
    }
    setSubmitting(true);
    try {
      await createTodo({
        krId,
        title: formTitle.trim(),
        description: formDesc.trim(),
        plannedStart: formPlannedStart,
        plannedEnd: formPlannedEnd,
      });
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('创建Todo失败:', err);
      setError('创建Todo失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingTodo) return;
    if (!formTitle.trim() || !formPlannedStart || !formPlannedEnd) {
      setError('请填写必填字段：标题、开始日期、结束日期');
      return;
    }
    setSubmitting(true);
    try {
      await updateTodo(editingTodo.id, krId, {
        title: formTitle.trim(),
        description: formDesc.trim(),
        status: formStatus,
        progress: formProgress,
        plannedStart: formPlannedStart,
        plannedEnd: formPlannedEnd,
      });
      setEditingTodo(null);
      resetForm();
    } catch (err) {
      console.error('更新Todo失败:', err);
      setError('更新Todo失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (todo: Todo) => {
    const nextStatus = STATUS_NEXT[todo.status];
    const updateData: Partial<Todo> = { status: nextStatus };
    if (nextStatus === 'completed') {
      updateData.progress = 100;
    } else if (nextStatus === 'not_started' && todo.status === 'completed') {
      updateData.progress = 0;
    }
    try {
      await updateTodo(todo.id, krId, updateData);
    } catch (err) {
      console.error('状态切换失败:', err);
    }
  };

  const handleProgressChange = async (todo: Todo, progress: number) => {
    try {
      const updateData: Partial<Todo> = { progress };
      // 如果进度设为100，自动标记完成
      if (progress === 100 && todo.status !== 'completed') {
        updateData.status = 'completed';
      } else if (progress < 100 && todo.status === 'completed') {
        updateData.status = 'in_progress';
      }
      await updateTodo(todo.id, krId, updateData);
    } catch (err) {
      console.error('进度更新失败:', err);
    }
  };

  const handleDelete = async () => {
    if (!deletingTodo) return;
    setSubmitting(true);
    try {
      await deleteTodo(deletingTodo.id, krId);
      setDeletingTodo(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除Todo失败';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canModify = (todo: Todo) => isAdmin || user?.id === todo.createdBy || user?.id === krCreatedBy;

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  return (
    <div className="space-y-1.5 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">待办事项</span>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建
        </button>
      </div>

      {todoList.length === 0 ? (
        <p className="py-2 text-center text-[10px] text-gray-400">暂无待办事项</p>
      ) : (
        <div className="space-y-1">
          {todoList.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-2 rounded-md border border-gray-50 bg-gray-50/50 px-2.5 py-1.5 transition-colors hover:border-gray-100 hover:bg-gray-50"
            >
              {/* 状态标签（点击切换） */}
              <button
                onClick={() => handleStatusToggle(todo)}
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium transition-colors ${STATUS_COLORS[todo.status]}`}
                title={`点击切换为${STATUS_LABELS[STATUS_NEXT[todo.status]]}`}
              >
                {STATUS_LABELS[todo.status]}
              </button>

              {/* 标题 + 逾期标记 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs text-gray-700">{todo.title}</span>
                  {isOverdue(todo) && (
                    <span className="shrink-0 rounded bg-red-100 px-1 py-0.5 text-[9px] font-medium text-red-600">
                      逾期
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[9px] text-gray-400">
                    {formatDate(todo.plannedStart)} ~ {formatDate(todo.plannedEnd)}
                  </span>
                  <span className="text-[9px] text-gray-400">{getUserDisplayName(todo.createdBy)}</span>
                </div>
              </div>

              {/* 进度条 + 滑块 */}
              <div className="flex shrink-0 items-center gap-1.5">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={todo.progress}
                  onChange={(e) => handleProgressChange(todo, Number(e.target.value))}
                  className="h-1 w-14 cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                />
                <span className="w-7 text-right text-[9px] text-gray-500">{todo.progress}%</span>
              </div>

              {/* 操作按钮 */}
              {canModify(todo) && (
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(todo)}
                    className="rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    title="编辑"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletingTodo(todo)}
                    className="rounded p-0.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="删除"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 创建 Todo Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="新建待办事项"
      >
        <div className="space-y-4">
          <Input
            label="标题"
            placeholder="输入待办标题"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
              placeholder="输入描述（可选）"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="开始日期"
              type="date"
              value={formPlannedStart}
              onChange={(e) => setFormPlannedStart(e.target.value)}
            />
            <Input
              label="结束日期"
              type="date"
              value={formPlannedEnd}
              onChange={(e) => setFormPlannedEnd(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleCreate} loading={submitting} disabled={!formTitle.trim() || !formPlannedStart || !formPlannedEnd}>
              创建
            </Button>
          </div>
        </div>
      </Modal>

      {/* 编辑 Todo Modal */}
      <Modal
        open={!!editingTodo}
        onClose={() => { setEditingTodo(null); resetForm(); }}
        title="编辑待办事项"
      >
        <div className="space-y-4">
          <Input
            label="标题"
            placeholder="输入待办标题"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
              placeholder="输入描述（可选）"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="开始日期"
              type="date"
              value={formPlannedStart}
              onChange={(e) => setFormPlannedStart(e.target.value)}
            />
            <Input
              label="结束日期"
              type="date"
              value={formPlannedEnd}
              onChange={(e) => setFormPlannedEnd(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="w-full">
              <label className="mb-1 block text-sm font-medium text-gray-700">状态</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as Todo['status'])}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="not_started">未开始</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <Input
              label="进度 (%)"
              type="number"
              min={0}
              max={100}
              value={String(formProgress)}
              onChange={(e) => setFormProgress(Number(e.target.value))}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setEditingTodo(null); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleUpdate} loading={submitting} disabled={!formTitle.trim() || !formPlannedStart || !formPlannedEnd}>
              保存
            </Button>
          </div>
        </div>
      </Modal>

      {/* 删除确认 Modal */}
      <Modal
        open={!!deletingTodo}
        onClose={() => { setDeletingTodo(null); setError(''); }}
        title="确认删除"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            确定要删除待办事项「{deletingTodo?.title}」吗？此操作不可恢复。
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setDeletingTodo(null); setError(''); }}>
              取消
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={submitting}>
              删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
