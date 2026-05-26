import React from 'react';
import { Horse } from './Horse';
import { Horse as HorseType } from '../types';
import { Billboard } from './Billboard';
import { FinishLine } from './FinishLine';

interface RaceTrackProps {
  horses: HorseType[];
  isRacing: boolean;
  winnerId: number | null;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ horses, isRacing, winnerId }) => {
  return (
    <div className="relative w-full h-[280px] bg-gradient-to-b from-sky-400 to-sky-300 overflow-hidden rounded-xl shadow-2xl">
      <div className="absolute inset-0 top-0 h-[50px]">
        <div className="absolute top-4 left-[10%] w-14 h-6 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute top-6 left-[30%] w-18 h-8 bg-white rounded-full opacity-60" />
        <div className="absolute top-4 right-[20%] w-20 h-10 bg-white rounded-full opacity-65 animate-pulse" />
      </div>

      <Billboard isRacing={isRacing} position="top" />
      
      <div className="absolute top-[50px] left-0 right-0 bottom-[50px] bg-gradient-to-b from-green-600 to-green-700">
        <div className="absolute inset-0 opacity-30">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-green-900"
              style={{ top: `${i * 7 + 3}%` }}
            />
          ))}
        </div>

        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-full h-0.5 bg-amber-100/50"
            style={{ top: `${i * 25 + 12}%` }}
          />
        ))}

        <div className="absolute left-3 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 via-white to-red-500">
          <div className="absolute top-1 left-2 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold text-red-600 shadow">
            START
          </div>
        </div>

        <FinishLine isRacing={isRacing} winnerId={winnerId} horses={horses} />

        <div className="absolute inset-0 overflow-hidden">
          {horses.map((horse, index) => (
            <Horse
              key={horse.id}
              color={horse.color}
              position={horse.position * 0.88 + 6}
              isRunning={isRacing}
              lane={index}
            />
          ))}
        </div>
      </div>

      <Billboard isRacing={isRacing} position="bottom" />
    </div>
  );
};
