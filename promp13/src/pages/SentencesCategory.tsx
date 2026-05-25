import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { SentenceCard } from '@/components/SentenceCard';
import { getSentenceCategoryById } from '@/data/sentences';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function SentencesCategory() {
  const { category } = useParams<{ category: string }>();
  const cat = category ? getSentenceCategoryById(category) : undefined;
  const toggleSentence = useFavoriteStore((s) => s.toggleSentence);
  const fav = useFavoriteStore((s) => s.sentences);

  if (!cat) {
    return (
      <div>
        <Header title="场景" />
        <p className="p-8 text-center text-slate-500">场景不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 pb-12">
      <Header title={cat.name} />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className={`mb-3 rounded-2xl bg-gradient-to-br ${cat.color} p-4 text-white shadow-md`}>
          <div className="text-3xl">{cat.emoji}</div>
          <h2 className="mt-1 text-lg font-extrabold">{cat.name}</h2>
          <p className="text-xs text-white/90">共 {cat.sentences.length} 句</p>
        </div>
        <div className="space-y-3">
          {cat.sentences.map((s, idx) => {
            const key = `${cat.id}:${s.sentence}`;
            return (
              <SentenceCard
                key={idx}
                sentence={s.sentence}
                translation={s.translation}
                favorited={fav.includes(key)}
                onFavorite={() => toggleSentence(key)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
