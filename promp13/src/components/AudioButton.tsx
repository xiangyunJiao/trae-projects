import { Volume2 } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import type { Accent, SpeechMode } from '@/hooks/useSpeech';

interface Props {
  text: string;
  label?: string;
  className?: string;
  mode?: SpeechMode;
  stacked?: boolean;
}

export function AudioButton({ text, label = '播放', className = '', mode = 'word', stacked = false }: Props) {
  const { speak } = useSpeech();

  return (
    <div className={`flex ${stacked ? 'flex-col' : 'items-center'} gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => speak(text, 'uk', mode)}
        className="inline-flex items-center justify-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700 shadow-sm hover:bg-sky-200 active:scale-95 transition"
        aria-label={`英式发音 ${text}`}
      >
        <span className="text-[9px]">🇬🇧</span>
        <Volume2 size={12} />
        <span>英式</span>
      </button>
      <button
        type="button"
        onClick={() => speak(text, 'us', mode)}
        className="inline-flex items-center justify-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-semibold text-orange-700 shadow-sm hover:bg-orange-200 active:scale-95 transition"
        aria-label={`美式发音 ${text}`}
      >
        <span className="text-[9px]">🇺🇸</span>
        <Volume2 size={12} />
        <span>美式</span>
      </button>
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

export function LargeAudioButton({ text, accent, label, mode = 'sentence' }: { text: string; accent: Accent; label: string; mode?: SpeechMode }) {
  const { speak } = useSpeech();
  const isUk = accent === 'uk';
  return (
    <button
      type="button"
      onClick={() => speak(text, accent, mode)}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition ${
        isUk ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-orange-500 text-white hover:bg-orange-600'
      }`}
    >
      <span>{isUk ? '🇬🇧' : '🇺🇸'}</span>
      <Volume2 size={16} />
      <span>{label}</span>
    </button>
  );
}
