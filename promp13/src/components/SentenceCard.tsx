import { AudioButton } from './AudioButton';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  sentence: string;
  translation: string;
  favorited: boolean;
  onFavorite: () => void;
}

export function SentenceCard({ sentence, translation, favorited, onFavorite }: Props) {
  return (
    <div className="relative rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg">
      <div className="absolute right-3 top-3">
        <FavoriteButton active={favorited} onToggle={onFavorite} />
      </div>
      <h4 className="pr-10 text-base font-bold text-slate-800 leading-snug">{sentence}</h4>
      <p className="mt-1 text-sm text-slate-500">{translation}</p>
      <div className="mt-3">
        <AudioButton text={sentence} mode="sentence" />
      </div>
    </div>
  );
}
