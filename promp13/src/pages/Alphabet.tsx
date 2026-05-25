import { Header } from '@/components/Header';
import { AudioButton } from '@/components/AudioButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ALPHABET } from '@/data/alphabet';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function Alphabet() {
  const toggle = useFavoriteStore((s) => s.toggleLetter);
  const letters = useFavoriteStore((s) => s.letters);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-yellow-50 to-pink-100 pb-12">
      <Header title="英文字母 A-Z" />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="mb-3 rounded-2xl bg-white/70 p-3 text-xs text-slate-600 shadow">
          💡 点击字母卡片，播放英式/美式发音，点击 ♥ 收藏。
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ALPHABET.map((item) => {
            const fav = letters.includes(item.letter);
            return (
              <div
                key={item.letter}
                className="relative rounded-2xl bg-white p-3 text-center shadow-md transition hover:shadow-lg"
              >
                <div className="absolute right-1.5 top-1.5">
                  <FavoriteButton
                    active={fav}
                    onToggle={() => toggle(item.letter)}
                    size={14}
                  />
                </div>
                <div className="bg-gradient-to-br from-orange-300 to-pink-300 bg-clip-text text-5xl font-black leading-none text-transparent">
                  {item.letter}
                </div>
                <div className="mt-1 text-[10px] font-semibold text-slate-500">
                  🇬🇧 {item.phoneticUk}
                </div>
                <div className="mt-2">
                  <AudioButton text={item.letter} mode="letter" stacked />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
