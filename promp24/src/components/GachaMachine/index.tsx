import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameMode, AnimationState, BallState, Reward } from '../../types';
import { createInitialBalls } from '../../data/rewards';
import { useAudio } from '../../hooks/useAudio';
import { useGachaAnimation } from '../../hooks/useGachaAnimation';
import { Ball } from './Ball';
import { Switch } from './Switch';
import { RewardModal } from './RewardModal';

interface GachaMachineProps {
  mode: GameMode;
  onAnimationStateChange?: (state: AnimationState) => void;
}

const MACHINE_WIDTH = 420;
const DOME_TOP = 96;
const DOME_SIZE = 320;
const DOME_LEFT = (MACHINE_WIDTH - DOME_SIZE) / 2;
const DOME_PADDING = 10;

export function GachaMachine({ mode, onAnimationStateChange }: GachaMachineProps) {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [balls, setBalls] = useState<BallState[]>(() => createInitialBalls(mode));
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [droppingBallColor, setDroppingBallColor] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [containerRotation, setContainerRotation] = useState(0);
  const [droppingBallMachinePos, setDroppingBallMachinePos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const prevModeRef = useRef(mode);
  const ballsRef = useRef<BallState[]>([]);

  const { playShakeSound, playRollSound, playDropSound, playWinSound } = useAudio();
  const { animate, stopAnimation, giveInitialVelocity, CONTAINER_WIDTH, CONTAINER_HEIGHT, BALL_RADIUS } = useGachaAnimation();

  const updateAnimationState = useCallback((newState: AnimationState) => {
    setAnimationState(newState);
    onAnimationStateChange?.(newState);
  }, [onAnimationStateChange]);

  useEffect(() => {
    if (prevModeRef.current !== mode) {
      stopAnimation();
      updateAnimationState('idle');
      setIsShaking(false);
      setSelectedReward(null);
      setShowModal(false);
      setDroppingBallColor('');
      setDroppingBallMachinePos({ x: 0, y: 0, visible: false });
      setContainerRotation(0);
      ballsRef.current = [];
      prevModeRef.current = mode;
    }
    setBalls(createInitialBalls(mode));
  }, [mode, stopAnimation, updateAnimationState]);

  useEffect(() => {
    let rotationAnimationId: number;
    let rotationStartTime = 0;

    const updateRotation = () => {
      if (isShaking && animationState === 'rolling') {
        if (rotationStartTime === 0) rotationStartTime = Date.now();
        const elapsed = Date.now() - rotationStartTime;
        const shakeProgress = Math.min(elapsed / 1000, 1);
        const rotation = 12 * Math.sin(elapsed / 180) * shakeProgress;
        setContainerRotation(rotation);
      } else {
        setContainerRotation(0);
        rotationStartTime = 0;
      }
      rotationAnimationId = requestAnimationFrame(updateRotation);
    };

    if (isShaking && animationState === 'rolling') {
      rotationAnimationId = requestAnimationFrame(updateRotation);
    }

    return () => {
      if (rotationAnimationId) {
        cancelAnimationFrame(rotationAnimationId);
      }
    };
  }, [isShaking, animationState]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  const handleBallDropped = useCallback((ball: BallState, exitX: number, exitY: number) => {
    setSelectedReward(ball.reward);
    setDroppingBallColor(ball.color);

    const machineX = DOME_LEFT + DOME_PADDING + exitX;
    const machineY = DOME_TOP + DOME_PADDING + exitY;

    setDroppingBallMachinePos({
      x: machineX,
      y: machineY,
      visible: true,
    });

    updateAnimationState('dropping');
    playDropSound();
  }, [playDropSound, updateAnimationState]);

  const handleRollComplete = useCallback(() => {
    stopAnimation();
    setIsShaking(false);

    setTimeout(() => {
      updateAnimationState('showing');
      setShowModal(true);
      playWinSound();
    }, 700);
  }, [stopAnimation, playWinSound, updateAnimationState]);

  const handleSwitchClick = useCallback(() => {
    if (animationState !== 'idle') return;

    playShakeSound();
    updateAnimationState('switching');

    setTimeout(() => {
      playRollSound();
      updateAnimationState('rolling');
      setIsShaking(true);

      const ballsWithVelocity = giveInitialVelocity(balls);
      ballsRef.current = ballsWithVelocity;
      setBalls(ballsWithVelocity);

      const trackBalls = (newBalls: BallState[]) => {
        ballsRef.current = newBalls;
        setBalls([...newBalls]);
      };

      animate(ballsWithVelocity, trackBalls, handleBallDropped, handleRollComplete, 4500);
    }, 500);
  }, [animationState, balls, animate, giveInitialVelocity, handleBallDropped, handleRollComplete, playShakeSound, playRollSound, updateAnimationState]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    updateAnimationState('idle');
    setSelectedReward(null);
    setDroppingBallColor('');
    setDroppingBallMachinePos({ x: 0, y: 0, visible: false });
    setBalls(createInitialBalls(mode));
    ballsRef.current = [];
  }, [mode, updateAnimationState]);

  const isDisabled = animationState !== 'idle';
  const isRotating = animationState === 'switching' || animationState === 'rolling';

  const machineGradient = mode === 'normal'
    ? 'from-purple-900 via-purple-800 to-indigo-900'
    : 'from-amber-900 via-yellow-800 to-orange-900';

  const machineBorder = mode === 'normal'
    ? 'border-purple-600'
    : 'border-yellow-500';

  const machineGlow = mode === 'premium'
    ? 'shadow-2xl shadow-yellow-500/40'
    : 'shadow-2xl shadow-purple-900/50';

  return (
    <div className="relative">
      <div
        className={`
          relative w-[420px] h-[500px] rounded-3xl border-8 ${machineBorder} ${machineGlow}
          bg-gradient-to-b ${machineGradient}
          overflow-visible
          ${isShaking ? 'animate-machine-shake' : ''}
          ${mode === 'premium' ? 'animate-machine-glow' : ''}
        `}
      >
        <div className="absolute top-4 left-0 right-0 text-center z-30">
          <h1
            className="text-3xl font-bold tracking-wider"
            style={{
              background: mode === 'premium'
                ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)'
                : 'linear-gradient(135deg, #FF6B35, #FF8C42, #FFB347)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Creepster", cursive',
              textShadow: '0 0 20px rgba(255,107,53,0.5)',
            }}
          >
            🎃 万圣扭蛋机 🎃
          </h1>
        </div>

        <div className="absolute top-3 left-3 text-3xl animate-float z-40 pointer-events-none">👻</div>
        <div className="absolute top-3 right-3 text-3xl animate-float z-40 pointer-events-none" style={{ animationDelay: '0.5s' }}>🦇</div>
        <div className="absolute top-16 left-6 text-2xl animate-float z-40 pointer-events-none" style={{ animationDelay: '1s' }}>🕷️</div>
        <div className="absolute top-16 right-6 text-2xl animate-float z-40 pointer-events-none" style={{ animationDelay: '1.5s' }}>🍬</div>

        <div
          className="absolute top-24 left-1/2 rounded-[50%] border-8 overflow-hidden z-20"
          style={{
            width: CONTAINER_WIDTH + 20,
            height: CONTAINER_HEIGHT + 20,
            left: '50%',
            transform: `translateX(-50%) rotate(${containerRotation}deg)`,
            transformOrigin: 'center center',
            transition: animationState === 'idle' ? 'transform 0.3s ease-out' : 'none',
            borderColor: mode === 'premium' ? '#FFD700' : '#4C1D95',
            background: 'linear-gradient(180deg, rgba(139,69,19,0.3) 0%, rgba(30,30,60,0.8) 100%)',
            boxShadow: `
              inset 0 0 60px rgba(0,0,0,0.5),
              inset 0 0 100px rgba(255,255,255,0.05),
              ${mode === 'premium' ? '0 0 40px rgba(255,215,0,0.3)' : ''}
            `,
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[50%]"
            style={{
              transform: `rotate(${-containerRotation}deg)`,
              transition: animationState === 'idle' ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            {balls.map((ball) => (
              <Ball
                key={ball.id}
                x={ball.x + 10}
                y={ball.y + 10}
                color={ball.color}
                radius={BALL_RADIUS}
                mode={mode}
              />
            ))}

            {mode === 'premium' && (
              <>
                <div className="absolute top-4 left-4 text-xl animate-sparkle">✨</div>
                <div className="absolute top-12 right-8 text-xl animate-sparkle" style={{ animationDelay: '0.3s' }}>⭐</div>
                <div className="absolute bottom-8 left-8 text-xl animate-sparkle" style={{ animationDelay: '0.6s' }}>✨</div>
                <div className="absolute bottom-4 right-4 text-xl animate-sparkle" style={{ animationDelay: '0.9s' }}>⭐</div>
              </>
            )}
          </div>
        </div>

        <div
          className="absolute top-24 left-1/2 rounded-[50%] pointer-events-none z-30"
          style={{
            width: CONTAINER_WIDTH + 20,
            height: CONTAINER_HEIGHT + 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        <Switch
          isRotating={isRotating}
          onClick={handleSwitchClick}
          disabled={isDisabled}
        />

        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-24 h-16 z-20">
          <div
            className="absolute inset-0 rounded-b-3xl border-4 border-t-0"
            style={{
              borderColor: mode === 'premium' ? '#FFD700' : '#4C1D95',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a15 100%)',
            }}
          />
        </div>

        {animationState === 'dropping' && droppingBallMachinePos.visible && (
          <div
            className="absolute z-25 animate-ball-exit"
            style={{
              left: droppingBallMachinePos.x - BALL_RADIUS,
              top: droppingBallMachinePos.y - BALL_RADIUS,
              width: BALL_RADIUS * 2,
              height: BALL_RADIUS * 2,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${droppingBallColor}ee, ${droppingBallColor} 50%, ${droppingBallColor}aa 100%)`,
                boxShadow: `
                  inset -5px -5px 15px rgba(0,0,0,0.3),
                  inset 5px 5px 15px rgba(255,255,255,0.3),
                  0 0 20px ${droppingBallColor}80
                `,
              }}
            >
              <div
                className="absolute rounded-full bg-white/40"
                style={{
                  left: '20%',
                  top: '15%',
                  width: '35%',
                  height: '25%',
                  filter: 'blur(2px)',
                }}
              />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-30">
          <p className="text-white/70 text-sm">
            {animationState === 'idle' && '点击右侧开关开始抽奖'}
            {animationState === 'switching' && '正在扭动...'}
            {animationState === 'rolling' && '小球滚动中...'}
            {animationState === 'dropping' && '奖品出来啦！'}
          </p>
        </div>

        <div className="absolute bottom-20 left-4 text-4xl z-30">🎃</div>
        <div className="absolute bottom-20 right-4 text-4xl z-30">👹</div>
      </div>

      <RewardModal
        reward={selectedReward}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
