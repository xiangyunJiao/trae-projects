import React, { useEffect, useState, useMemo } from 'react';
import './Football.css';

interface FootballProps {
  isFlying: boolean;
  isWin: boolean;
  targetX: number;
  targetY: number;
  onComplete: () => void;
}

const Football: React.FC<FootballProps> = ({ isFlying, isWin, targetX, targetY, onComplete }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [showTrail, setShowTrail] = useState(false);
  const [ballState, setBallState] = useState<'idle' | 'flying' | 'inGoal' | 'outside' | 'saved'>('idle');

  const baseEndX = targetX * 140;
  const baseEndY = -280 - targetY * 80;
  
  let endX = baseEndX;
  let endY = baseEndY;
  let finalState: 'inGoal' | 'outside' | 'saved' = 'outside';
  
  if (isWin && isFlying) {
    const clampedX = Math.max(-45, Math.min(45, baseEndX));
    const adjustedY = Math.min(-250, baseEndY);
    endX = clampedX;
    endY = adjustedY;
    finalState = 'inGoal';
  } else if (!isWin && isFlying) {
    if (Math.abs(targetX) > 0.6 || targetY < 0.2 || targetY > 0.9) {
      endX = targetX * 200;
      endY = -200 - targetY * 60;
      finalState = 'outside';
    } else {
      endX = targetX * 80;
      endY = -340 - targetY * 40;
      finalState = 'saved';
    }
  }

  const scale = 0.35 + targetY * 0.3;
  const midY = -130 - targetY * 40;

  const flightAnimation = useMemo(() => {
    const keyframes = `
      @keyframes ballFlight${animationKey} {
        0% {
          transform: translate(-50%, 0) scale(1);
        }
        15% {
          transform: translate(calc(-50% + ${endX * 0.1}px), ${midY * 0.25}px) scale(0.92);
        }
        30% {
          transform: translate(calc(-50% + ${endX * 0.25}px), ${midY * 0.55}px) scale(0.82);
        }
        45% {
          transform: translate(calc(-50% + ${endX * 0.45}px), ${midY}px) scale(0.72);
        }
        60% {
          transform: translate(calc(-50% + ${endX * 0.65}px), ${midY * 0.9}px) scale(0.62);
        }
        75% {
          transform: translate(calc(-50% + ${endX * 0.85}px), ${endY * 0.8}px) scale(${scale * 1.05});
        }
        90% {
          transform: translate(calc(-50% + ${endX * 0.95}px), ${endY * 0.95}px) scale(${scale * 0.98});
        }
        100% {
          transform: translate(calc(-50% + ${endX}px), ${endY}px) scale(${scale});
        }
      }
    `;
    return keyframes;
  }, [animationKey, endX, endY, midY, scale]);

  useEffect(() => {
    if (isFlying) {
      setAnimationKey(prev => prev + 1);
      setShowTrail(true);
      setBallState('flying');
      
      const timer = setTimeout(() => {
        setBallState(finalState);
        onComplete();
        setTimeout(() => setShowTrail(false), 500);
      }, 1400);
      
      return () => clearTimeout(timer);
    }
  }, [isFlying, finalState, onComplete]);

  const getBallStyle = (): React.CSSProperties => {
    if (!isFlying && ballState === 'idle') {
      return {
        transform: 'translate(-50%, 0) scale(1)',
        animation: 'none',
        zIndex: 60,
      };
    }

    if (ballState === 'inGoal') {
      return {
        transform: `translate(calc(-50% + ${endX}px), ${endY}px) scale(${scale})`,
        animation: 'none',
        zIndex: 8,
      };
    }

    if (ballState === 'saved' || ballState === 'outside') {
      return {
        transform: `translate(calc(-50% + ${endX}px), ${endY}px) scale(${scale})`,
        animation: 'none',
        zIndex: 60,
      };
    }

    return {
      animation: `ballFlight${animationKey} 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
      zIndex: 150,
    };
  };

  return (
    <>
      <style>{flightAnimation}</style>
      
      {showTrail && isFlying && (
        <div className="ball-trail-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="ball-trail"
              style={{
                left: `calc(50% + ${endX * (i + 1) / 13}px)`,
                top: `calc(92% + ${-midY * Math.sin(Math.PI * (i + 1) / 13) + endY * (i + 1) / 13}px)`,
                opacity: 0.5 - i * 0.04,
                transform: `scale(${1 - i * 0.07})`,
                animationDelay: `${i * 0.07}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        key={`ball-${animationKey}`}
        className={`absolute bottom-[8%] left-1/2 football ${isFlying ? 'flying' : ''} ${ballState === 'inGoal' ? 'in-goal' : ''} ${ballState === 'saved' ? 'saved' : ''}`}
        style={getBallStyle()}
      >
        <div className="relative w-12 h-12 md:w-14 md:h-14">
          <div className="absolute inset-0 rounded-full ball-3d-scene">
            <div className="absolute inset-0 rounded-full ball-sphere">
              <div className="absolute inset-0 rounded-full ball-surface">
                <div className="absolute inset-0 rounded-full ball-pentagons">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <polygon points="50,10 64,32 36,32" fill="#000" opacity="0.95" />
                    <polygon points="16,38 36,32 28,56" fill="#000" opacity="0.9" />
                    <polygon points="84,38 64,32 72,56" fill="#000" opacity="0.9" />
                    <polygon points="50,90 36,68 64,68" fill="#000" opacity="0.9" />
                    <polygon points="10,65 28,56 33,78" fill="#000" opacity="0.85" />
                    <polygon points="90,65 72,56 67,78" fill="#000" opacity="0.85" />
                    <polygon points="50,50 36,32 28,56 36,68" fill="#000" opacity="0.95" />
                    <polygon points="50,50 64,32 72,56 64,68" fill="#000" opacity="0.95" />
                    <polygon points="22,22 35,30 30,40 22,38" fill="#000" opacity="0.7" />
                    <polygon points="78,22 65,30 70,40 78,38" fill="#000" opacity="0.7" />
                    <polygon points="15,80 28,72 32,82 20,88" fill="#000" opacity="0.6" />
                    <polygon points="85,80 72,72 68,82 80,88" fill="#000" opacity="0.6" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full ball-shading-layer" />
                <div className="absolute inset-0 rounded-full ball-highlight-layer" />
                <div className="absolute inset-0 rounded-full ball-specular-spot" />
                <div className="absolute top-1 left-2 w-4 h-4 rounded-full ball-primary-highlight" />
                <div className="absolute top-2.5 left-3.5 w-2 h-2 rounded-full ball-secondary-highlight" />
                <div className="absolute top-2 left-5 w-1 h-1 rounded-full ball-sparkle" />
              </div>
              <div className="absolute inset-0 rounded-full ball-rim-light" />
            </div>
          </div>
          
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full ball-shadow" />
        </div>
      </div>
    </>
  );
};

export default Football;
