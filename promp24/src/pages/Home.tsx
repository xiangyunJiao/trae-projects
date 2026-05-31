import { useState, useCallback } from 'react';
import type { GameMode, AnimationState } from '../types';
import { ModeToggle } from '../components/ModeToggle';
import { GachaMachine } from '../components/GachaMachine';

export default function Home() {
  const [mode, setMode] = useState<GameMode>('normal');
  const [animationState, setAnimationState] = useState<AnimationState>('idle');

  const handleAnimationStateChange = useCallback((state: AnimationState) => {
    setAnimationState(state);
  }, []);

  const isAnimating = animationState !== 'idle';

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🎃</div>
        <div className="absolute top-32 right-16 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>👻</div>
        <div className="absolute top-1/4 left-1/4 text-4xl opacity-15 animate-float" style={{ animationDelay: '1s' }}>🦇</div>
        <div className="absolute top-20 right-1/3 text-5xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>👹</div>
        <div className="absolute bottom-32 left-16 text-6xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🎃</div>
        <div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.7s' }}>🕷️</div>
        <div className="absolute bottom-1/3 left-1/3 text-4xl opacity-15 animate-float" style={{ animationDelay: '1.2s' }}>🍬</div>
        <div className="absolute top-1/2 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1.8s' }}>👻</div>
        <div className="absolute bottom-10 left-1/2 text-4xl opacity-15 animate-float" style={{ animationDelay: '0.3s' }}>🦇</div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #FF6B35 0%, transparent 50%),
                             radial-gradient(circle at 80% 70%, #9C27B0 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, #4CAF50 0%, transparent 50%)`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <ModeToggle
          mode={mode}
          onModeChange={setMode}
          disabled={isAnimating}
        />

        <GachaMachine
          mode={mode}
          onAnimationStateChange={handleAnimationStateChange}
        />

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            {mode === 'normal'
              ? '🎃 初级扭蛋：普通奖励概率更高'
              : '👑 高级扭蛋：稀有奖励概率更高，特效更华丽'}
          </p>
        </div>
      </div>
    </div>
  );
}
