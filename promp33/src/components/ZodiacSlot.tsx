import { User, ZodiacSign } from '@/types';

interface ZodiacSlotProps {
  zodiac: ZodiacSign;
  user: User | null;
  angle: number;
  wheelSize: number;
}

export default function ZodiacSlot({ zodiac, user, angle, wheelSize }: ZodiacSlotProps) {
  const radius = wheelSize * 0.40;
  const slotSize = wheelSize * 0.12;
  const symbolFontSize = Math.max(10, wheelSize * 0.035);
  
  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

  return (
    <div 
      className="absolute hardware-accelerate"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="hardware-accelerate animate-spin-counter flex flex-col items-center"
        style={{ animationDuration: '8s' }}
      >
        <div 
          className={`rounded-full border-3 shadow-lg hardware-accelerate
            ${user ? 'border-gold-400 slot-occupied glow-gold' : 'border-white slot-empty'}
            transition-all duration-500`}
          style={{
            width: `${slotSize}px`,
            height: `${slotSize}px`,
            padding: `${Math.max(2, slotSize * 0.07)}px`,
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden hardware-accelerate">
            {user ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  className="text-zodiac-300 opacity-60"
                  fill="currentColor"
                  style={{ width: '50%', height: '50%' }}
                >
                  <path d="M12 2L13.09 8.26L19 9L14.5 13.67L15.91 20L12 16.77L8.09 20L9.5 13.67L5 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <span 
          className="text-white drop-shadow-lg leading-none mt-1"
          style={{ fontSize: `${symbolFontSize}px` }}
        >
          {zodiac.symbol}
        </span>
      </div>
    </div>
  );
}
