import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { WORD_CATEGORIES } from '@/data/words';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function Words() {
  const favWords = useFavoriteStore((s) => s.words);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-cyan-50 to-emerald-100 pb-12">
      <Header title="单词分类" />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="mb-3 rounded-2xl bg-white/70 p-3 text-xs text-slate-600 shadow">
          🍎 选择一个分类，学习常用单词，每个单词都有英式和美式发音。
        </div>
        <div className="grid grid-cols-2 gap-3">
          {WORD_CATEGORIES.map((c) => {
            const count = c.words.filter((w) => favWords.includes(`${c.id}:${w.word}`)).length;
            return (
              <CategoryCard
                key={c.id}
                to={`/words/${c.id}`}
                emoji={c.emoji}
                title={c.name}
                subtitle={`${c.words.length} 个单词`}
                color={c.color}
                favoriteCount={count}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
