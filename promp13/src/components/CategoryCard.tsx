import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface Props {
  to: string;
  emoji: string;
  title: string;
  subtitle?: string;
  color: string;
  favoriteCount?: number;
}

export function CategoryCard({ to, emoji, title, subtitle, color, favoriteCount }: Props) {
  return (
    <Link
      to={to}
      className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-5 shadow-lg transition hover:scale-[1.02] hover:shadow-xl active:scale-95`}
    >
      <div className="absolute -right-4 -top-4 text-6xl opacity-30 transition group-hover:scale-110 group-hover:rotate-12">
        {emoji}
      </div>
      <div className="relative flex flex-col items-start">
        <div className="mb-2 text-4xl drop-shadow">{emoji}</div>
        <h3 className="text-lg font-extrabold text-white drop-shadow">{title}</h3>
        {subtitle && <p className="mt-1 text-xs font-semibold text-white/90">{subtitle}</p>}
      </div>
      {favoriteCount !== undefined && favoriteCount > 0 && (
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-pink-500 shadow">
          <Heart size={10} fill="currentColor" />
          {favoriteCount}
        </div>
      )}
    </Link>
  );
}
