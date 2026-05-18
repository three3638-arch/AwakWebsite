import { useEffect, useState } from 'react';
import { KeyResult } from '../../types';
import { useKrStore } from '../../stores/krStore';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../stores/userStore';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { KrHistoryPanel } from './KrHistoryPanel';

interface KrColumnProps {
  objectiveId: string | null;
  selectedKrId: string | null;
  onSelectKr: (krId: string | null) => void;
}

export function KrColumn({ objectiveId, selectedKrId, onSelectKr }: KrColumnProps) {
  const { keyResults, fetchKeyResults, createKeyResult, updateKeyResult, deleteKeyResult } = useKrStore();
  const { user, isAdmin } = useAuth();
  const { users, fetchUsers } = useUserStore();
  const krs = objectiveId ? (keyResults[objectiveId] || []) : [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKr, setEditingKr] = useState<KeyResult | null>(null);
  const [deletingKr, setDeletingKr] = useState<KeyResult | null>(null);
  const [scoringKr, setScoringKr] = useState<KeyResult | null>(null);
  const [historyKrId, setHistoryKrId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formTargetValue, setFormTargetValue] = useState('');
  const [formChangeNote, setFormChangeNote] = useState('');
  const [formScore, setFormScore] = useState('');

  useEffect(() => { if (users.length === 0) fetchUsers(); }, [users.length, fetchUsers]);

  useEffect(() => {
    if (objectiveId) fetchKeyResults(objectiveId).catch(console.error);
  }, [objectiveId, fetchKeyResults]);

  // Reset selection if KR is no longer in the list
  useEffect(() => {
    if (selectedKrId && objectiveId && !krs.some((kr) => kr.id === selectedKrId)) {
      onSelectKr(null);
    }
  }, [selectedKrId, objectiveId, krs, onSelectKr]);

  const totalWeight = krs.reduce((sum, kr) => sum + kr.weight, 0);

  const resetForm = () => {
    setFormTitle(''); setFormDesc(''); setFormWeight(''); setFormTargetValue('');
    setFormChangeNote(''); setFormScore(''); setError('');
  };

  const openCreateModal = () => { resetForm(); setShowCreateModal(true); };

  const openEditModal = (kr: KeyResult) => {
    setFormTitle(kr.title); setFormDesc(kr.description); setFormWeight(String(kr.weight));
    setFormTargetValue(String(kr.targetValue)); setFormChangeNote(''); setFormScore(''); setError('');
    setEditingKr(kr);
  };

  const openScoreModal = (kr: KeyResult) => {
    setFormScore(kr.score !== null ? String(kr.score) : ''); setFormChangeNote(''); setError('');
    setScoringKr(kr);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formWeight || !formTargetValue || !objectiveId) {
      setError('请填写必填字段：标题、权重、目标值'); return;
    }
    setSubmitting(true);
    try {
      await createKeyResult({
        objectiveId, title: formTitle.trim(), description: formDesc.trim(),
        weight: Number(formWeight), targetValue: Number(formTargetValue),
      });
      setShowCreateModal(false); resetForm();
    } catch { setError('创建KR失败'); } finally { setSubmitting(false); }
  };

  const handleUpdate = async () => {
    if (!editingKr || !objectiveId) return;
    if (!formTitle.trim() || !formWeight || !formTargetValue) {
      setError('请填写必填字段：标题、权重、目标值'); return;
    }
    setSubmitting(true);
    try {
      await updateKeyResult(editingKr.id, objectiveId, {
        title: formTitle.trim(), description: formDesc.trim(),
        weight: Number(formWeight), targetValue: Number(formTargetValue), changeNote: formChangeNote.trim(),
      });
      setEditingKr(null); resetForm();
    } catch { setError('更新KR失败'); } finally { setSubmitting(false); }
  };

  const handleScore = async () => {
    if (!scoringKr || !objectiveId) return;
    const s = Number(formScore);
    if (isNaN(s) || s < 0 || s > 1) { setError('评分须为 0~1 之间的小数'); return; }
    setSubmitting(true);
    try {
      await updateKeyResult(scoringKr.id, objectiveId, {
        score: s, changeNote: formChangeNote.trim() || `评分 ${s}`,
      });
      setScoringKr(null); resetForm();
    } catch { setError('评分失败'); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deletingKr || !objectiveId) return;
    setSubmitting(true);
    try {
      await deleteKeyResult(deletingKr.id, objectiveId);
      if (selectedKrId === deletingKr.id) onSelectKr(null);
      setDeletingKr(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '删除KR失败');
    } finally { setSubmitting(false); }
  };

  const canModify = (kr: KeyResult) => isAdmin || user?.id === kr.createdBy;

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  const ProgressRow = ({ kr }: { kr: KeyResult }) => {
    const pct = kr.targetValue > 0 ? Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100)) : 0;
    let cc = 'bg-gray-300';
    if (pct >= 70) cc = 'bg-green-500';
    else if (pct >= 40) cc = 'bg-blue-500';
    else if (pct > 0) cc = 'bg-amber-500';
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full rounded-full transition-all ${cc}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-gray-500">{kr.currentValue}/{kr.targetValue} ({pct}%)</span>
      </div>
    );
  };

  // Placeholder when no objective selected
  if (!objectiveId) {
    return (
      <>
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <span className="text-xs font-semibold text-gray-500">关键结果</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
          <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-xs">请选择一个目标</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">关键结果 ({krs.length})</span>
          <span className={`text-[10px] font-bold ${totalWeight !== 100 ? 'text-amber-500' : 'text-green-600'}`}>权重 {totalWeight}%</span>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          新建 KR
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {krs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-xs">暂无关键结果</p>
            <p className="mt-1 text-[10px]">点击上方按钮创建</p>
          </div>
        ) : (
          <div className="space-y-1">
            {krs.map((kr) => {
              const isSelected = selectedKrId === kr.id;
              return (
                <div key={kr.id}>
                  <div
                    onClick={() => onSelectKr(isSelected ? null : kr.id)}
                    className={`group cursor-pointer rounded-lg border p-2.5 transition-all ${
                      isSelected ? 'border-blue-200 bg-blue-50/80 shadow-sm' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-medium text-gray-800">{kr.title}</span>
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">权重 {kr.weight}%</span>
                          {kr.score !== null && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">评分 {kr.score}</span>
                          )}
                          <span className="text-[10px] text-gray-400">v{kr.version}</span>
                        </div>
                        {kr.description && <p className="mt-0.5 truncate text-xs text-gray-400">{kr.description}</p>}
                        <div className="mt-1.5 flex items-center gap-3">
                          <ProgressRow kr={kr} />
                          <span className="text-[10px] text-gray-400">{getUserDisplayName(kr.createdBy)}</span>
                        </div>
                      </div>
                      {/* Operations on hover */}
                      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); openScoreModal(kr); }} className="rounded p-1 text-gray-400 hover:bg-green-50 hover:text-green-500" title="评分">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setHistoryKrId(historyKrId === kr.id ? null : kr.id); }} className="rounded p-1 text-gray-400 hover:bg-purple-50 hover:text-purple-500" title="历史版本">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        {canModify(kr) && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); openEditModal(kr); }} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="编辑">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeletingKr(kr); }} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500" title="删除">
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* History panel */}
                  {historyKrId === kr.id && (
                    <div className="mx-2 mb-1 rounded-b-lg border border-t-0 border-gray-200 bg-gray-50/50 p-3">
                      <KrHistoryPanel krId={kr.id} objectiveId={objectiveId} onClose={() => setHistoryKrId(null)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create KR Modal */}
      <Modal open={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm(); }} title="新建关键结果">
        <div className="space-y-4">
          <Input label="标题" placeholder="输入KR标题" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={2} placeholder="输入KR描述（可选）" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="权重 (%)" type="number" placeholder="例如：30" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} />
            <Input label="目标值" type="number" placeholder="例如：100" value={formTargetValue} onChange={(e) => setFormTargetValue(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>取消</Button>
            <Button onClick={handleCreate} loading={submitting} disabled={!formTitle.trim() || !formWeight || !formTargetValue}>创建</Button>
          </div>
        </div>
      </Modal>

      {/* Edit KR Modal */}
      <Modal open={!!editingKr} onClose={() => { setEditingKr(null); resetForm(); }} title="编辑关键结果">
        <div className="space-y-4">
          <Input label="标题" placeholder="输入KR标题" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={2} placeholder="输入KR描述（可选）" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="权重 (%)" type="number" placeholder="例如：30" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} />
            <Input label="目标值" type="number" placeholder="例如：100" value={formTargetValue} onChange={(e) => setFormTargetValue(e.target.value)} />
          </div>
          <Input label="修改说明（可选）" placeholder="描述本次修改的内容" value={formChangeNote} onChange={(e) => setFormChangeNote(e.target.value)} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setEditingKr(null); resetForm(); }}>取消</Button>
            <Button onClick={handleUpdate} loading={submitting} disabled={!formTitle.trim() || !formWeight || !formTargetValue}>保存</Button>
          </div>
        </div>
      </Modal>

      {/* Score Modal */}
      <Modal open={!!scoringKr} onClose={() => { setScoringKr(null); resetForm(); }} title="评分">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">为「{scoringKr?.title}」评分</p>
          <Input label="评分 (0~1)" type="number" step="0.1" min="0" max="1" placeholder="例如：0.7" value={formScore} onChange={(e) => setFormScore(e.target.value)} />
          <Input label="修改说明（可选）" placeholder="描述评分理由" value={formChangeNote} onChange={(e) => setFormChangeNote(e.target.value)} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setScoringKr(null); resetForm(); }}>取消</Button>
            <Button onClick={handleScore} loading={submitting}>确认评分</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deletingKr} onClose={() => { setDeletingKr(null); setError(''); }} title="确认删除">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">确定要删除关键结果「{deletingKr?.title}」吗？此操作不可恢复。</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setDeletingKr(null); setError(''); }}>取消</Button>
            <Button variant="danger" onClick={handleDelete} loading={submitting}>删除</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
