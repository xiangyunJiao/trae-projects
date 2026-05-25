import { Link } from 'react-router-dom';
import { Heart, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { useFavoriteStore } from '@/store/favoriteStore';

const MODULES = [
  {
    to: '/alphabet',
    title: '字母发音',
    subtitle: 'A-Z 26 个字母',
    emoji: '🔤',
    color: 'from-orange-300 to-pink-300',
  },
  {
    to: '/words',
    title: '单词学习',
    subtitle: '9 大分类 · 200+ 单词',
    emoji: '📚',
    color: 'from-sky-300 to-cyan-300',
  },
  {
    to: '/sentences',
    title: '场景语句',
    subtitle: '5 大生活场景',
    emoji: '💬',
    color: 'from-green-300 to-emerald-300',
  },
  {
    to: '/stories',
    title: '故事阅读',
    subtitle: '趣味英文故事',
    emoji: '📖',
    color: 'from-violet-300 to-fuchsia-300',
  },
];

export default function Home() {
  const total = useFavoriteStore(
    (s) => s.letters.length + s.words.length + s.sentences.length + s.stories.length,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-pink-100 to-sky-100">
      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-300 via-pink-300 to-sky-300 p-6 text-white shadow-xl">
          <div className="absolute -right-6 -top-6 text-[120px] opacity-20 select-none">🌈</div>
          <div className="absolute -bottom-4 -left-4 text-6xl opacity-30 select-none">✨</div>
          <div className="relative">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/30 px-3 py-1 text-xs font-bold">
              <Sparkles size={12} />
              儿童英语启蒙
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight drop-shadow">
              快乐学英语
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/90">
              英式 · 美式 双发音 · 图文故事
            </p>
          </div>
        </div>

        <h2 className="mt-8 mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-700">
          <BookOpen size={18} />
          学习模块
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${m.color} p-4 shadow-lg transition hover:scale-[1.03] hover:shadow-xl active:scale-95`}
            >
              <div className="absolute -right-2 -top-2 text-5xl opacity-25 select-none">{m.emoji}</div>
              <div className="text-4xl drop-shadow">{m.emoji}</div>
              <h3 className="mt-2 text-base font-extrabold text-white drop-shadow">{m.title}</h3>
              <p className="mt-0.5 text-[11px] font-semibold text-white/90">{m.subtitle}</p>
            </Link>
          ))}
        </div>

        <Link
          to="/favorites"
          className="mt-4 flex items-center justify-between rounded-3xl bg-white p-4 shadow-md transition hover:shadow-lg active:scale-95"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-300 to-rose-300 text-2xl shadow-inner">
              <Heart className="text-white" fill="white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">我的收藏</h3>
              <p className="text-xs text-slate-500">已收藏 {total} 条</p>
            </div>
          </div>
          <Volume2 className="text-slate-400" size={20} />
        </Link>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          由浏览器语音合成提供发音 · 建议使用 Chrome/Safari
        </p>
      </div>
    </div>
  );
}
