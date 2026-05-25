import { ArrowLeft, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoriteStore } from '@/store/favoriteStore';

interface Props {
  title: string;
  showBack?: boolean;
  showFavorites?: boolean;
}

export function Header({ title, showBack = true, showFavorites = true }: Props) {
  const navigate = useNavigate();
  const total = useFavoriteStore((s) => s.letters.length + s.words.length + s.sentences.length + s.stories.length);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-r from-orange-300 via-pink-200 to-sky-200 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {showBack ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/80 p-2 shadow hover:bg-white active:scale-95 transition"
            aria-label="返回"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <span className="inline-block w-9" />
        )}
        <h1 className="truncate text-lg font-extrabold text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
          {title}
        </h1>
      </div>
      {showFavorites && (
        <Link
          to="/favorites"
          className="relative rounded-full bg-white/80 px-3 py-2 shadow hover:bg-white active:scale-95 transition"
        >
          <Heart size={18} className="text-pink-500" />
          {total > 0 && (
            <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white shadow">
              {total}
            </span>
          )}
        </Link>
      )}
    </header>
  );
}
