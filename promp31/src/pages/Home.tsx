import { useMemo } from 'react';
import { CardGrid, BackpackButton } from '@/components/CardGrid';
import { CardRevealModal, GrandPrizeModal } from '@/components/CardRevealModal';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const phase = useGameStore((s) => s.phase);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0d0520 50%, #050210 100%)',
      }}
    >
      <TableTexture />
      <AmbientParticles />

      <BackpackButton onClick={() => navigate('/backpack')} />

      <h1 className="text-2xl md:text-3xl font-bold text-amber-300/90 tracking-widest mb-8 relative z-10"
        style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
      >
        ✦ 魔法卡牌 ✦
      </h1>

      <div className="relative z-10">
        <CardGrid />
      </div>

      {phase === 'display' && (
        <p className="mt-4 text-purple-400/60 text-sm relative z-10">
          点击下方按钮开始翻牌
        </p>
      )}

      <CardRevealModal />
      <GrandPrizeModal />
    </div>
  );
}

function TableTexture() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139,111,192,0.15) 40px, rgba(139,111,192,0.15) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139,111,192,0.15) 40px, rgba(139,111,192,0.15) 41px)`,
        }}
      />
      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-[0.05]"
        style={{
          background: 'linear-gradient(to top, rgba(139,92,246,0.1) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}

function AmbientParticles() {
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: 1 + Math.random() * 2,
    opacity: 0.15 + Math.random() * 0.25,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-amber-300"
          style={{
            left: p.left,
            bottom: '-5%',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-up ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
