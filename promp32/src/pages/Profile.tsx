import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Settings, LogOut, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Item } from '../types';

export default function Profile() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyItems();
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) {
        const myItems = data.items.filter((item: Item) => item.user_id === user?.id);
        setItems(myItems);
      }
    } catch (error) {
      console.error('获取我的作品失败:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchMyItems();
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen decoration-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card-cute mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-cute to-blue-cute flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.nickname}</h1>
              <p className="text-gray-500">@{user.username}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-cute text-white' 
                    : 'bg-blue-light text-blue-dark'
                }`}>
                  {user.role === 'admin' ? '👑 管理员' : '👤 普通用户'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-cute text-white hover:bg-purple-500 transition-colors"
                >
                  <Settings size={18} />
                  管理后台
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <LogOut size={18} />
                退出登录
              </button>
            </div>
          </div>
        </div>

        <div className="card-cute">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package size={24} className="text-pink-cute" />
              我的宝贝 ({items.length})
            </h2>
            <Link
              to="/publish"
              className="btn-cute btn-green text-sm"
            >
              + 发布新宝贝
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">📦</span>
              <p className="text-gray-500 mb-4">你还没有发布任何宝贝哦~</p>
              <Link to="/publish" className="btn-cute btn-pink inline-block">
                立即发布
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const images = item.images ? item.images.split(',') : [];
                const coverImage = images[item.cover_index] || images[0];
                
                return (
                  <div key={item.id} className="flex gap-4 p-4 bg-pink-light/30 rounded-2xl">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={coverImage.startsWith('http') ? coverImage : `${coverImage}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mt-1">{item.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span>❤️ {item.like_count || 0}</span>
                        <span>💬 {item.comment_count || 0}</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/edit/${item.id}`}
                        className="p-2 rounded-full bg-blue-cute text-white hover:bg-blue-dark transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors"
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
