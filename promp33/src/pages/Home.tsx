import { Sparkles } from 'lucide-react';
import ZodiacWheel from '@/components/ZodiacWheel';
import Decorations from '@/components/Decorations';
import { mockActivityData } from '@/data/mockData';
import { zodiacSigns } from '@/data/zodiac';

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <Decorations />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center py-8 px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-gold-400 animate-twinkle" />
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white text-shadow-gold">
              星座王座
            </h1>
            <Sparkles className="w-6 h-6 text-gold-400 animate-twinkle" style={{ animationDelay: '1.5s' }} />
          </div>
          <p className="text-zodiac-100 text-sm sm:text-base">
            12星座·谁是你的星座之王
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <ZodiacWheel 
            topUser={mockActivityData.topUser}
            zodiacRanks={mockActivityData.zodiacRanks}
          />
        </div>
        
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="font-serif text-xl text-white text-center mb-4 text-shadow-purple">
            星座榜单
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {zodiacSigns.map((zodiac) => {
              const rank = mockActivityData.zodiacRanks.find(r => r.zodiacId === zodiac.id);
              const user = rank?.user;
              return (
                <div 
                  key={zodiac.id}
                  className={`rounded-xl p-3 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105
                    ${user 
                      ? 'bg-gradient-to-br from-gold-400/30 to-gold-300/20 border border-gold-400/50' 
                      : 'bg-white/10 border border-white/20'}`}
                >
                  <div className="text-2xl mb-1">{zodiac.symbol}</div>
                  <div className="text-xs text-white/90 font-medium">{zodiac.name}</div>
                  <div className="text-[10px] text-white/60 mt-0.5">{zodiac.dateRange}</div>
                  {user ? (
                    <div className="mt-2">
                      <div className="w-8 h-8 mx-auto rounded-full overflow-hidden border-2 border-gold-400">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[10px] text-gold-300 mt-1 truncate">{user.name}</div>
                      <div className="text-[9px] text-white/70">¥{user.amount.toLocaleString()}</div>
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-white/50">
                      虚位以待
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-zodiac-100/70">
            活动说明：在对应星座时段送礼第一名即可登上星座王座
          </p>
        </div>
      </div>
    </div>
  );
}