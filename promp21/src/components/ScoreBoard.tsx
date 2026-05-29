import React from 'react';
import { Star } from 'lucide-react';

interface ScoreBoardProps {
  currentPoints: number;
  totalPoints: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ currentPoints, totalPoints }) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <p className="text-white/80 text-sm">我的积分</p>
              <p className="text-white text-2xl font-bold">{currentPoints.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">总目标</p>
            <p className="text-white text-xl font-semibold">{totalPoints.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-300 to-orange-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((currentPoints / totalPoints) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
