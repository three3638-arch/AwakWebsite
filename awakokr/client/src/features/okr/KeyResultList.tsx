import { useEffect, useState } from 'react';
import { KeyResult } from '../../types';
import { useKrStore } from '../../stores/krStore';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../stores/userStore';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { KrHistoryPanel } from './KrHistoryPanel';
import { TodoList } from './TodoList';

interface KeyResultListProps {
  objectiveId: string;
}

export function KeyResultList({ objectiveId }: KeyResultListProps) {
  const { keyResults, fetchKeyResults, createKeyResult, updateKeyResult, deleteKeyResult } = useKrStore();
  const { user, isAdmin } = useAuth();
  const { users, fetchUsers } = useUserStore();
  const krs = keyResults[objectiveId] || [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKr, setEditingKr] = useState<KeyResult | null>(null);
  const [deletingKr, setDeletingKr] = useState<KeyResult | null>(null);
  const [scoringKr, setScoringKr] = useState<KeyResult | null>(null);
  const [historyKrId, setHistoryKrId] = useState<string | null>(null);
  const [expandedKrId, setExpandedKrId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 表单状态
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formTargetValue, setFormTargetValue] = useState('');
  const [formChangeNote, setFormChangeNote] = useState('');
  const [formScore, setFormScore] = useState('');

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  useEffect(() => {
    fetchKeyResults(objectiveId).catch(console.error);
  }, [objectiveId, fetchKeyResults]);

  const totalWeight = krs.reduce((sum, kr) => sum + kr.weight, 0);
  const weightWarning = totalWeight !== 100;

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormWeight('');
    setFormTargetValue('');
    setFormChangeNote('');
    setFormScore('');
    setError('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (kr: KeyResult) => {
    setFormTitle(kr.title);
    setFormDesc(kr.description);
    setFormWeight(String(kr.weight));
    setFormTargetValue(String(kr.targetValue));
    setFormChangeNote('');
    setFormScore('');
    setError('');
    setEditingKr(kr);
  };

  const openScoreModal = (kr: KeyResult) => {
    setFormScore(kr.score !== null ? String(kr.score) : '');
    setFormChangeNote('');
    setError('');
    setScoringKr(kr);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formWeight || !formTargetValue) {
      setError('请填写必填字段：标题、权重、目标值');
      return;
    }
    setSubmitting(true);
    try {
      await createKeyResult({
        objectiveId,
        title: formTitle.trim(),
        description: formDesc.trim(),
        weight: Number(formWeight),
        targetValue: Number(formTargetValue),
      });
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('创建KR失败:', err);
      setError('创建KR失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingKr) return;
    if (!formTitle.trim() || !formWeight || !formTargetValue) {
      setError('请填写必填字段：标题、权重、目标值');
      return;
    }
    setSubmitting(true);
    try {
      await updateKeyResult(editingKr.id, objectiveId, {
        title: formTitle.trim(),
        description: formDesc.trim(),
        weight: Number(formWeight),
        targetValue: Number(formTargetValue),
        changeNote: formChangeNote.trim(),
      });
      setEditingKr(null);
      resetForm();
    } catch (err) {
      console.error('更新KR失败:', err);
      setError('更新KR失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleScore = async () => {
    if (!scoringKr) return;
    const scoreNum = Number(formScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 1) {
      setError('评分须为 0~1 之间的小数');
      return;
    }
    setSubmitting(true);
    try {
      await updateKeyResult(scoringKr.id, objectiveId, {
        score: scoreNum,
        changeNote: formChangeNote.trim() || `评分 ${scoreNum}`,
      });
      setScoringKr(null);
      resetForm();
    } catch (err) {
      console.error('评分失败:', err);
      setError('评分失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingKr) return;
    setSubmitting(true);
    try {
      await deleteKeyResult(deletingKr.id, objectiveId);
      setDeletingKr(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '删除KR失败';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canModify = (kr: KeyResult) => isAdmin || user?.id === kr.createdBy;

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  /** 进度条 */
  const ProgressRow = ({ kr }: { kr: KeyResult }) => {
    const percent = kr.targetValue > 0 ? Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100)) : 0;
    let colorClass = 'bg-gray-300';
    if (percent >= 70) colorClass = 'bg-green-500';
    else if (percent >= 40) colorClass = 'bg-blue-500';
    else if (percent > 0) colorClass = 'bg-amber-500';

    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${colorClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">
          {kr.currentValue}/{kr.targetValue} ({percent}%)
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {/* 权重汇总 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">KR 权重总和</span>
          <span className={`text-xs font-bold ${weightWarning ? 'text-amber-500' : 'text-green-600'}`}>
            {totalWeight}%
          </span>
          {weightWarning && (
            <span className="text-xs text-amber-400">（建议调整至100%）</span>
          )}
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建 KR
        </button>
      </div>

      {/* KR 列表 */}
      {krs.length === 0 ? (
        <p className="py-3 text-center text-xs text-gray-400">暂无关键结果，点击上方按钮创建</p>
      ) : (
        <div className="space-y-2">
          {krs.map((kr) => (
            <div
              key={kr.id}
              className="group rounded-lg border border-gray-100 bg-white p-3 transition-colors hover:border-gray-200"
            >
              <div className="flex items-start justify-between gap-2">
                {/* 左侧内容 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedKrId(expandedKrId === kr.id ? null : kr.id)}
                      className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                      title={expandedKrId === kr.id ? '收起待办事项' : '展开待办事项'}
                    >
                      <svg
                        className={`h-3.5 w-3.5 transition-transform ${expandedKrId === kr.id ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-gray-800">{kr.title}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      权重 {kr.weight}%
                    </span>
                    {kr.score !== null && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
                        评分 {kr.score}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">v{kr.version}</span>
                  </div>
                  {kr.description && (
                    <p className="mt-0.5 text-xs text-gray-400">{kr.description}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-3">
                    <ProgressRow kr={kr} />
                    <span className="text-[10px] text-gray-400">
                      {getUserDisplayName(kr.createdBy)}
                    </span>
                  </div>
                </div>

                {/* 右侧操作按钮 */}
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openScoreModal(kr)}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-500"
                    title="评分"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setHistoryKrId(kr.id)}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-500"
                    title="历史版本"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {canModify(kr) && (
                    <>
                      <button
                        onClick={() => openEditModal(kr)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        title="编辑"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingKr(kr)}
                        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="删除"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 历史版本面板 */}
              {historyKrId === kr.id && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <KrHistoryPanel
                    krId={kr.id}
                    objectiveId={objectiveId}
                    onClose={() => setHistoryKrId(null)}
                  />
                </div>
              )}

              {/* Todo 列表 */}
              {expandedKrId === kr.id && (
                <div className="mt-3 border-t border-gray-100 pt-2 pl-2">
                  <TodoList krId={kr.id} krCreatedBy={kr.createdBy} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 创建 KR Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="新建关键结果"
      >
        <div className="space-y-4">
          <Input
            label="标题"
            placeholder="输入KR标题"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
              placeholder="输入KR描述（可选）"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="权重 (%)"
              type="number"
              placeholder="例如：30"
              value={formWeight}
              onChange={(e) => setFormWeight(e.target.value)}
            />
            <Input
              label="目标值"
              type="number"
              placeholder="例如：100"
              value={formTargetValue}
              onChange={(e) => setFormTargetValue(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleCreate} loading={submitting} disabled={!formTitle.trim() || !formWeight || !formTargetValue}>
              创建
            </Button>
          </div>
        </div>
      </Modal>

      {/* 编辑 KR Modal */}
      <Modal
        open={!!editingKr}
        onClose={() => { setEditingKr(null); resetForm(); }}
        title="编辑关键结果"
      >
        <div className="space-y-4">
          <Input
            label="标题"
            placeholder="输入KR标题"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
              placeholder="输入KR描述（可选）"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="权重 (%)"
              type="number"
              placeholder="例如：30"
              value={formWeight}
              onChange={(e) => setFormWeight(e.target.value)}
            />
            <Input
              label="目标值"
              type="number"
              placeholder="例如：100"
              value={formTargetValue}
              onChange={(e) => setFormTargetValue(e.target.value)}
            />
          </div>
          <Input
            label="修改说明（可选）"
            placeholder="描述本次修改的内容"
            value={formChangeNote}
            onChange={(e) => setFormChangeNote(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setEditingKr(null); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleUpdate} loading={submitting} disabled={!formTitle.trim() || !formWeight || !formTargetValue}>
              保存
            </Button>
          </div>
        </div>
      </Modal>

      {/* 评分 Modal */}
      <Modal
        open={!!scoringKr}
        onClose={() => { setScoringKr(null); resetForm(); }}
        title="评分"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            为「{scoringKr?.title}」评分
          </p>
          <Input
            label="评分 (0~1)"
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="例如：0.7"
            value={formScore}
            onChange={(e) => setFormScore(e.target.value)}
          />
          <Input
            label="修改说明（可选）"
            placeholder="描述评分理由"
            value={formChangeNote}
            onChange={(e) => setFormChangeNote(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setScoringKr(null); resetForm(); }}>
              取消
            </Button>
            <Button onClick={handleScore} loading={submitting}>
              确认评分
            </Button>
          </div>
        </div>
      </Modal>

      {/* 删除确认 Modal */}
      <Modal
        open={!!deletingKr}
        onClose={() => { setDeletingKr(null); setError(''); }}
        title="确认删除"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            确定要删除关键结果「{deletingKr?.title}」吗？此操作不可恢复。
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setDeletingKr(null); setError(''); }}>
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
