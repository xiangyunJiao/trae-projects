import React from 'react';
import { CARDS } from '@/data/cards';
import { useGameStore } from '@/store/gameStore';
import { CardFront } from '@/components/CardFaces';
import { ArrowLeft, Crown, Sparkles } from 'lucide-react';

const BackpackPage: React.FC = () => {
  const { backpack, hasWonGrandPrize } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0520] via-[#1a0a2e] to-[#0d0520] text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full bg-purple-900/60 border border-purple-500/30 text-amber-300 hover:bg-purple-800/60 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-amber-300 tracking-wider">我的背包</h1>
          <Sparkles size={20} className="text-amber-400 ml-auto animate-pulse" />
        </div>

        {hasWonGrandPrize && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-900/50 to-yellow-900/50 border border-amber-400/40 flex items-center gap-3">
            <Crown size={32} className="text-amber-400" />
            <div>
              <div className="text-amber-300 font-bold">🏆 神秘大奖已获得！</div>
              <div className="text-amber-200/60 text-sm">你已集齐全部6张魔法卡牌</div>
            </div>
          </div>
        )}

        {!hasWonGrandPrize && (
          <div className="mb-6 p-4 rounded-2xl bg-purple-900/30 border border-purple-500/20 text-center">
            <div className="text-purple-300 text-sm mb-1">集齐6种卡牌赢取神秘大奖</div>
            <div className="flex justify-center gap-1">
              {CARDS.map((card) => {
                const owned = backpack.find((i) => i.cardId === card.id);
                return (
                  <div
                    key={card.id}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs"
                    style={{
                      borderColor: owned ? card.colors[1] : '#4a3070',
                      backgroundColor: owned ? card.colors[0] + '40' : 'transparent',
                      color: owned ? card.colors[2] : '#4a3070',
                    }}
                  >
                    {owned ? '✓' : '?'}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {CARDS.map((card) => {
            const item = backpack.find((i) => i.cardId === card.id);
            const count = item?.count ?? 0;

            return (
              <div
                key={card.id}
                className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
                  count > 0
                    ? 'border-amber-400/40 shadow-[0_0_15px_rgba(255,215,0,0.15)]'
                    : 'border-purple-800/30 opacity-40 grayscale'
                }`}
              >
                <div className="aspect-[5/7]">
                  <CardFront card={card} />
                </div>
                {count > 0 && (
                  <div className="absolute top-1.5 right-1.5 bg-amber-500 text-purple-900 text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5 shadow-lg">
                    ×{count}
                  </div>
                )}
                {count === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl opacity-30">?</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-purple-400/60 text-sm">
          共获得 {backpack.reduce((s, i) => s + i.count, 0)} 张卡牌 · {backpack.filter((i) => i.count > 0).length}/6 种
        </div>
      </div>
    </div>
  );
};

export default BackpackPage;
