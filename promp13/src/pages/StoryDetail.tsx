import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LargeAudioButton } from '@/components/AudioButton';
import { getStoryById } from '@/data/stories';
import { useFavoriteStore } from '@/store/favoriteStore';

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const story = id ? getStoryById(id) : undefined;
  const toggle = useFavoriteStore((s) => s.toggleStory);
  const fav = useFavoriteStore((s) => s.stories);

  if (!story) {
    return (
      <div>
        <Header title="故事" />
        <p className="p-8 text-center text-slate-500">故事不存在</p>
      </div>
    );
  }

  const fullText = story.content.join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-pink-50 to-sky-50 pb-12">
      <Header title={story.title} />
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${story.coverColor} p-6 text-white shadow-xl`}>
          <div className="absolute -right-4 -top-4 text-[120px] opacity-25 select-none">{story.coverEmoji}</div>
          <div className="absolute right-3 top-3">
            <FavoriteButton
              active={fav.includes(story.id)}
              onToggle={() => toggle(story.id)}
            />
          </div>
          <div className="text-7xl drop-shadow">{story.coverEmoji}</div>
          <h2 className="mt-3 text-2xl font-black drop-shadow">{story.title}</h2>
          <p className="text-sm font-semibold text-white/90">{story.titleCn}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LargeAudioButton text={fullText} accent="uk" label="英式朗读" mode="story" />
            <LargeAudioButton text={fullText} accent="us" label="美式朗读" mode="story" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {story.content.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-md">
              <p className="text-base font-bold text-slate-800 leading-relaxed">{p}</p>
              <div className="mt-3 flex justify-end">
                <LargeAudioButton text={p} accent="us" label="美式" mode="sentence" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
