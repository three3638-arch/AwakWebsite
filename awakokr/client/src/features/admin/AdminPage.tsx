import { useState, useEffect, type FormEvent } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore, type CreateUserData, type UpdateUserData } from '../../stores/userStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { CycleManagement } from './CycleManagement';
import type { User } from '../../types/index';

const TEAM_OPTIONS = [
  { value: 'boss', label: '老板' },
  { value: 'operation', label: '运营' },
  { value: 'hardware', label: '硬件产品与算法' },
  { value: 'software', label: '软件产品与开发' },
] as const;

const ROLE_OPTIONS = [
  { value: 'admin', label: '管理员' },
  { value: 'member', label: '普通成员' },
] as const;

function teamLabel(value: string): string {
  return TEAM_OPTIONS.find((t) => t.value === value)?.label ?? value;
}

function roleLabel(value: string): string {
  return ROLE_OPTIONS.find((r) => r.value === value)?.label ?? value;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// ─── 新建用户表单 ──────────────────────────────
function CreateUserModal({
  open,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserData) => void;
  loading: boolean;
}) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [team, setTeam] = useState('software');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ username, displayName, password, role, team });
  };

  const handleClose = () => {
    setUsername('');
    setDisplayName('');
    setPassword('');
    setRole('member');
    setTeam('software');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="新建用户">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="用户名" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input label="显示名称" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <Input
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="至少6位"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">角色</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">所属小组</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TEAM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button type="submit" loading={loading}>
            创建
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── 编辑用户表单 ──────────────────────────────
function EditUserModal({
  open,
  user,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateUserData) => void;
  loading: boolean;
}) {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [team, setTeam] = useState('software');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setRole(user.role);
      setTeam(user.team);
      setPassword('');
    }
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const data: UpdateUserData = { displayName, role, team };
    if (password) data.password = password;
    onSubmit(user.id, data);
  };

  return (
    <Modal open={open} onClose={onClose} title="编辑用户">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="用户名" value={user?.username ?? ''} disabled />
        <Input label="显示名称" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">角色</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">所属小组</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TEAM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="重置密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="留空则不修改"
          minLength={6}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" loading={loading}>
            保存
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── 删除确认 ──────────────────────────────────
function DeleteConfirmModal({
  open,
  user,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title="确认删除">
      <p className="text-sm text-gray-600">
        确定要删除用户 <span className="font-semibold text-gray-900">{user?.displayName}</span>（@{user?.username}）吗？此操作不可撤销。
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>
          删除
        </Button>
      </div>
    </Modal>
  );
}

// ─── 主页面 ────────────────────────────────────
export function AdminPage() {
  const currentUser = useAuthStore((s) => s.user);
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUserStore();

  // Tab 状态
  const [activeTab, setActiveTab] = useState<'users' | 'cycles'>('users');

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 非管理员
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">权限不足</h2>
        <p className="mt-1 text-sm text-gray-500">仅管理员可访问此页面</p>
      </div>
    );
  }

  const handleCreate = async (data: CreateUserData) => {
    setError('');
    setActionLoading(true);
    try {
      await createUser(data);
      setCreateOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateUserData) => {
    setError('');
    setActionLoading(true);
    try {
      await updateUser(id, data);
      setEditUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError('');
    setActionLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页头 + Tab 切换 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统管理</h1>
          <p className="mt-1 text-sm text-gray-500">管理用户账号、权限与周期</p>
        </div>
      </div>

      {/* Tab 栏 */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          用户管理
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'cycles'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          周期管理
        </button>
      </div>

      {/* Tab 内容 */}
      {activeTab === 'users' ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">用户列表</h2>
            <Button onClick={() => setCreateOpen(true)}>
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建用户
            </Button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* 用户列表 */}
          <Card padding={false}>
            {loading && users.length === 0 ? (
              <div className="py-16">
                <Loading text="加载中..." />
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-500">暂无用户数据</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-600">用户名</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">显示名称</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">角色</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">所属小组</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">创建时间</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">@{user.username}</td>
                        <td className="px-4 py-3 text-gray-700">{user.displayName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {roleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{teamLabel(user.team)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-1">
                            <Button size="sm" variant="secondary" onClick={() => setEditUser(user)}>
                              编辑
                            </Button>
                            {user.id !== currentUser?.id && (
                              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(user)}>
                                删除
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Modals */}
          <CreateUserModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onSubmit={handleCreate}
            loading={actionLoading}
          />
          <EditUserModal
            open={!!editUser}
            user={editUser}
            onClose={() => setEditUser(null)}
            onSubmit={handleUpdate}
            loading={actionLoading}
          />
          <DeleteConfirmModal
            open={!!deleteTarget}
            user={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            loading={actionLoading}
          />
        </>
      ) : (
        <CycleManagement />
      )}
    </div>
  );
}
