import type { GameMode } from '../../types';

interface BallProps {
  x: number;
  y: number;
  color: string;
  radius: number;
  mode: GameMode;
  isPremium?: boolean;
}

export function Ball({ x, y, color, radius, mode, isPremium }: BallProps) {
  const size = radius * 2;

  return (
    <div
      className={`absolute rounded-full transition-transform ${mode === 'premium' || isPremium ? 'animate-ball-glow' : ''}`}
      style={{
        left: x - radius,
        top: y - radius,
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}ee, ${color} 50%, ${color}aa 100%)`,
        boxShadow: `
          inset -5px -5px 15px rgba(0,0,0,0.3),
          inset 5px 5px 15px rgba(255,255,255,0.3),
          ${mode === 'premium' ? `0 0 20px ${color}, 0 0 40px ${color}80` : `0 4px 8px rgba(0,0,0,0.3)`}
        `,
      }}
    >
      <div
        className="absolute rounded-full bg-white/40"
        style={{
          left: '20%',
          top: '15%',
          width: '35%',
          height: '25%',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
