import { useEffect, useState, type FormEvent } from 'react';
import { useCycleStore } from '../../stores/cycleStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import type { Cycle } from '../../types';

/** 格式化日期显示 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/** 计算周期进度百分比 */
function cycleProgress(cycle: Cycle): number {
  const start = new Date(cycle.startDate).getTime();
  const end = new Date(cycle.endDate).getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

export function CycleManagement() {
  const { isAdmin } = useAuth();
  const { cycles, loading, fetchCycles, createCycle, updateCycle, deleteCycle } = useCycleStore();

  // 创建/编辑弹窗
  const [showModal, setShowModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [formName, setFormName] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 删除确认弹窗
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCycle, setDeletingCycle] = useState<Cycle | null>(null);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  // ─── 打开新建弹窗 ──────────────────────────
  function openCreateModal() {
    setEditingCycle(null);
    setFormName('');
    setFormStartDate('');
    setFormEndDate('');
    setError('');
    setShowModal(true);
  }

  // ─── 打开编辑弹窗 ──────────────────────────
  function openEditModal(cycle: Cycle) {
    setEditingCycle(cycle);
    setFormName(cycle.name);
    setFormStartDate(cycle.startDate.slice(0, 10));
    setFormEndDate(cycle.endDate.slice(0, 10));
    setError('');
    setShowModal(true);
  }

  // ─── 关闭弹窗 ──────────────────────────────
  function closeModal() {
    setShowModal(false);
    setEditingCycle(null);
    setError('');
  }

  // ─── 提交表单（新建 / 编辑） ──────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!formName.trim()) {
      setError('请输入周期名称');
      return;
    }
    if (!formStartDate || !formEndDate) {
      setError('请选择起止日期');
      return;
    }
    if (new Date(formEndDate) <= new Date(formStartDate)) {
      setError('结束日期必须晚于开始日期');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCycle) {
        await updateCycle(editingCycle.id, {
          name: formName.trim(),
          startDate: formStartDate,
          endDate: formEndDate,
        });
      } else {
        await createCycle({
          name: formName.trim(),
          startDate: formStartDate,
          endDate: formEndDate,
        });
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setSubmitting(false);
    }
  }

  // ─── 归档周期 ──────────────────────────────
  async function handleArchive(cycle: Cycle) {
    try {
      await updateCycle(cycle.id, { status: 'archived' });
    } catch (err) {
      console.error('归档失败:', err);
    }
  }

  // ─── 删除周期 ──────────────────────────────
  function confirmDelete(cycle: Cycle) {
    setDeletingCycle(cycle);
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    if (!deletingCycle) return;
    try {
      await deleteCycle(deletingCycle.id);
    } catch (err) {
      console.error('删除失败:', err);
    } finally {
      setShowDeleteModal(false);
      setDeletingCycle(null);
    }
  }

  if (loading && cycles.length === 0) {
    return <Loading text="加载周期数据..." />;
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">周期管理</h2>
        {isAdmin && (
          <Button onClick={openCreateModal}>
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建周期
          </Button>
        )}
      </div>

      {/* 周期列表 */}
      {cycles.length === 0 ? (
        <Card>
          <div className="py-8 text-center text-gray-400">暂无周期数据，请点击"新建周期"创建</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {cycles.map((cycle) => {
            const isArchived = cycle.status === 'archived';
            const progress = cycleProgress(cycle);

            return (
              <Card key={cycle.id} className={isArchived ? 'opacity-60' : ''}>
                <div className="flex items-start justify-between gap-4">
                  {/* 左侧：周期信息 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-base font-medium ${
                          isArchived ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {cycle.name}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          isArchived
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {isArchived ? '已归档' : '进行中'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}
                    </p>

                    {/* 进度条 */}
                    {!isArchived && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">进度 {progress}%</p>
                      </div>
                    )}
                  </div>

                  {/* 右侧：操作按钮（仅管理员可见） */}
                  {isAdmin && (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEditModal(cycle)}>
                        编辑
                      </Button>
                      {!isArchived && (
                        <Button variant="secondary" size="sm" onClick={() => handleArchive(cycle)}>
                          归档
                        </Button>
                      )}
                      <Button variant="danger" size="sm" onClick={() => confirmDelete(cycle)}>
                        删除
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 创建/编辑弹窗 */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingCycle ? '编辑周期' : '新建周期'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="周期名称"
            placeholder="例如：2026 Q2"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <Input
            label="开始日期"
            type="date"
            value={formStartDate}
            onChange={(e) => setFormStartDate(e.target.value)}
          />
          <Input
            label="结束日期"
            type="date"
            value={formEndDate}
            onChange={(e) => setFormEndDate(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={closeModal} type="button">
              取消
            </Button>
            <Button type="submit" loading={submitting}>
              {editingCycle ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="确认删除">
        <p className="text-sm text-gray-600">
          确定要删除周期「{deletingCycle?.name}」吗？此操作不可撤销，且仅可删除无关联目标的空周期。
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            确认删除
          </Button>
        </div>
      </Modal>
    </div>
  );
}
