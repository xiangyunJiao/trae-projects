import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAppStore } from '../store';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, nickname }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-cute">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block animate-float">🎈</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-dark to-pink-dark bg-clip-text text-transparent">
              加入我们
            </h2>
            <p className="text-gray-500 mt-2">创建你的跳蚤市场账号</p>
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
                🎨 昵称
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input-cute"
                placeholder="大家怎么称呼你呢？"
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
                placeholder="请设置密码"
                required
                minLength={6}
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
              className="w-full btn-cute btn-blue flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              {loading ? '注册中...' : '立即注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              已有账号？{' '}
              <Link to="/login" className="text-blue-dark font-medium hover:underline">
                去登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
