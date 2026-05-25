import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { playDiceRollSound, playDiceStopSound } from '@/utils/sound';

interface DiceProps {
  onRollComplete: (value: number) => void;
}

const DICE_FACES = [
  { value: 1, dots: [[0, 0]] },
  { value: 2, dots: [[-1, -1], [1, 1]] },
  { value: 3, dots: [[-1, -1], [0, 0], [1, 1]] },
  { value: 4, dots: [[-1, -1], [1, -1], [-1, 1], [1, 1]] },
  { value: 5, dots: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]] },
  { value: 6, dots: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] },
];

const FACE_TRANSFORMS = [
  { value: 1, transform: 'rotateY(0deg) translateZ(var(--half))' },
  { value: 2, transform: 'rotateY(90deg) translateZ(var(--half))' },
  { value: 3, transform: 'rotateX(90deg) translateZ(var(--half))' },
  { value: 4, transform: 'rotateX(-90deg) translateZ(var(--half))' },
  { value: 5, transform: 'rotateY(-90deg) translateZ(var(--half))' },
  { value: 6, transform: 'rotateY(180deg) translateZ(var(--half))' },
];

const FINAL_ROTATIONS: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(-90deg)',
  3: 'rotateX(-90deg) rotateY(0deg)',
  4: 'rotateX(90deg) rotateY(0deg)',
  5: 'rotateX(0deg) rotateY(90deg)',
  6: 'rotateX(0deg) rotateY(180deg)',
};

export default function Dice({ onRollComplete }: DiceProps) {
  const { isRolling, diceValue } = useGameStore();
  const [rollAnimation, setRollAnimation] = useState('');
  const [finalRotation, setFinalRotation] = useState('rotateX(0deg) rotateY(0deg)');
  const [settledValue, setSettledValue] = useState<number | null>(null);

  useEffect(() => {
    if (isRolling) {
      setRollAnimation('dice-rolling');
      setSettledValue(null);
    } else if (diceValue) {
      setRollAnimation('');
      setSettledValue(diceValue);
      setFinalRotation(FINAL_ROTATIONS[diceValue]);
    }
  }, [isRolling, diceValue]);

  const handleClick = () => {
    if (isRolling) return;
    
    useGameStore.getState().setIsRolling(true);
    useGameStore.getState().setDiceValue(null);
    playDiceRollSound();
    
    setTimeout(() => {
      const finalValue = Math.floor(Math.random() * 6) + 1;
      useGameStore.getState().setDiceValue(finalValue);
      useGameStore.getState().setIsRolling(false);
      playDiceStopSound();
      onRollComplete(finalValue);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <style>{`
        @keyframes dice-rolling {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
          50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
          75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg); }
          100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
        }
        .dice-rolling {
          animation: dice-rolling 0.5s linear infinite;
        }
      `}</style>
      
      <div
        onClick={handleClick}
        className={`
          relative cursor-pointer select-none
          transition-transform duration-100
          ${!isRolling ? 'hover:scale-110 active:scale-95' : ''}
        `}
        style={{ perspective: '600px' }}
      >
        <div
          className={`relative w-20 h-20 md:w-24 md:h-24 ${rollAnimation}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: !isRolling && settledValue ? finalRotation : undefined,
            transition: !isRolling && settledValue ? 'transform 0.5s ease-out' : 'none',
            ['--half' as string]: '40px',
          }}
        >
          {FACE_TRANSFORMS.map(({ value, transform }) => (
            <div
              key={value}
              className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 border-4 border-red-700 rounded-2xl shadow-xl flex items-center justify-center"
              style={{
                transform,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="relative w-full h-full p-3">
                {DICE_FACES[value - 1].dots.map(([x, y], idx) => (
                  <div
                    key={idx}
                    className="absolute w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-inner"
                    style={{
                      left: `calc(50% + ${x * 28}% - 8px)`,
                      top: `calc(50% + ${y * 28}% - 8px)`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-3xl blur-lg opacity-60 -z-10" />
      </div>
      
      <p className={`text-sm md:text-base font-bold ${isRolling ? 'text-yellow-400 animate-pulse' : 'text-gray-300'}`}>
        {isRolling ? '摇骰子中...' : diceValue ? `摇到了 ${diceValue} 点` : '点击骰子开始'}
      </p>
    </div>
  );
}
