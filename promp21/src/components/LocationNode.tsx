import React from 'react';
import { Lock, Unlock, Gift, Check } from 'lucide-react';
import { LocationData } from '@/types';

interface LocationNodeProps {
  location: LocationData;
  isLeft: boolean;
  screenWidth: number;
  onClaim: (locationId: number) => void;
}

const LocationNode: React.FC<LocationNodeProps> = ({ location, isLeft, screenWidth, onClaim }) => {
  const isStart = location.id === 0;
  const isUnlocked = location.unlocked;
  const isClaimed = location.claimed;

  const positionStyle = isStart
    ? { left: '50%', transform: 'translate(-50%, -50%)' }
    : isLeft
    ? { left: location.x, transform: 'translateY(-50%)' }
    : { right: screenWidth - location.x, transform: 'translateY(-50%)' };

  return (
    <div
      className="absolute"
      style={{
        top: location.y,
        ...positionStyle
      }}
    >
      <div className={`flex items-center gap-3 ${isLeft || isStart ? '' : 'flex-row-reverse'}`}>
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full border-4 overflow-hidden transition-all duration-500 ${
              isUnlocked
                ? 'border-green-400 shadow-lg shadow-green-400/30'
                : 'border-gray-400'
            }`}
          >
            <img
              src={location.image}
              alt={location.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isUnlocked ? 'blur-0 scale-100' : 'blur-sm scale-110'
              }`}
            />
          </div>
          
          {!isStart && (
            <div
              className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                isUnlocked
                  ? 'bg-green-500 scale-100 opacity-100'
                  : 'bg-gray-500 scale-90 opacity-80'
              }`}
            >
              {isUnlocked ? (
                <Unlock className="w-3 h-3 text-white" />
              ) : (
                <Lock className="w-3 h-3 text-white" />
              )}
            </div>
          )}
        </div>

        <div className={`flex flex-col ${isLeft || isStart ? 'items-start' : 'items-end'}`}>
          <p className={`text-sm font-semibold transition-colors duration-300 ${
            isUnlocked ? 'text-gray-800' : 'text-gray-500'
          }`}>
            {location.name}
          </p>
          <p className="text-xs text-gray-500">
            {location.points} 积分
          </p>
          
          {!isStart && isUnlocked && !isClaimed && (
            <button
              onClick={() => onClaim(location.id)}
              className="mt-2 px-3 py-1.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-medium rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-1"
            >
              <Gift className="w-3 h-3" />
              领取奖励
            </button>
          )}
          
          {!isStart && isClaimed && (
            <div className="mt-2 px-3 py-1.5 bg-gray-200 text-gray-500 text-xs font-medium rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              已领取
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationNode;
