import { useCallback, useRef } from 'react';
import type { BallState } from '../types';

const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 300;
const BALL_RADIUS = 25;
const GRAVITY = 0.15;
const FRICTION = 0.995;
const BOUNCE = 0.85;
const EXIT_WIDTH = 70;

export function useGachaAnimation() {
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isShakingRef = useRef(false);
  const ballsRef = useRef<BallState[]>([]);
  const rotationRef = useRef(0);
  const guideBallIdRef = useRef<number | null>(null);
  const droppedBallRef = useRef<BallState | null>(null);
  const onBallDroppedRef = useRef<((ball: BallState, exitX: number, exitY: number) => void) | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const totalDurationRef = useRef(4500);
  const hasDroppedRef = useRef(false);

  const updateBallPhysics = useCallback((ball: BallState, balls: BallState[], containerRotation: number, elapsed: number): BallState => {
    let { x, y, vx, vy } = ball;

    const rotationRad = (containerRotation * Math.PI) / 180;
    const rotatedGravityX = Math.sin(rotationRad) * GRAVITY * 3;
    const rotatedGravityY = Math.cos(rotationRad) * GRAVITY;

    vx += rotatedGravityX;
    vy += rotatedGravityY;

    if (isShakingRef.current) {
      const shakeForce = 8;
      vx += (Math.random() - 0.5) * shakeForce;
      vy += (Math.random() - 0.5) * shakeForce;
    }

    const isGuided = ball.id === guideBallIdRef.current;
    if (isGuided && elapsed > totalDurationRef.current - 2000) {
      const exitCenterX = CONTAINER_WIDTH / 2;
      const exitCenterY = CONTAINER_HEIGHT;
      const dx = exitCenterX - x;
      const dy = exitCenterY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const guideForce = 0.8;
        vx += (dx / dist) * guideForce;
        vy += (dy / dist) * guideForce;
      }
    }

    vx *= FRICTION;
    vy *= FRICTION;

    const speed = Math.sqrt(vx * vx + vy * vy);
    const maxSpeed = 25;
    if (speed > maxSpeed) {
      vx = (vx / speed) * maxSpeed;
      vy = (vy / speed) * maxSpeed;
    }

    x += vx;
    y += vy;

    if (x - BALL_RADIUS < 0) {
      x = BALL_RADIUS;
      vx = -vx * BOUNCE;
      vy += (Math.random() - 0.5) * 2;
    }
    if (x + BALL_RADIUS > CONTAINER_WIDTH) {
      x = CONTAINER_WIDTH - BALL_RADIUS;
      vx = -vx * BOUNCE;
      vy += (Math.random() - 0.5) * 2;
    }
    if (y - BALL_RADIUS < 0) {
      y = BALL_RADIUS;
      vy = -vy * BOUNCE;
      vx += (Math.random() - 0.5) * 2;
    }

    const exitCenterX = CONTAINER_WIDTH / 2;
    const exitLeft = exitCenterX - EXIT_WIDTH / 2;
    const exitRight = exitCenterX + EXIT_WIDTH / 2;
    const isNearExit = x > exitLeft && x < exitRight;

    if (isGuided && isNearExit && y + BALL_RADIUS > CONTAINER_HEIGHT - 5 && vy > 0) {
      if (!hasDroppedRef.current) {
        hasDroppedRef.current = true;
        droppedBallRef.current = { ...ball, x, y };
        if (onBallDroppedRef.current) {
          onBallDroppedRef.current({ ...ball, x, y }, x, y);
        }
        return { ...ball, x: -9999, y: -9999, vx: 0, vy: 0 };
      }
    }

    if (y + BALL_RADIUS > CONTAINER_HEIGHT) {
      y = CONTAINER_HEIGHT - BALL_RADIUS;
      vy = -vy * BOUNCE;
      vx *= 0.98;
      vx += (Math.random() - 0.5) * 3;
    }

    balls.forEach((other) => {
      if (other.id === ball.id) return;
      if (other.x < -500) return;

      const dx = other.x - x;
      const dy = other.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = BALL_RADIUS * 2;

      if (distance < minDistance && distance > 0) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDistance - distance;
        const separationX = Math.cos(angle) * overlap * 0.5;
        const separationY = Math.sin(angle) * overlap * 0.5;

        x -= separationX;
        y -= separationY;
        other.x += separationX;
        other.y += separationY;

        const totalVelocity = Math.sqrt(vx * vx + vy * vy) + Math.sqrt(other.vx * other.vx + other.vy * other.vy);
        const energyTransfer = 0.6;

        const tempVx = vx;
        const tempVy = vy;
        vx = other.vx * BOUNCE * energyTransfer + tempVx * (1 - energyTransfer);
        vy = other.vy * BOUNCE * energyTransfer + tempVy * (1 - energyTransfer);
        other.vx = tempVx * BOUNCE * energyTransfer + other.vx * (1 - energyTransfer);
        other.vy = tempVy * BOUNCE * energyTransfer + other.vy * (1 - energyTransfer);

        const newTotal = Math.sqrt(vx * vx + vy * vy) + Math.sqrt(other.vx * other.vx + other.vy * other.vy);
        if (newTotal > 0) {
          const scale = Math.min(totalVelocity / newTotal, 1.2);
          vx *= scale;
          vy *= scale;
          other.vx *= scale;
          other.vy *= scale;
        }
      }
    });

    return { ...ball, x, y, vx, vy };
  }, []);

  const startShaking = useCallback(() => {
    isShakingRef.current = true;
  }, []);

  const stopShaking = useCallback(() => {
    isShakingRef.current = false;
  }, []);

  const animate = useCallback(
    (
      balls: BallState[],
      setBalls: (balls: BallState[]) => void,
      onBallDropped: (ball: BallState, exitX: number, exitY: number) => void,
      onComplete: () => void,
      duration: number = 4500
    ) => {
      startTimeRef.current = Date.now();
      isShakingRef.current = true;
      ballsRef.current = [...balls];
      rotationRef.current = 0;
      guideBallIdRef.current = null;
      droppedBallRef.current = null;
      hasDroppedRef.current = false;
      onBallDroppedRef.current = onBallDropped;
      onCompleteRef.current = onComplete;
      totalDurationRef.current = duration;

      const forceDropBall = () => {
        if (hasDroppedRef.current) return;
        const currentBalls = ballsRef.current.filter(b => b.x > -500);
        if (currentBalls.length === 0) {
          onComplete();
          return;
        }

        const exitX = CONTAINER_WIDTH / 2;
        const exitY = CONTAINER_HEIGHT;
        let closestBall = currentBalls[0];
        let closestDist = Infinity;

        currentBalls.forEach(ball => {
          const dist = Math.sqrt((ball.x - exitX) ** 2 + (ball.y - exitY) ** 2);
          if (dist < closestDist) {
            closestDist = dist;
            closestBall = ball;
          }
        });

        hasDroppedRef.current = true;
        droppedBallRef.current = closestBall;
        onBallDroppedRef.current?.(closestBall, closestBall.x, closestBall.y);

        const remaining = currentBalls.filter(b => b.id !== closestBall.id);
        ballsRef.current = remaining;
        setBalls([...remaining]);
      };

      const animateFrame = () => {
        const elapsed = Date.now() - startTimeRef.current;

        if (elapsed >= duration + 500) {
          isShakingRef.current = false;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          forceDropBall();
          setTimeout(onComplete, 800);
          return;
        }

        if (elapsed >= duration - 2500 && guideBallIdRef.current === null) {
          const currentBalls = ballsRef.current.filter(b => b.x > -500);
          const exitX = CONTAINER_WIDTH / 2;
          const exitY = CONTAINER_HEIGHT;
          let closestId = currentBalls[0]?.id ?? 0;
          let closestDist = Infinity;

          currentBalls.forEach(ball => {
            const dist = Math.sqrt((ball.x - exitX) ** 2 + (ball.y - exitY) ** 2);
            if (dist < closestDist) {
              closestDist = dist;
              closestId = ball.id;
            }
          });

          guideBallIdRef.current = closestId;
        }

        const shakeStartFade = Math.min(elapsed / 800, 1);
        const shakeEndFade = elapsed > duration - 1500 ? Math.max(0, 1 - (elapsed - (duration - 1500)) / 800) : 1;
        const shakeMultiplier = shakeStartFade * shakeEndFade;

        const rotationAmplitude = 12 * Math.sin(elapsed / 180) * shakeMultiplier;
        rotationRef.current = rotationAmplitude;

        if (elapsed > duration - 1500) {
          isShakingRef.current = false;
        }

        const currentBalls = ballsRef.current;
        for (let i = 0; i < currentBalls.length; i++) {
          const ball = currentBalls[i];
          if (ball.x < -500) continue;
          const updatedBall = updateBallPhysics({ ...ball }, currentBalls, rotationRef.current, elapsed);
          currentBalls[i] = updatedBall;
        }

        const visibleBalls = currentBalls.filter(b => b.x > -500);
        setBalls([...visibleBalls]);

        if (hasDroppedRef.current) {
          isShakingRef.current = false;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          setTimeout(onComplete, 800);
          return;
        }

        animationFrameRef.current = requestAnimationFrame(animateFrame);
      };

      animationFrameRef.current = requestAnimationFrame(animateFrame);
    },
    [updateBallPhysics]
  );

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    isShakingRef.current = false;
    rotationRef.current = 0;
    guideBallIdRef.current = null;
    droppedBallRef.current = null;
    hasDroppedRef.current = false;
  }, []);

  const giveInitialVelocity = useCallback((balls: BallState[]): BallState[] => {
    return balls.map((ball, index) => {
      const angle = (index / balls.length) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 12 + Math.random() * 8;
      return {
        ...ball,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
      };
    });
  }, []);

  return {
    animate,
    stopAnimation,
    startShaking,
    stopShaking,
    giveInitialVelocity,
    updateBallPhysics,
    CONTAINER_WIDTH,
    CONTAINER_HEIGHT,
    BALL_RADIUS,
  };
}
