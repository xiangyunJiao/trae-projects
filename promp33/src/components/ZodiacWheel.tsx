import { useState, useEffect, useMemo } from 'react';
import { ZodiacSign, ZodiacRank, User } from '@/types';
import { zodiacSigns } from '@/data/zodiac';
import ZodiacSlot from './ZodiacSlot';
import CenterAvatar from './CenterAvatar';

interface ZodiacWheelProps {
  topUser: User;
  zodiacRanks: ZodiacRank[];
}

export default function ZodiacWheel({ topUser, zodiacRanks }: ZodiacWheelProps) {
  const [wheelSize, setWheelSize] = useState(() => {
    const screenWidth = window.innerWidth;
    const maxSize = Math.min(700, screenWidth - 40);
    return Math.max(320, Math.min(maxSize, screenWidth * 0.9));
  });

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const maxSize = Math.min(700, screenWidth - 40);
      const minSize = 320;
      setWheelSize(Math.max(minSize, Math.min(maxSize, screenWidth * 0.9)));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const wheelDecorations = useMemo(() => {
    const dots: { angle: number; size: number }[] = [];
    for (let i = 0; i < 24; i++) {
      dots.push({
        angle: i * 15,
        size: i % 2 === 0 ? 6 : 4,
      });
    }
    return dots;
  }, []);

  const getUserForZodiac = (zodiacId: number): User | null => {
    const rank = zodiacRanks.find(r => r.zodiacId === zodiacId);
    return rank?.user || null;
  };

  return (
    <div className="relative" style={{ width: `${wheelSize}px`, height: `${wheelSize}px` }}>
      <div 
        className="absolute inset-0 rounded-full p-2 wheel-border glow-purple hardware-accelerate"
        style={{ transform: `translateZ(0)` }}
      >
        <div className="w-full h-full rounded-full wheel-gradient relative hardware-accelerate animate-spin-slow">
          {wheelDecorations.map((dot, index) => {
            const x = 50 + 47 * Math.cos((dot.angle - 90) * Math.PI / 180);
            const y = 50 + 47 * Math.sin((dot.angle - 90) * Math.PI / 180);
            return (
              <div
                key={index}
                className="absolute rounded-full bg-gold-400 opacity-80"
                style={{
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
                }}
              />
            );
          })}

          {zodiacSigns.map((zodiac: ZodiacSign) => (
            <div
              key={zodiac.id}
              className="absolute w-0.5 bg-zodiac-200 opacity-50"
              style={{
                height: '45%',
                left: '50%',
                top: '5%',
                transformOrigin: 'center bottom',
                transform: `translateX(-50%) rotate(${zodiac.startAngle}deg)`,
              }}
            />
          ))}

          {zodiacSigns.map((zodiac: ZodiacSign) => (
            <ZodiacSlot
              key={zodiac.id}
              zodiac={zodiac}
              user={getUserForZodiac(zodiac.id)}
              angle={zodiac.startAngle}
              wheelSize={wheelSize}
            />
          ))}

          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full hardware-accelerate"
            style={{
              width: `${wheelSize * 0.35}px`,
              height: `${wheelSize * 0.35}px`,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(232, 213, 255, 0.5) 50%, rgba(184, 146, 255, 0.3) 100%)',
              boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.2), 0 0 20px rgba(154, 107, 255, 0.3)',
            }}
          />
        </div>
      </div>

      <CenterAvatar user={topUser} />
    </div>
  );
}
