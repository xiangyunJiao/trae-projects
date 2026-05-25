import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { WordCard } from '@/components/WordCard';
import { getWordCategoryById } from '@/data/words';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function WordsCategory() {
  const { category } = useParams<{ category: string }>();
  const cat = category ? getWordCategoryById(category) : undefined;
  const toggleWord = useFavoriteStore((s) => s.toggleWord);
  const favWords = useFavoriteStore((s) => s.words);

  if (!cat) {
    return (
      <div>
        <Header title="单词分类" />
        <p className="p-8 text-center text-slate-500">分类不存在</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-sky-50 pb-12`}>
      <Header title={cat.name} />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className={`mb-3 rounded-2xl bg-gradient-to-br ${cat.color} p-4 text-white shadow-md`}>
          <div className="text-3xl">{cat.emoji}</div>
          <h2 className="mt-1 text-lg font-extrabold">{cat.name}</h2>
          <p className="text-xs text-white/90">共 {cat.words.length} 个单词</p>
        </div>
        <div className="space-y-3">
          {cat.words.map((w) => {
            const key = `${cat.id}:${w.word}`;
            return (
              <WordCard
                key={w.word}
                word={w.word}
                translation={w.translation}
                phoneticUk={w.phoneticUk}
                phoneticUs={w.phoneticUs}
                emoji={w.emoji}
                favorited={favWords.includes(key)}
                onFavorite={() => toggleWord(key)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
