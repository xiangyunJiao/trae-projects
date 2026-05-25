import { useCallback, useEffect, useRef, useState } from 'react';

export type Accent = 'uk' | 'us';
export type SpeechMode = 'letter' | 'word' | 'sentence' | 'story';

const LANG_MAP: Record<Accent, string> = {
  uk: 'en-GB',
  us: 'en-US',
};

const RATE_MAP: Record<SpeechMode, number> = {
  letter: 0.8,
  word: 0.75,
  sentence: 0.65,
  story: 0.6,
};

export function useSpeech() {
  const [voicesReady, setVoicesReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setVoicesReady(true);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const pickVoice = useCallback((accent: Accent) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
    const voices = window.speechSynthesis.getVoices();
    const lang = LANG_MAP[accent];
    const exact = voices.find((v) => v.lang === lang);
    if (exact) return exact;
    const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
    return englishVoices[0] || voices[0];
  }, []);

  const speak = useCallback(
    (text: string, accent: Accent = 'us', mode: SpeechMode = 'word') => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        let speakText = text;
        if (mode === 'letter' && text.length === 1) {
          speakText = text + '.';
        }
        const utter = new SpeechSynthesisUtterance(speakText);
        utter.lang = LANG_MAP[accent];
        const v = pickVoice(accent);
        if (v) utter.voice = v;
        utter.rate = RATE_MAP[mode];
        utter.pitch = 1;
        utter.volume = 1;
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        utter.onerror = () => setSpeaking(false);
        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.error('speech error', e);
      }
    },
    [pickVoice],
  );

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, voicesReady, supported: typeof window !== 'undefined' && 'speechSynthesis' in window };
}
