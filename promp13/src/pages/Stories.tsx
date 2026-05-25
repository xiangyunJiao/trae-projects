import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FavoriteButton } from '@/components/FavoriteButton';
import { STORIES } from '@/data/stories';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function Stories() {
  const toggle = useFavoriteStore((s) => s.toggleStory);
  const fav = useFavoriteStore((s) => s.stories);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 via-fuchsia-50 to-pink-100 pb-12">
      <Header title="故事阅读" />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="mb-3 rounded-2xl bg-white/70 p-3 text-xs text-slate-600 shadow">
          📖 听故事学英语，整段朗读，可重复播放。
        </div>
        <div className="space-y-3">
          {STORIES.map((s) => (
            <div key={s.id} className="relative overflow-hidden rounded-3xl bg-white shadow-md transition hover:shadow-lg">
              <div className="absolute right-3 top-3 z-10">
                <FavoriteButton
                  active={fav.includes(s.id)}
                  onToggle={() => toggle(s.id)}
                />
              </div>
              <Link to={`/stories/${s.id}`} className="flex items-center gap-4 p-4 active:scale-[0.98] transition">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${s.coverColor} text-5xl shadow-inner`}>
                  {s.coverEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-extrabold text-slate-800">{s.title}</h3>
                  <p className="truncate text-sm text-slate-500">{s.titleCn}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{s.content.length} 段</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
