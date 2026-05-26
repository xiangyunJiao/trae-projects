import { useEffect, useState } from 'react';
import { RaceTrack } from './components/RaceTrack';
import { BetModal } from './components/BetModal';
import { ResultModal } from './components/ResultModal';
import { CoinRain } from './components/CoinRain';
import { Confetti } from './components/Confetti';
import { BetButton } from './components/BetButton';
import { useGameState } from './hooks/useGameState';
import { useAudio } from './hooks/useAudio';

function App() {
  const {
    phase,
    countdown,
    horses,
    winnerId,
    userCoins,
    currentBet,
    showBetModal,
    showResultModal,
    isWinner,
    winAmount,
    showCoinRain,
    placeBet,
    setShowBetModal,
    closeResultModal,
  } = useGameState();

  const { playStartSound, playWinSound, playLoseSound, playCoinSound } = useAudio();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasPlayedStartSound, setHasPlayedStartSound] = useState(false);

  useEffect(() => {
    if (phase === 'racing' && !hasPlayedStartSound) {
      playStartSound();
      setHasPlayedStartSound(true);
    }
    if (phase !== 'racing') {
      setHasPlayedStartSound(false);
    }
  }, [phase, hasPlayedStartSound, playStartSound]);

  useEffect(() => {
    if (showCoinRain) {
      playWinSound();
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [showCoinRain, playWinSound]);

  useEffect(() => {
    if (showResultModal && !isWinner && currentBet) {
      playLoseSound();
    }
  }, [showResultModal, isWinner, currentBet, playLoseSound]);

  const winnerHorse = horses.find(h => h.id === winnerId) || null;
  const isRacing = phase === 'racing';
  const showBetButton = phase === 'countdown';

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏇</span>
            <h1 className="text-xl md:text-2xl font-bold text-white">赛马竞猜</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 rounded-full shadow-lg">
            <span className="text-xl">💰</span>
            <span className="text-lg font-bold text-white">{userCoins.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          {phase === 'countdown' && (
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-full shadow-lg">
              <span>⏰</span>
              <span className="font-bold">距离比赛开始：{countdown}秒</span>
            </div>
          )}
          {phase === 'racing' && (
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full shadow-lg animate-pulse">
              <span>🏃</span>
              <span className="font-bold">比赛进行中...</span>
            </div>
          )}
          {phase === 'waiting' && (
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-full shadow-lg">
              <span>⏳</span>
              <span className="font-bold">下一场比赛：{countdown}秒后开始</span>
            </div>
          )}
          {phase === 'finished' && (
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-full shadow-lg">
              <span>🏆</span>
              <span className="font-bold">比赛结束！</span>
            </div>
          )}
        </div>

        <RaceTrack
          horses={horses}
          isRacing={isRacing}
          winnerId={winnerId}
        />

        <div className="mt-6 grid grid-cols-3 gap-4">
          {horses.map((horse, index) => (
            <div
              key={horse.id}
              className={`p-4 rounded-xl text-center transition-all ${
                winnerId === horse.id
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg scale-105'
                  : 'bg-white/10'
              }`}
            >
              <div className="text-3xl mb-2">
                {horse.color === 'white' && '🤍'}
                {horse.color === 'brown' && '🤎'}
                {horse.color === 'black' && '🖤'}
              </div>
              <div className={`font-bold ${winnerId === horse.id ? 'text-white' : 'text-white/80'}`}>
                {horse.name}
              </div>
              <div className={`text-sm ${winnerId === horse.id ? 'text-white/90' : 'text-white/60'}`}>
                第{index + 1}跑道
              </div>
              {winnerId === horse.id && (
                <div className="mt-2 text-yellow-200 font-bold">🏆 冠军！</div>
              )}
            </div>
          ))}
        </div>

        {currentBet && phase !== 'settlement' && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center">
            <span className="text-green-300">
              🎯 当前押注：{horses.find(h => h.id === currentBet.horseId)?.name} - {currentBet.amount}金币
            </span>
          </div>
        )}
      </div>

      <BetButton
        onClick={() => setShowBetModal(true)}
        visible={showBetButton}
      />

      <BetModal
        isOpen={showBetModal}
        countdown={countdown}
        userCoins={userCoins}
        currentBet={currentBet}
        onClose={() => setShowBetModal(false)}
        onPlaceBet={(horseId, amount) => placeBet({ horseId, amount })}
      />

      <ResultModal
        isOpen={showResultModal}
        isWinner={isWinner}
        winAmount={winAmount}
        winnerHorse={winnerHorse ? { id: winnerHorse.id, name: winnerHorse.name, color: winnerHorse.color } : null}
        onClose={closeResultModal}
      />

      <CoinRain
        active={showCoinRain}
      />

      <Confetti active={showConfetti} />
    </div>
  );
}

export default App;
