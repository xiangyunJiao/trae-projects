import { useCallback, useRef } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playStartSound = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [getAudioContext]);

  const playWinSound = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
      
      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  }, [getAudioContext]);

  const playLoseSound = useCallback(() => {
    const ctx = getAudioContext();
    const notes = [440, 349.23, 293.66, 220];
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.3);
      
      oscillator.start(ctx.currentTime + i * 0.2);
      oscillator.stop(ctx.currentTime + i * 0.2 + 0.3);
    });
  }, [getAudioContext]);

  const playCoinSound = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getAudioContext]);

  return {
    playStartSound,
    playWinSound,
    playLoseSound,
    playCoinSound,
  };
};
