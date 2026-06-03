import React, { useEffect, useState } from 'react';
import { CARDS } from '@/data/cards';
import { useGameStore } from '@/store/gameStore';
import { CardFront } from '@/components/CardFaces';
import { Sparkles, Crown } from 'lucide-react';

export const CardRevealModal: React.FC = () => {
  const { phase, selectedCardId, collectCard, resetGame } = useGameStore();
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  const card = CARDS.find((c) => c.id === selectedCardId);

  useEffect(() => {
    if (phase === 'revealed' && card) {
      collectCard(card.id);
      window.setTimeout(() => {
        setVisible(true);
        window.setTimeout(() => setAnimIn(true), 50);
      }, 300);
    }
  }, [phase, card, collectCard]);

  if (!visible || !card) return null;

  const handleClose = () => {
    setAnimIn(false);
    window.setTimeout(() => {
      setVisible(false);
      resetGame();
    }, 300);
  };

  const uniqueCount = useGameStore.getState().backpack.filter((i) => i.count > 0).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          animIn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-500 ${
          animIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-2xl blur-xl opacity-60"
            style={{
              background: `radial-gradient(circle, ${card.colors[1]}80, ${card.colors[0]}40, transparent)`,
            }}
          />
          <div className="relative w-40 h-56 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-[0_0_40px_rgba(255,215,0,0.3)]">
            <CardFront card={card} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-amber-300">
          <Sparkles size={20} className="animate-pulse" />
          <span className="text-xl font-bold tracking-wide">获得 {card.name}</span>
          <Sparkles size={20} className="animate-pulse" />
        </div>

        <div className="text-purple-300/80 text-sm">
          已收集 {uniqueCount}/6 种卡牌
        </div>

        {uniqueCount >= 6 && (
          <div className="flex items-center gap-2 text-amber-400 animate-bounce">
            <Crown size={20} />
            <span className="font-bold">🎉 恭喜集齐全部卡牌！获得神秘大奖！</span>
            <Crown size={20} />
          </div>
        )}

        <button
          onClick={handleClose}
          className="mt-2 px-8 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-900 font-bold hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          继续翻牌
        </button>
      </div>
    </div>
  );
};

export const GrandPrizeModal: React.FC = () => {
  const { hasWonGrandPrize } = useGameStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hasWonGrandPrize) {
      const timer = window.setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasWonGrandPrize]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-amber-900/90 to-purple-900/90 border-2 border-amber-400/50 shadow-[0_0_60px_rgba(255,215,0,0.4)]">
        <Crown size={64} className="text-amber-400 animate-bounce" />
        <h2 className="text-3xl font-bold text-amber-300">🏆 神秘大奖 🏆</h2>
        <p className="text-amber-200/80 text-center leading-relaxed">
          恭喜你集齐了全部6张魔法卡牌！<br />
          你获得了传说中的神秘大奖！
        </p>
        <div className="text-4xl animate-pulse">✨🌟✨</div>
        <button
          onClick={() => setShow(false)}
          className="px-8 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-purple-900 font-bold hover:scale-105 active:scale-95 transition-transform"
        >
          太棒了！
        </button>
      </div>
    </div>
  );
};
