import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { SENTENCE_CATEGORIES } from '@/data/sentences';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function Sentences() {
  const fav = useFavoriteStore((s) => s.sentences);
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-lime-50 to-yellow-100 pb-12">
      <Header title="场景语句" />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="mb-3 rounded-2xl bg-white/70 p-3 text-xs text-slate-600 shadow">
          💬 选择一个生活场景，学习地道的常用语句。
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SENTENCE_CATEGORIES.map((c) => {
            const count = c.sentences.filter((s) => fav.includes(`${c.id}:${s.sentence}`)).length;
            return (
              <CategoryCard
                key={c.id}
                to={`/sentences/${c.id}`}
                emoji={c.emoji}
                title={c.name}
                subtitle={`${c.sentences.length} 句`}
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
