import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    team: string;
  };
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post<LoginResponse>('/api/auth/login', { username, password });
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            O
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AwakOKR</h1>
          <p className="mt-1 text-sm text-gray-500">目标与关键成果管理系统</p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="用户名"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              登录
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
