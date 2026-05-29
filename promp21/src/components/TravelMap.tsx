import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LocationData, Reward } from '@/types';
import { generateLocationPoints } from '@/data/locations';
import { getRandomReward } from '@/data/rewards';
import { generateSmoothPath, getPointAtProgress, calculateAllLocationProgresses, calculatePlaneProgress } from '@/utils/pathGenerator';
import { fetchUserPoints, updateUserPoints } from '@/services/api';
import ScoreBoard from './ScoreBoard';
import LocationNode from './LocationNode';
import Airplane from './Airplane';
import RewardModal from './RewardModal';

const TravelMap: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [pathD, setPathD] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0, angle: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const pathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>();
  const unlockedLocations = useRef<Set<number>>(new Set([0]));
  const containerRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef(0);
  const locationProgressesRef = useRef<number[]>([]);
  const isLocationProgressesCalculated = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const initialLocations = generateLocationPoints();
      setLocations(initialLocations);
      setPathD(generateSmoothPath(initialLocations));
      
      const response = await fetchUserPoints('user_001');
      if (response.success && response.data) {
        setUserPoints(response.data.points);
      }
      
      setIsLoading(false);
      
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'auto'
        });
      }, 100);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (pathRef.current && locations.length > 0 && !isLocationProgressesCalculated.current) {
      locationProgressesRef.current = calculateAllLocationProgresses(pathRef.current, locations);
      isLocationProgressesCalculated.current = true;
    }
  }, [pathD, locations.length]);

  useEffect(() => {
    if (pathRef.current && locations.length > 0 && isLocationProgressesCalculated.current) {
      const targetProgress = calculatePlaneProgress(userPoints, locations, locationProgressesRef.current);
      
      const startProgress = currentProgressRef.current;
      const distance = Math.abs(targetProgress - startProgress);
      
      if (distance < 0.0001) {
        currentProgressRef.current = targetProgress;
        const pos = getPointAtProgress(pathRef.current, targetProgress);
        setPlanePosition(pos);
        return;
      }
      
      const duration = Math.max(distance * 8000, 1500);
      let startTime: number | null = null;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        
        const eased = rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
        
        const currentProgress = startProgress + (targetProgress - startProgress) * eased;
        currentProgressRef.current = currentProgress;
        
        const pos = getPointAtProgress(pathRef.current!, currentProgress);
        setPlanePosition(pos);
        
        locations.forEach((loc, index) => {
          if (index > 0 && !unlockedLocations.current.has(index)) {
            const locProgress = locationProgressesRef.current[index];
            if (currentProgress >= locProgress - 0.001) {
              unlockedLocations.current.add(index);
              setLocations(prev => prev.map(l => 
                l.id === index ? { ...l, unlocked: true } : l
              ));
            }
          }
        });
        
        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [userPoints, locations.length]);

  const handleClaimReward = useCallback((locationId: number) => {
    const reward = getRandomReward();
    setCurrentReward(reward);
    setIsModalOpen(true);
    setLocations(prev => prev.map(l => 
      l.id === locationId ? { ...l, claimed: true } : l
    ));
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentReward(null);
  }, []);

  const minY = locations.length > 0 ? Math.min(...locations.map(l => l.y)) : 0;
  const maxY = locations.length > 0 ? Math.max(...locations.map(l => l.y)) : 1400;
  const svgHeight = maxY - minY + 200;
  const svgWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth, 500) : 375;

  const transformY = (y: number) => y - minY + 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-sky-100 overflow-x-hidden">
      <ScoreBoard 
        currentPoints={userPoints} 
        totalPoints={locations.length > 0 ? locations[locations.length - 1].points : 6000} 
      />

      <div className="relative pt-28 pb-32">
        <div 
          className="relative mx-auto"
          style={{ 
            width: svgWidth, 
            height: svgHeight,
            maxWidth: '100%',
            overflow: 'visible'
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 ${minY - 100} ${svgWidth} ${svgHeight}`}
            className="absolute inset-0"
            style={{ overflow: 'visible' }}
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12 8"
              filter="url(#pathGlow)"
              className="opacity-80"
            />

            <path
              d={pathD}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="12 8"
              strokeDashoffset="12"
              className="opacity-60"
            />
          </svg>

          {locations.map((location) => (
            <LocationNode
              key={location.id}
              location={{
                ...location,
                y: transformY(location.y)
              }}
              isLeft={location.id % 2 === 0 && location.id !== 0}
              screenWidth={svgWidth}
              onClaim={handleClaimReward}
            />
          ))}

          <Airplane 
            x={planePosition.x} 
            y={transformY(planePosition.y)} 
            angle={planePosition.angle} 
          />
        </div>
      </div>

      <RewardModal
        isOpen={isModalOpen}
        reward={currentReward}
        onClose={handleCloseModal}
      />

      <div className="fixed bottom-4 left-4 right-4 flex gap-2 z-40">
        <button
          onClick={async () => {
            const newPoints = Math.max(0, userPoints - 500);
            setUserPoints(newPoints);
            await updateUserPoints('user_001', newPoints);
          }}
          className="flex-1 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
        >
          -500 积分
        </button>
        <button
          onClick={async () => {
            const newPoints = Math.min(userPoints + 500, 6000);
            setUserPoints(newPoints);
            await updateUserPoints('user_001', newPoints);
          }}
          className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all"
        >
          +500 积分
        </button>
      </div>

      <style>{`
        @keyframes flicker {
          0% { opacity: 0.6; height: 24px; }
          100% { opacity: 0.9; height: 32px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default TravelMap;
