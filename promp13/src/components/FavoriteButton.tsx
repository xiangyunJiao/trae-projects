import { Heart } from 'lucide-react';

interface Props {
  active: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

export function FavoriteButton({ active, onToggle, size = 18, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? '取消收藏' : '收藏'}
      className={`inline-flex items-center justify-center rounded-full p-1.5 shadow-sm transition active:scale-95 ${
        active
          ? 'bg-pink-500 text-white hover:bg-pink-600'
          : 'bg-white/70 text-pink-500 hover:bg-pink-100'
      } ${className}`}
    >
      <Heart size={size} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
