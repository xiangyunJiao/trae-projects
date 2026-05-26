import React, { useState, useEffect } from 'react';

interface CoinRainProps {
  active: boolean;
  onComplete?: () => void;
}

interface Coin {
  id: number;
  startX: number;
  startY: number;
  delay: number;
}

export const CoinRain: React.FC<CoinRainProps> = ({ active, onComplete }) => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (active) {
      const newCoins: Coin[] = [];
      for (let i = 0; i < 20; i++) {
        newCoins.push({
          id: i,
          startX: 20 + Math.random() * 40,
          startY: 30 + Math.random() * 20,
          delay: i * 0.1,
        });
      }
      setCoins(newCoins);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setCoins([]);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute text-3xl"
          style={{
            left: '50%',
            top: '50%',
            animation: `coinFly 2s ease-out forwards`,
            animationDelay: `${coin.delay}s`,
            '--start-x': `${coin.startX - 50}vw`,
            '--start-y': `${coin.startY - 50}vh`,
            '--end-x': `calc(100vw - 100px - 50vw)`,
            '--end-y': `calc(40px - 50vh)`,
          } as React.CSSProperties}
        >
          🪙
        </div>
      ))}

      <style>{`
        @keyframes coinFly {
          0% {
            transform: translate(var(--start-x), var(--start-y)) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(
              calc(var(--start-x) + (var(--end-x) - var(--start-x)) * 0.5),
              calc(var(--start-y) + (var(--end-y) - var(--start-y)) * 0.5 - 50px)
            ) scale(1.3) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.5) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
