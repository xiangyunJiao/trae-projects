import React, { useState, useEffect } from 'react';

interface FinishLineProps {
  isRacing: boolean;
  winnerId: number | null;
  horses: { id: number; position: number }[];
}

export const FinishLine: React.FC<FinishLineProps> = ({ isRacing, winnerId, horses }) => {
  const [ropePhase, setRopePhase] = useState<'idle' | 'stretching' | 'broken' | 'fallen'>('idle');

  useEffect(() => {
    const leadingHorse = horses.reduce((lead, h) => h.position > lead.position ? h : lead, horses[0]);
    
    if (leadingHorse && leadingHorse.position >= 90 && ropePhase === 'idle' && isRacing) {
      setRopePhase('stretching');
      
      setTimeout(() => {
        setRopePhase('broken');
      }, 500);
      
      setTimeout(() => {
        setRopePhase('fallen');
      }, 1300);
    }
  }, [horses, ropePhase, isRacing]);

  useEffect(() => {
    if (!isRacing && !winnerId) {
      setRopePhase('idle');
    }
  }, [isRacing, winnerId]);

  return (
    <div className="absolute right-4 top-0 bottom-0 flex flex-col items-center">
      <div className="absolute left-0 top-0 bottom-0 w-2">
        <div className="h-full w-full bg-gradient-to-b from-gray-500 via-gray-400 to-gray-500 rounded shadow-lg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-full shadow -mt-1" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-full shadow mb-1" />
        </div>
      </div>

      {ropePhase === 'idle' && (
        <div className="absolute left-2 top-[10%] w-3 h-[80%]">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-400 to-red-600 rounded shadow-lg" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white/40 rounded" />
            <div className="absolute top-[12.5%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[25%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[37.5%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[62.5%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[75%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[87.5%] left-0 right-0 h-0.5 bg-white/30" />
          </div>
        </div>
      )}

      {ropePhase === 'stretching' && (
        <div className="absolute left-2 top-[10%] w-3 h-[80%] animate-rope-stretch">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-400 to-red-600 rounded shadow-lg" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white/40 rounded" />
            <div className="absolute top-[12.5%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[25%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[37.5%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[62.5%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[75%] left-0 right-0 h-0.5 bg-white/30" />
            <div className="absolute top-[87.5%] left-0 right-0 h-0.5 bg-white/30" />
            
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6">
              <div className="w-full h-full bg-red-400 rounded-full animate-ping opacity-40" />
            </div>
          </div>
        </div>
      )}

      {(ropePhase === 'broken' || ropePhase === 'fallen') && (
        <>
          <div className="absolute left-2 top-[10%] w-3 h-[35%] animate-rope-break-top">
            <div className="w-full h-full bg-gradient-to-b from-red-600 to-red-400 rounded" />
          </div>
          <div className="absolute left-2 top-[55%] w-3 h-[35%] animate-rope-break-bottom">
            <div className="w-full h-full bg-gradient-to-t from-red-600 to-red-400 rounded" />
          </div>
          
          {ropePhase === 'broken' && (
            <>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-2 top-1/2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#ef4444' : '#fbbf24',
                    '--tx': `${Math.cos((i * 36) * Math.PI / 180) * (25 + Math.random() * 20)}px`,
                    '--ty': `${Math.sin((i * 36) * Math.PI / 180) * (25 + Math.random() * 20)}px`,
                    animation: 'rope-particle 0.6s ease-out forwards',
                    animationDelay: `${i * 0.02}s`,
                  } as React.CSSProperties}
                />
              ))}
            </>
          )}
          
          {ropePhase === 'fallen' && (
            <div className="absolute left-0 bottom-[-20px] animate-rope-fall">
              <div className="w-8 h-2 bg-red-500 rounded-full opacity-60 transform rotate-12" />
              <div className="w-6 h-2 bg-red-400 rounded-full opacity-50 transform -rotate-15 ml-2 mt-1" />
            </div>
          )}
        </>
      )}

      <div className="absolute -top-3 right-0 z-10">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg transform rotate-12 border-2 border-yellow-400">
          🏁 FINISH
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 z-10">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg transform -rotate-12 border-2 border-yellow-400">
          🏁 FINISH
        </div>
      </div>
    </div>
  );
};
