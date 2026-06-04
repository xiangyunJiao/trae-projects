import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Volume2, Pause, Heart, MessageCircle, ArrowLeft, Trash2, Edit, Send } from 'lucide-react';
import { Item, Comment } from '../types';
import { useAppStore } from '../store';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [item, setItem] = useState<Item | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (id) {
      fetchItem();
      fetchComments();
      checkLikeStatus();
    }
  }, [id, user?.id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      if (data.success) {
        setItem(data.item);
      }
    } catch (error) {
      console.error('获取作品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/item/${id}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  const checkLikeStatus = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/items/${id}/liked?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('检查点赞状态失败:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`/api/items/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/comments/item/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          nickname: user.nickname,
          content: newComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('评论失败:', error);
    }
  };

  const deleteItem = async () => {
    if (!confirm('确定要删除这个作品吗？')) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current || !item?.audio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce-slow mb-4">🎁</div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-500">作品不存在</p>
          <Link to="/" className="btn-cute btn-pink mt-4 inline-block">返回首页</Link>
        </div>
      </div>
    );
  }

  const images = item.images ? item.images.split(',') : [];
  const coverImage = images[item.cover_index] || images[0];
  const isOwner = user?.id === item.user_id;
  const isAdmin = user?.role === 'admin';
  const canEdit = isOwner || isAdmin;

  return (
    <div className="min-h-screen decoration-bg pb-8">
      {item.audio && (
        <audio ref={audioRef} src={`${item.audio}`} onEnded={() => setIsPlaying(false)} />
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-dark mb-6 transition-colors"
        >
          <ArrowLeft size={24} />
          <span>返回</span>
        </button>

        <div className="card-cute">
          <div className="relative mb-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-pink-light">
              <img
                src={coverImage.startsWith('http') ? coverImage : `${coverImage}`}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            {item.audio && (
              <button
                onClick={toggleAudio}
                className={`audio-btn bottom-4 right-4 w-14 h-14 ${isPlaying ? 'bg-pink-cute text-white' : ''}`}
              >
                {isPlaying ? <Pause size={24} /> : <Volume2 size={24} />}
              </button>
            )}

            {canEdit && (
              <div className="absolute top-4 right-4 flex gap-2">
                {isOwner && (
                  <Link
                    to={`/edit/${item.id}`}
                    className="p-3 rounded-full bg-blue-cute text-white hover:bg-blue-dark transition-colors shadow-lg"
                  >
                    <Edit size={20} />
                  </Link>
                )}
                <button
                  onClick={deleteItem}
                  className="p-3 rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors shadow-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('http') ? img : `${img}`}
                  alt={`图片${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-4 transition-all ${
                    idx === item.cover_index ? 'border-pink-cute scale-105' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {item.title}
          </h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-pink-light">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <span className="font-medium text-gray-700">{item.nickname || '匿名'}</span>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(item.created_at).toLocaleString()}
            </span>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
              {item.content}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${
                liked
                  ? 'bg-pink-cute text-white scale-105'
                  : 'bg-pink-light text-pink-dark hover:bg-pink-cute hover:text-white'
              }`}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
              <span className="font-bold">{likeCount || item.like_count || 0}</span>
            </button>
            <div className="flex items-center gap-2 text-blue-dark">
              <MessageCircle size={24} />
              <span className="font-bold">{comments.length}</span>
            </div>
          </div>
        </div>

        <div className="card-cute mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💬</span>
            评论区
          </h2>

          <form onSubmit={submitComment} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? '说点什么吧...' : '登录后可以评论哦~'}
                className="input-cute flex-1"
                disabled={!user}
              />
              <button
                type="submit"
                disabled={!user || !newComment.trim()}
                className="px-5 py-3 rounded-full bg-pink-cute text-white hover:bg-pink-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <span className="text-4xl block mb-2">🤐</span>
              还没有评论，快来抢沙发吧！
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-pink-light/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👶</span>
                      <span className="font-medium text-gray-700">{comment.nickname}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
