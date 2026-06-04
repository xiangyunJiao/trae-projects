import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAppStore } from '../store';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-cute">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block animate-bounce-slow">🎪</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-dark to-blue-dark bg-clip-text text-transparent">
              欢迎回来
            </h2>
            <p className="text-gray-500 mt-2">登录你的跳蚤市场账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-cute"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-cute"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-500 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cute btn-pink flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              还没有账号？{' '}
              <Link to="/register" className="text-pink-dark font-medium hover:underline">
                立即注册
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-light rounded-2xl">
            <p className="text-sm text-blue-dark">
              💡 测试账号：admin1234 / root@1234 (管理员)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
