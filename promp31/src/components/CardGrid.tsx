import React, { useRef, useCallback, useEffect, useState } from 'react';
import { CARDS } from '@/data/cards';
import { CardFront, CardBack } from '@/components/CardFaces';
import { useGameStore } from '@/store/gameStore';
import { Backpack } from 'lucide-react';

const CARD_WIDTH = 110;
const CARD_HEIGHT = 154;
const GAP = 16;
const COLS = 3;
const ROWS = 2;
const GRID_WIDTH = COLS * CARD_WIDTH + (COLS - 1) * GAP;
const GRID_HEIGHT = ROWS * CARD_HEIGHT + (ROWS - 1) * GAP;

function getGridPosition(index: number): { x: number; y: number } {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return {
    x: col * (CARD_WIDTH + GAP),
    y: row * (CARD_HEIGHT + GAP),
  };
}

const SHUFFLE_DURATION = 4000;

interface ShuffleStep {
  cardA: number;
  cardB: number;
  delay: number;
  duration: number;
}

function generateShuffleSteps(): ShuffleStep[] {
  const steps: ShuffleStep[] = [];
  let elapsed = 0;

  while (elapsed < SHUFFLE_DURATION - 200) {
    let swapDuration: number;
    let pause: number;

    if (elapsed < 1200) {
      swapDuration = 380;
      pause = 80;
    } else if (elapsed < 2500) {
      swapDuration = 250;
      pause = 40;
    } else {
      swapDuration = 130;
      pause = 20;
    }

    const cardA = Math.floor(Math.random() * 6);
    let cardB = Math.floor(Math.random() * 5);
    if (cardB >= cardA) cardB++;

    steps.push({ cardA, cardB, delay: elapsed, duration: swapDuration });
    elapsed += swapDuration + pause;
  }

  return steps;
}

export const CardGrid: React.FC = () => {
  const { phase, setPhase, selectCard } = useGameStore();
  const [cardSlots, setCardSlots] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [transitionMs, setTransitionMs] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealAnim, setRevealAnim] = useState(false);
  const animRef = useRef<number[]>([]);
  const slotsRef = useRef<number[]>([0, 1, 2, 3, 4, 5]);

  const runShuffle = useCallback(() => {
    const steps = generateShuffleSteps();
    const current = [...slotsRef.current];

    steps.forEach((step) => {
      const timer = window.setTimeout(() => {
        setTransitionMs(step.duration);
        [current[step.cardA], current[step.cardB]] = [current[step.cardB], current[step.cardA]];
        slotsRef.current = [...current];
        setCardSlots([...current]);
      }, step.delay);
      animRef.current.push(timer);
    });

    const endTimer = window.setTimeout(() => {
      setTransitionMs(0);
      setPhase('selecting');
    }, SHUFFLE_DURATION + 100);
    animRef.current.push(endTimer);
  }, [setPhase]);

  useEffect(() => {
    const timers = animRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (phase === 'display') {
      setIsFlipped(false);
      setRevealAnim(false);
      setSelectedCard(null);
      setTransitionMs(0);
      const initialSlots = [0, 1, 2, 3, 4, 5];
      setCardSlots(initialSlots);
      slotsRef.current = initialSlots;
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'flipping') {
      setIsFlipped(true);
      const timer = window.setTimeout(() => {
        runShuffle();
        setPhase('shuffling');
      }, 600);
      animRef.current.push(timer);
    }
  }, [phase, runShuffle, setPhase]);

  const handleCardClick = (cardIndex: number) => {
    if (phase !== 'selecting') return;
    const cardId = CARDS[cardIndex].id;
    setSelectedCard(cardIndex);
    setRevealAnim(true);

    window.setTimeout(() => {
      selectCard(cardId);
    }, 600);
  };

  const handleStart = () => {
    if (phase !== 'display') return;
    setSelectedCard(null);
    setRevealAnim(false);
    const initialSlots = [0, 1, 2, 3, 4, 5];
    setCardSlots(initialSlots);
    slotsRef.current = initialSlots;
    useGameStore.getState().startGame();
  };

  const showGuide = phase === 'selecting';
  const btnDisabled = phase !== 'display';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}>
        {showGuide && <GuideFinger />}

        {CARDS.map((cardData, cardIndex) => {
          const slotPos = getGridPosition(cardSlots[cardIndex]);
          const isRevealing = revealAnim && selectedCard === cardIndex;

          return (
            <div
              key={cardIndex}
              className="absolute cursor-pointer"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transform: `translate(${slotPos.x}px, ${slotPos.y}px)`,
                transition: transitionMs > 0
                  ? `transform ${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`
                  : 'none',
                zIndex: isRevealing ? 20 : 1,
                perspective: '800px',
              }}
              onClick={() => handleCardClick(cardIndex)}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease-in-out',
                  transform: isRevealing
                    ? 'rotateY(0deg) scale(1.05)'
                    : isFlipped
                      ? 'rotateY(180deg)'
                      : 'rotateY(0deg)',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardFront card={cardData} />
                </div>
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <CardBack />
                </div>

                {phase === 'selecting' && (
                  <div
                    className="absolute inset-0 rounded-lg border-2 border-transparent hover:border-amber-400/50 transition-colors duration-200"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={btnDisabled}
        className={`
          relative px-10 py-3 rounded-full text-lg font-bold tracking-wider
          transition-all duration-300 transform
          ${btnDisabled
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed scale-95'
            : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-purple-900 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.4)]'
          }
        `}
      >
        <span className="relative z-10">翻卡牌</span>
        {!btnDisabled && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 hover:opacity-30 transition-opacity duration-300" />
        )}
      </button>
    </div>
  );
};

const GuideFinger: React.FC = () => {
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1">
      <div className="text-amber-300/80 text-sm font-medium whitespace-nowrap">
        请选择一张卡牌
      </div>
      <div
        className="relative"
        style={{
          animation: 'guide-sweep 1.8s ease-in-out infinite',
        }}
      >
        <svg width="44" height="60" viewBox="0 0 44 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 6C22 6 15 16 15 24C15 28 18 32 22 32C26 32 29 28 29 24C29 16 22 6 22 6Z"
            fill="#fcd34d"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <ellipse cx="19" cy="29" rx="3" ry="1.5" fill="#fde68a" opacity="0.6" />
          
          <path
            d="M15 32C15 32 13 40 15 46C16 50 18 52 22 52C26 52 28 50 29 46C31 40 29 32 29 32"
            fill="#fcd34d"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <path
            d="M11 40C11 40 8 44 9 48C9.5 51 11 52.5 13.5 52.5"
            fill="#fcd34d"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <path
            d="M33 40C33 40 36 44 35 48C34.5 51 33 52.5 30.5 52.5"
            fill="#fcd34d"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <path
            d="M18 52L18 56"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M22 52L22 58"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M26 52L26 56"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          <path
            d="M13 50L9 54M31 50L35 54"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};

export const BackpackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const backpack = useGameStore((s) => s.backpack);
  const totalCards = backpack.reduce((sum, item) => sum + item.count, 0);

  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/80 border border-purple-500/40 text-amber-300 hover:bg-purple-800/80 transition-all duration-200 backdrop-blur-sm"
    >
      <Backpack size={18} />
      <span className="text-sm font-semibold">背包</span>
      {totalCards > 0 && (
        <span className="ml-1 bg-amber-500 text-purple-900 text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1">
          {totalCards}
        </span>
      )}
    </button>
  );
};
