import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { Item } from '../types';
import { useAppStore } from '../store';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppStore();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('获取作品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen decoration-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl animate-bounce-slow">🎪</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-dark via-purple-cute to-blue-dark bg-clip-text text-transparent">
              幼儿园跳蚤市场
            </h1>
            <span className="text-5xl animate-float">🎈</span>
          </div>
          <p className="text-gray-600 text-lg">
            🌟 快来看看小朋友们的宝贝吧！交换、分享、快乐成长 🌟
          </p>
        </div>

        {user && (
          <div className="flex justify-center mb-8">
            <Link
              to="/publish"
              className="btn-cute btn-green flex items-center gap-2 text-lg"
            >
              <Plus size={24} />
              <Sparkles size={20} className="animate-sparkle" />
              发布我的宝贝
            </Link>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-6xl animate-bounce-slow mb-4">🎁</div>
              <p className="text-gray-500">加载中...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-float">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">还没有宝贝哦~</h3>
            <p className="text-gray-500 mb-6">快来成为第一个发布宝贝的小朋友吧！</p>
            {user ? (
              <Link to="/publish" className="btn-cute btn-pink">
                立即发布
              </Link>
            ) : (
              <Link to="/login" className="btn-cute btn-blue">
                登录发布
              </Link>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            items.length === 1 
              ? 'grid-cols-1 max-w-md mx-auto' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fadeIn"
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4 text-4xl">
            <span className="animate-bounce-slow" style={{ animationDelay: '0s' }}>🌈</span>
            <span className="animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🦋</span>
            <span className="animate-bounce-slow" style={{ animationDelay: '0.4s' }}>🌸</span>
            <span className="animate-bounce-slow" style={{ animationDelay: '0.6s' }}>🎨</span>
            <span className="animate-bounce-slow" style={{ animationDelay: '0.8s' }}>🍭</span>
            <span className="animate-bounce-slow" style={{ animationDelay: '1s' }}>🎠</span>
          </div>
        </div>
      </div>
    </div>
  );
}
