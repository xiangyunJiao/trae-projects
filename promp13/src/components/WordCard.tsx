import { AudioButton } from './AudioButton';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  word: string;
  translation: string;
  phoneticUk: string;
  phoneticUs: string;
  emoji: string;
  favorited: boolean;
  onFavorite: () => void;
}

export function WordCard({ word, translation, phoneticUk, phoneticUs, emoji, favorited, onFavorite }: Props) {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl bg-white p-3 shadow-md transition hover:shadow-lg">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 text-4xl shadow-inner">
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="truncate text-xl font-extrabold text-slate-800">{word}</h4>
          <span className="truncate text-sm text-slate-500">{translation}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span>🇬🇧 {phoneticUk}</span>
          <span>🇺🇸 {phoneticUs}</span>
        </div>
        <div className="mt-2">
          <AudioButton text={word} />
        </div>
      </div>
      <div className="absolute right-2 top-2">
        <FavoriteButton active={favorited} onToggle={onFavorite} />
      </div>
    </div>
  );
}
