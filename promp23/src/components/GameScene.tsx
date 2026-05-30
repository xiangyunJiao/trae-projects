import React from 'react';
import FootballField from './FootballField';
import Player from './Player';
import Goalkeeper from './Goalkeeper';
import Football from './Football';
import KickButton from './KickButton';
import WinModal from './WinModal';
import LoseModal from './LoseModal';
import { useGameLogic } from '@/hooks/useGameLogic';

const GameScene: React.FC = () => {
  const {
    gameState,
    shootResult,
    showWinModal,
    showLoseModal,
    loseReason,
    handleKick,
    handleBallComplete,
    resetGame,
    isKicking,
  } = useGameLogic();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <FootballField>
        <>
          <Goalkeeper
            saveDirection={shootResult?.saveDirection || null}
            isActive={gameState === 'ballFlying' || gameState === 'result'}
          />

          <Player isKicking={gameState === 'kicking' || gameState === 'ballFlying'} />

          <Football
            isFlying={gameState === 'ballFlying' || gameState === 'result'}
            isWin={shootResult?.isWin || false}
            targetX={shootResult?.angle.horizontal || 0}
            targetY={shootResult?.angle.vertical || 0.5}
            onComplete={handleBallComplete}
          />

          <KickButton onClick={handleKick} disabled={isKicking} />

          <div className="absolute top-4 left-0 right-0 text-center">
            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-wider">
              ⚽ 世界杯点球大战 ⚽
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-1 drop-shadow">
              点击射门，赢取大奖！
            </p>
          </div>
        </>
      </FootballField>

      {showWinModal && shootResult?.prize && (
        <WinModal prize={shootResult.prize} onClose={resetGame} />
      )}

      {showLoseModal && (
        <LoseModal onClose={resetGame} reason={loseReason} />
      )}
    </div>
  );
};

export default GameScene;
