import React, { useRef } from 'react';

interface BillboardProps {
  isRacing: boolean;
  position: 'top' | 'bottom';
}

const billboardDesigns = [
  { icon: '🏆', text: '赛马场', color: 'from-red-500 to-red-700', textColor: 'text-yellow-200' },
  { icon: '💰', text: '金币大派送', color: 'from-yellow-400 to-amber-500', textColor: 'text-red-800' },
  { icon: '🐎', text: '马术俱乐部', color: 'from-green-600 to-emerald-700', textColor: 'text-white' },
  { icon: '🎰', text: '幸运抽奖', color: 'from-purple-500 to-pink-600', textColor: 'text-yellow-200' },
  { icon: '🍺', text: '马场酒吧', color: 'from-amber-600 to-orange-700', textColor: 'text-white' },
  { icon: '🎪', text: '嘉年华', color: 'from-blue-500 to-cyan-600', textColor: 'text-yellow-200' },
  { icon: '🎯', text: '精准投注', color: 'from-indigo-500 to-violet-600', textColor: 'text-yellow-200' },
  { icon: '🏅', text: '冠军之路', color: 'from-rose-500 to-red-600', textColor: 'text-yellow-100' },
];

const BillboardsContent = () => (
  <div className="flex h-full items-center gap-4 px-4 flex-shrink-0">
    {billboardDesigns.map((ad, i) => (
      <div
        key={i}
        className={`relative px-4 py-2 rounded-lg bg-gradient-to-r ${ad.color} ${ad.textColor} font-bold shadow-md border-2 border-white/20 flex-shrink-0`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/30 rounded-t-lg" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 rounded-b-lg" />
        <div className="flex items-center gap-2">
          <span className="text-xl">{ad.icon}</span>
          <span className="text-sm whitespace-nowrap">{ad.text}</span>
        </div>
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600" />
      </div>
    ))}
  </div>
);

export const Billboard: React.FC<BillboardProps> = ({ isRacing, position }) => {
  const topStyle = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <div className={`absolute left-0 right-0 h-[50px] ${topStyle} overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-b from-stone-700 to-stone-800 border-y-2 border-stone-900" />
      
      <div className="absolute inset-0 flex items-center opacity-50">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-full bg-stone-600"
            style={{ left: `${(i / 25) * 100}%` }}
          />
        ))}
      </div>

      <div className="relative h-full overflow-hidden">
        <div 
          className="flex h-full"
          style={{
            animation: isRacing ? 'billboardScroll 10s linear infinite' : 'none',
          }}
        >
          <BillboardsContent />
          <BillboardsContent />
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-stone-800 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-stone-800 to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-900" />
    </div>
  );
};
