import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Decorations() {
  const stars = useMemo<Star[]>(() => {
    const result: Star[] = [];
    for (let i = 0; i < 30; i++) {
      result.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 starfield opacity-40" />
      
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
      
      <div 
        className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full blur-3xl opacity-30 animate-float"
        style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}
      />
      
      <div 
        className="absolute top-[20%] right-[8%] w-40 h-40 rounded-full blur-3xl opacity-25 animate-float"
        style={{ background: 'radial-gradient(circle, #FFD1DC 0%, transparent 70%)', animationDelay: '2s' }}
      />
      
      <div 
        className="absolute bottom-[15%] left-[10%] w-36 h-36 rounded-full blur-3xl opacity-30 animate-float"
        style={{ background: 'radial-gradient(circle, #B892FF 0%, transparent 70%)', animationDelay: '1s' }}
      />
      
      <div 
        className="absolute bottom-[25%] right-[5%] w-28 h-28 rounded-full blur-3xl opacity-25 animate-float"
        style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', animationDelay: '3s' }}
      />
    </div>
  );
}
