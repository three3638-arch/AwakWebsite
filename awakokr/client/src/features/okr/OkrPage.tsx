import { useEffect, useState, useCallback } from 'react';
import { useCycleStore } from '../../stores/cycleStore';
import { useObjectiveStore } from '../../stores/objectiveStore';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../stores/userStore';
import { ObjectiveWithCompletion } from '../../types';
import { CycleSelector } from '../../components/CycleSelector';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Loading } from '../../components/Loading';
import { AlignmentView } from './AlignmentView';
import { KrColumn } from './KrColumn';
import { TodoColumn } from './TodoColumn';

type ViewTab = 'list' | 'alignment';

export function OkrPage() {
  const { currentCycle } = useCycleStore();
  const { objectives, loading, fetchObjectives, createObjective, updateObjective, deleteObjective, getObjectiveTree } = useObjectiveStore();
  const { user, isAdmin } = useAuth();
  const { users, fetchUsers } = useUserStore();

  const [viewTab, setViewTab] = useState<ViewTab>('list');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
  const [selectedKrId, setSelectedKrId] = useState<string | null>(null);

  // Objective CRUD
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingObjective, setEditingObjective] = useState<ObjectiveWithCompletion | null>(null);
  const [deletingObjective, setDeletingObjective] = useState<ObjectiveWithCompletion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formParentId, setFormParentId] = useState('');

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, [users.length, fetchUsers]);

  useEffect(() => {
    if (currentCycle) fetchObjectives(currentCycle.id);
  }, [currentCycle, fetchObjectives]);

  // Reset selections when cycle changes
  useEffect(() => {
    setSelectedObjectiveId(null);
    setSelectedKrId(null);
  }, [currentCycle?.id]);

  const resetForm = useCallback(() => {
    setFormTitle('');
    setFormDesc('');
    setFormParentId('');
  }, []);

  const openCreateModal = () => { resetForm(); setShowCreateModal(true); };

  const openEditModal = (obj: ObjectiveWithCompletion) => {
    setFormTitle(obj.title);
    setFormDesc(obj.description);
    setFormParentId(obj.parentObjectiveId || '');
    setEditingObjective(obj);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || !currentCycle) return;
    setSubmitting(true);
    try {
      if (editingObjective) {
        await updateObjective(editingObjective.id, {
          title: formTitle.trim(),
          description: formDesc.trim(),
          parentObjectiveId: formParentId || null,
        });
      } else {
        await createObjective({
          cycleId: currentCycle.id,
          title: formTitle.trim(),
          description: formDesc.trim(),
          parentObjectiveId: formParentId || undefined,
        });
      }
      setShowCreateModal(false);
      setEditingObjective(null);
      resetForm();
    } catch (err) {
      console.error('保存目标失败:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingObjective) return;
    setSubmitting(true);
    try {
      await deleteObjective(deletingObjective.id);
      if (selectedObjectiveId === deletingObjective.id) {
        setSelectedObjectiveId(null);
        setSelectedKrId(null);
      }
      setDeletingObjective(null);
    } catch (err) {
      console.error('删除目标失败:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered objectives by person
  const filteredObjectives = selectedUserId
    ? objectives.filter((o) => o.createdBy === selectedUserId)
    : objectives;

  // Reset selection if filtered out
  useEffect(() => {
    if (selectedObjectiveId && !filteredObjectives.some((o) => o.id === selectedObjectiveId)) {
      setSelectedObjectiveId(null);
      setSelectedKrId(null);
    }
  }, [selectedUserId, filteredObjectives, selectedObjectiveId]);

  const parentOptions = objectives.filter((o) => o.id !== editingObjective?.id);

  const getUserDisplayName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.displayName || userId.slice(0, 6);
  };

  const canModify = (obj: ObjectiveWithCompletion) => isAdmin || user?.id === obj.createdBy;

  const CompletionBar = ({ value }: { value: number }) => {
    const pct = Math.round(value * 100);
    let cc = 'bg-gray-300';
    if (pct >= 70) cc = 'bg-green-500';
    else if (pct >= 40) cc = 'bg-blue-500';
    else if (pct > 0) cc = 'bg-amber-500';
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full rounded-full transition-all ${cc}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] font-medium text-gray-500">{pct}%</span>
      </div>
    );
  };

  const AlignmentTag = ({ parentId }: { parentId: string | null }) => {
    if (!parentId) return null;
    const parent = objectives.find((o) => o.id === parentId);
    const label = parent ? (parent.title.length > 10 ? parent.title.slice(0, 10) + '…' : parent.title) : parentId.slice(0, 6);
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-600">
        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
        对齐: {label}
      </span>
    );
  };

  if (!currentCycle) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-400">
        <p>请先选择或创建一个周期</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">OKR 视图</h1>
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
        <Button onClick={openCreateModal}>
          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建目标
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setViewTab('list')}
          className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${viewTab === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >列表视图</button>
        <button
          onClick={() => setViewTab('alignment')}
          className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${viewTab === 'alignment' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >对齐视图</button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16"><Loading text="加载目标中..." /></div>
      ) : viewTab === 'list' ? (
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Left column - Objectives */}
          <div className="flex w-1/4 min-w-0 flex-col border-r border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
              <span className="text-xs font-semibold text-gray-500">目标 ({filteredObjectives.length})</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredObjectives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-xs">暂无目标</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredObjectives.map((obj) => {
                    const isSelected = selectedObjectiveId === obj.id;
                    return (
                      <div
                        key={obj.id}
                        onClick={() => {
                          setSelectedObjectiveId(isSelected ? null : obj.id);
                          setSelectedKrId(null);
                        }}
                        className={`group cursor-pointer rounded-lg border p-2.5 transition-all ${
                          isSelected
                            ? 'border-blue-200 bg-blue-50/80 shadow-sm'
                            : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{obj.title}</h3>
                          {canModify(obj) && (
                            <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                              <button onClick={(e) => { e.stopPropagation(); openEditModal(obj); }} className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="编辑">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDeletingObjective(obj); }} className="rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500" title="删除">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">
                            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {getUserDisplayName(obj.createdBy)}
                          </span>
                          <AlignmentTag parentId={obj.parentObjectiveId} />
                        </div>
                        <div className="mt-1.5"><CompletionBar value={obj.completion} /></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Middle column - Key Results */}
          <div className="flex w-[37.5%] min-w-0 flex-col border-r border-gray-200">
            <KrColumn
              objectiveId={selectedObjectiveId}
              selectedKrId={selectedKrId}
              onSelectKr={setSelectedKrId}
            />
          </div>

          {/* Right column - Todos */}
          <div className="flex min-w-0 flex-1 flex-col">
            <TodoColumn
              krId={selectedKrId}
              objectiveId={selectedObjectiveId}
            />
          </div>
        </div>
      ) : (
        <Card className="flex-1 overflow-auto">
          <AlignmentView tree={getObjectiveTree(currentCycle.id)} />
        </Card>
      )}

      {/* Create/Edit Objective Modal */}
      <Modal
        open={showCreateModal || !!editingObjective}
        onClose={() => { setShowCreateModal(false); setEditingObjective(null); resetForm(); }}
        title={editingObjective ? '编辑目标' : '新建目标'}
      >
        <div className="space-y-4">
          <Input label="标题" placeholder="输入目标标题" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
            <textarea className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" rows={3} placeholder="输入目标描述（可选）" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          </div>
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-gray-700">对齐父级目标</label>
            <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value={formParentId} onChange={(e) => setFormParentId(e.target.value)}>
              <option value="">无（顶层目标）</option>
              {parentOptions.map((o) => (<option key={o.id} value={o.id}>{o.title}</option>))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); setEditingObjective(null); resetForm(); }}>取消</Button>
            <Button onClick={handleSubmit} loading={submitting} disabled={!formTitle.trim()}>{editingObjective ? '保存' : '创建'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Objective Modal */}
      <Modal open={!!deletingObjective} onClose={() => setDeletingObjective(null)} title="确认删除">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">确定要删除目标「{deletingObjective?.title}」吗？此操作不可恢复。</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingObjective(null)}>取消</Button>
            <Button variant="danger" onClick={handleDelete} loading={submitting}>删除</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
