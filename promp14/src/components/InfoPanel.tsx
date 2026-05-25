import { X, MapPin, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { Landmark } from '../data/landmarks';

interface InfoPanelProps {
  landmark: Landmark | null;
  coords: { lat: number; lng: number } | null;
  onClose: () => void;
}

export default function InfoPanel({ landmark, coords, onClose }: InfoPanelProps) {
  const [isMuted, setIsMuted] = useState(false);

  const handleSpeak = () => {
    if (isMuted) {
      window.speechSynthesis?.cancel();
      return;
    }

    if (landmark) {
      const text = `${landmark.name}，${landmark.nameEn}。${landmark.description}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis?.speak(utterance);
    } else if (coords) {
      const text = `纬度 ${coords.lat.toFixed(4)} 度，经度 ${coords.lng.toFixed(4)} 度`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      window.speechSynthesis?.speak(utterance);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis?.cancel();
    }
  };

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-20">
      <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 text-white shadow-2xl border border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">
              {landmark ? landmark.name : '未知位置'}
            </h3>
            {landmark?.nameEn && (
              <span className="text-white/60 text-sm">({landmark.nameEn})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isMuted ? '开启声音' : '关闭声音'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white/60" />
              ) : (
                <Volume2 className="w-5 h-5 text-blue-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {landmark ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{landmark.icon}</span>
              <span className="px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded-full text-xs capitalize">
                {landmark.type === 'city' ? '城市' : 
                 landmark.type === 'mountain' ? '山脉' :
                 landmark.type === 'ocean' ? '海洋' :
                 landmark.type === 'landmark' ? '地标' : '地区'}
              </span>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-3">
              {landmark.description}
            </p>

            {landmark.altitude && (
              <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                <span>🏔️ 海拔:</span>
                <span className="text-yellow-400">{landmark.altitude} 米</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={handleSpeak}
                disabled={isMuted}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
              >
                {isMuted ? '语音已关闭' : '🔊 播放介绍'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-white/60 text-sm mb-3">
              该位置没有预定义的地标信息
            </p>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">纬度</span>
                <span className="text-blue-400">{coords?.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">经度</span>
                <span className="text-blue-400">{coords?.lng.toFixed(4)}°</span>
              </div>
            </div>
          </>
        )}

        {coords && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex justify-between text-xs text-white/50">
              <span>精确坐标</span>
              <span>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
