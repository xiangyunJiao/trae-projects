import { useState, useCallback } from 'react';
import { useGameStore, RewardItem } from '@/store/gameStore';
import Dice from '@/components/Dice';
import GameBoard from '@/components/GameBoard';
import UserInfo from '@/components/UserInfo';
import RewardModal from '@/components/RewardModal';
import VictoryModal from '@/components/VictoryModal';

export default function Home() {
  const { 
    currentPosition, 
    cells, 
    coins, 
    setCurrentPosition, 
    setCoins, 
    setShowModal, 
    setCurrentReward,
    showModal,
    currentReward,
    hasFinished,
    setHasFinished,
    isRolling,
    isMoving,
    setIsMoving,
  } = useGameStore();
  
  const [showVictory, setShowVictory] = useState(false);
  
  const triggerCellEvent = useCallback((position: number) => {
    const cell = cells[position];
    if (cell.reward) {
      setTimeout(() => {
        handleCellEvent(cell.reward!, position);
      }, 300);
    }
  }, [cells]);
  
  const moveToPosition = useCallback((from: number, to: number, onComplete?: () => void) => {
    setIsMoving(true);
    
    let currentStep = 0;
    const direction = to > from ? 1 : -1;
    const totalSteps = Math.abs(to - from);
    
    const moveInterval = setInterval(() => {
      currentStep++;
      const newPosition = Math.min(Math.max(from + direction * currentStep, 0), 39);
      setCurrentPosition(newPosition);
      
      if (currentStep >= totalSteps || newPosition >= 39 || newPosition <= 0) {
        clearInterval(moveInterval);
        setIsMoving(false);
        
        if (newPosition >= 39) {
          setHasFinished(true);
          setTimeout(() => {
            setShowVictory(true);
          }, 500);
          return;
        }
        
        if (onComplete) {
          onComplete(newPosition);
        } else {
          triggerCellEvent(newPosition);
        }
      }
    }, 300);
  }, [setCurrentPosition, setIsMoving, setHasFinished, triggerCellEvent]);
  
  const handleRollComplete = useCallback((steps: number) => {
    if (isMoving) return;
    
    const targetPosition = Math.min(currentPosition + steps, 39);
    moveToPosition(currentPosition, targetPosition);
  }, [currentPosition, isMoving, moveToPosition]);
  
  const handleCellEvent = useCallback((reward: RewardItem, position: number) => {
    setCurrentReward(reward);
    setShowModal(true);
    
    if (reward.type === 'coins') {
      setCoins(Math.max(0, coins + reward.value));
    } else if (reward.type === 'forward') {
      setTimeout(() => {
        const newPosition = Math.min(position + reward.value, 39);
        moveToPosition(position, newPosition);
      }, 500);
    } else if (reward.type === 'backward') {
      setTimeout(() => {
        const newPosition = Math.max(position - reward.value, 0);
        moveToPosition(position, newPosition);
      }, 500);
    }
  }, [coins, moveToPosition, setCoins, setCurrentReward, setShowModal]);
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReward(null);
  };
  
  const handleCloseVictory = () => {
    setShowVictory(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 p-4 md:p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-lg mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 mb-6 drop-shadow-lg">
          🎲 幸运大冒险 🎲
        </h1>
        
        <UserInfo />
        
        <div className="mb-6">
          <GameBoard />
        </div>
        
        <div className="flex justify-center">
          <Dice onRollComplete={handleRollComplete} />
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-4">
          点击骰子开始冒险，到达终点获得终极大奖！
        </p>
      </div>
      
      {showModal && currentReward && (
        <RewardModal reward={currentReward} onClose={handleCloseModal} />
      )}
      
      {showVictory && (
        <VictoryModal onClose={handleCloseVictory} />
      )}
    </div>
  );
}
