import { useState } from 'react';
import { Header } from '@/components/Header';
import { WordCard } from '@/components/WordCard';
import { SentenceCard } from '@/components/SentenceCard';
import { AudioButton } from '@/components/AudioButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ALPHABET } from '@/data/alphabet';
import { WORD_CATEGORIES, getWordCategoryById } from '@/data/words';
import { SENTENCE_CATEGORIES, getSentenceCategoryById } from '@/data/sentences';
import { STORIES, getStoryById } from '@/data/stories';
import { useFavoriteStore } from '@/store/favoriteStore';

type Tab = 'letter' | 'word' | 'sentence' | 'story';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'letter', label: '字母', emoji: '🔤' },
  { key: 'word', label: '单词', emoji: '📚' },
  { key: 'sentence', label: '语句', emoji: '💬' },
  { key: 'story', label: '故事', emoji: '📖' },
];

export default function Favorites() {
  const [tab, setTab] = useState<Tab>('letter');
  const letters = useFavoriteStore((s) => s.letters);
  const words = useFavoriteStore((s) => s.words);
  const sentences = useFavoriteStore((s) => s.sentences);
  const stories = useFavoriteStore((s) => s.stories);
  const toggleLetter = useFavoriteStore((s) => s.toggleLetter);
  const toggleWord = useFavoriteStore((s) => s.toggleWord);
  const toggleSentence = useFavoriteStore((s) => s.toggleSentence);
  const toggleStory = useFavoriteStore((s) => s.toggleStory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-orange-100 pb-12">
      <Header title="我的收藏" />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="sticky top-[60px] z-10 -mx-4 bg-pink-100/80 px-4 py-2 backdrop-blur">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold shadow transition ${
                  tab === t.key
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-pink-50'
                }`}
              >
                <span className="mr-1">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'letter' && (
          <div className="mt-3">
            {letters.length === 0 && <Empty text="还没有收藏字母" />}
            <div className="grid grid-cols-4 gap-3">
              {ALPHABET.filter((a) => letters.includes(a.letter)).map((a) => (
                <div key={a.letter} className="relative rounded-2xl bg-white p-3 text-center shadow-md">
                  <div className="absolute right-1.5 top-1.5">
                    <FavoriteButton active onToggle={() => toggleLetter(a.letter)} size={14} />
                  </div>
                  <div className="bg-gradient-to-br from-orange-300 to-pink-300 bg-clip-text text-5xl font-black leading-none text-transparent">
                    {a.letter}
                  </div>
                  <div className="mt-2">
                    <AudioButton text={a.letter} mode="letter" stacked />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'word' && (
          <div className="mt-3 space-y-4">
            {words.length === 0 && <Empty text="还没有收藏单词" />}
            {WORD_CATEGORIES.map((c) => {
              const collected = c.words.filter((w) => words.includes(`${c.id}:${w.word}`));
              if (collected.length === 0) return null;
              return (
                <div key={c.id}>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>{c.emoji}</span> {c.name}
                  </h3>
                  <div className="space-y-3">
                    {collected.map((w) => (
                      <WordCard
                        key={w.word}
                        word={w.word}
                        translation={w.translation}
                        phoneticUk={w.phoneticUk}
                        phoneticUs={w.phoneticUs}
                        emoji={w.emoji}
                        favorited
                        onFavorite={() => toggleWord(`${c.id}:${w.word}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'sentence' && (
          <div className="mt-3 space-y-4">
            {sentences.length === 0 && <Empty text="还没有收藏语句" />}
            {SENTENCE_CATEGORIES.map((c) => {
              const collected = c.sentences.filter((s) => sentences.includes(`${c.id}:${s.sentence}`));
              if (collected.length === 0) return null;
              return (
                <div key={c.id}>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>{c.emoji}</span> {c.name}
                  </h3>
                  <div className="space-y-3">
                    {collected.map((s, idx) => (
                      <SentenceCard
                        key={idx}
                        sentence={s.sentence}
                        translation={s.translation}
                        favorited
                        onFavorite={() => toggleSentence(`${c.id}:${s.sentence}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'story' && (
          <div className="mt-3 space-y-3">
            {stories.length === 0 && <Empty text="还没有收藏故事" />}
            {STORIES.filter((s) => stories.includes(s.id)).map((s) => (
              <div key={s.id} className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-md">
                <div className="absolute right-3 top-3">
                  <FavoriteButton active onToggle={() => toggleStory(s.id)} />
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${s.coverColor} text-5xl shadow-inner`}>
                    {s.coverEmoji}
                  </div>
                  <div className="min-w-0 flex-1 pr-10">
                    <h3 className="truncate text-lg font-extrabold text-slate-800">{s.title}</h3>
                    <p className="truncate text-sm text-slate-500">{s.titleCn}</p>
                    <div className="mt-2">
                      <AudioButton text={s.content.join(' ')} mode="story" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-8 text-center text-sm text-slate-500 shadow">
      🌟 {text}
    </div>
  );
}

// keep imports used so tree-shaking doesn't complain
void getWordCategoryById;
void getSentenceCategoryById;
void getStoryById;
