import { Crown } from 'lucide-react';
import { User } from '@/types';

interface CenterAvatarProps {
  user: User;
}

export default function CenterAvatar({ user }: CenterAvatarProps) {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
      <div className="relative">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <Crown 
            className="w-12 h-12 text-gold-400 drop-shadow-lg animate-float" 
            strokeWidth={2}
            fill="currentColor"
          />
        </div>
        
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 wheel-border glow-gold">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="absolute inset-0 rounded-full animate-pulse-soft" 
          style={{ 
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
          }}
        />
      </div>
      
      <div className="mt-3 text-center">
        <div className="font-serif text-lg sm:text-xl font-bold text-white text-shadow-gold">
          {user.name}
        </div>
        <div className="text-xs sm:text-sm text-zodiac-100 mt-1">
          送礼之王 · ¥{user.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
