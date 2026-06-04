import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Music2, User, LogOut, Settings, Home, PlusCircle } from 'lucide-react';
import { useAppStore } from '../store';

export default function Header() {
  const { user, bgMusicPlaying, setBgMusicPlaying, logout } = useAppStore();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const bgMusicPlayingRef = useRef(bgMusicPlaying);
  bgMusicPlayingRef.current = bgMusicPlaying;

  const tryPlayMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (bgMusicPlayingRef.current) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      if (bgMusicPlayingRef.current) {
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    
    if (bgMusicPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [bgMusicPlaying]);

  const toggleMusic = () => {
    const newPlaying = !bgMusicPlaying;
    setBgMusicPlaying(newPlaying);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    if (newPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-pink-cute shadow-lg">
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>
      
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl animate-bounce-slow">🎪</span>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-dark to-blue-dark bg-clip-text text-transparent">
            幼儿园跳蚤市场
          </h1>
          <span className="text-3xl animate-float">🎈</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className={`p-2 rounded-full transition-all ${bgMusicPlaying ? 'bg-green-cute text-white' : 'bg-gray-200 text-gray-500'} hover:scale-110`}
            title={bgMusicPlaying ? '暂停音乐' : '播放音乐'}
          >
            {bgMusicPlaying ? <Music size={20} /> : <Music2 size={20} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-pink-light hover:bg-pink-cute/30 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-pink-cute flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:inline font-medium text-gray-700">{user.nickname}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-pink-cute overflow-hidden">
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-pink-light transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <Home size={18} className="text-pink-cute" />
                    <span>首页</span>
                  </Link>
                  <Link
                    to="/publish"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-pink-light transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <PlusCircle size={18} className="text-green-cute" />
                    <span>发布作品</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-pink-light transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <User size={18} className="text-blue-cute" />
                    <span>个人中心</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-pink-light transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Settings size={18} className="text-purple-cute" />
                      <span>管理后台</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>退出登录</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-pink-cute text-white font-medium hover:bg-pink-dark transition-all hover:scale-105"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-blue-cute text-white font-medium hover:bg-blue-dark transition-all hover:scale-105"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
