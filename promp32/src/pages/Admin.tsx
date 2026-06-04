import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, Trash2, Edit2, Check, X, Shield, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store';
import { User, Item } from '../types';

type TabType = 'users' | 'items';

export default function Admin() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } else {
        const res = await fetch('/api/admin/items');
        const data = await res.json();
        if (data.success) {
          setItems(data.items);
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('更新用户角色失败:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？该用户的所有作品和评论也会被删除！')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('删除作品失败:', error);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen decoration-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="card-cute mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-cute flex items-center justify-center">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">管理后台</h1>
              <p className="text-gray-500">欢迎回来，管理员 {user.nickname}</p>
            </div>
          </div>

          <div className="flex gap-4 border-b-2 border-pink-light pb-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-purple-cute text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users size={20} />
              用户管理
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'items'
                  ? 'bg-purple-cute text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Package size={20} />
              作品管理
            </button>
          </div>
        </div>

        <div className="card-cute">
          {loading ? (
            <div className="text-center py-12">
              <span className="text-4xl animate-bounce-slow">⏳</span>
              <p className="text-gray-500 mt-2">加载中...</p>
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-pink-light">
                    <th className="text-left py-3 px-4">用户</th>
                    <th className="text-left py-3 px-4">用户名</th>
                    <th className="text-left py-3 px-4">角色</th>
                    <th className="text-left py-3 px-4">注册时间</th>
                    <th className="text-left py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-pink-light/50 hover:bg-pink-light/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-cute to-blue-cute flex items-center justify-center text-white font-bold">
                            {u.nickname[0]}
                          </div>
                          <span className="font-medium">{u.nickname}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-500">{u.username}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          u.role === 'admin'
                            ? 'bg-purple-cute text-white'
                            : 'bg-blue-light text-blue-dark'
                        }`}>
                          {u.role === 'admin' ? '👑 管理员' : '👤 普通用户'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {u.id !== 'admin001' && (
                            <>
                              <button
                                onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                className={`p-2 rounded-full transition-colors ${
                                  u.role === 'admin'
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                                title={u.role === 'admin' ? '降级为普通用户' : '升级为管理员'}
                              >
                                {u.role === 'admin' ? <X size={18} /> : <Shield size={18} />}
                              </button>
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                                title="删除用户"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const images = item.images ? item.images.split(',') : [];
                const coverImage = images[item.cover_index] || images[0];
                
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-pink-light/30 rounded-2xl">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={coverImage.startsWith('http') ? coverImage : `${coverImage}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                      <p className="text-gray-500 text-sm">发布者: {item.nickname}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>❤️ {item.like_count || 0}</span>
                        <span>💬 {item.comment_count || 0}</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/edit/${item.id}`)}
                        className="p-2 rounded-full bg-blue-cute text-white hover:bg-blue-dark transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
