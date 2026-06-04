import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Trash2, AlertTriangle, Info } from 'lucide-react';

interface AudioRecorderProps {
  onAudioChange: (file: File | null) => void;
  initialAudioUrl?: string;
}

export default function AudioRecorder({ onAudioChange, initialAudioUrl }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    if (initialAudioUrl) {
      setAudioUrl(initialAudioUrl);
    }
  }, [initialAudioUrl]);

  const checkMediaDevicesSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isHttps = window.location.protocol === 'https:';
      
      if (!isLocalhost && !isHttps) {
        setError('❌ 麦克风功能需要HTTPS环境才能使用');
        setShowPermissionHelp(true);
        return false;
      }
      setError('❌ 您的浏览器不支持录音功能');
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    setError(null);
    setShowPermissionHelp(false);

    if (!checkMediaDevicesSupport()) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          const file = new File([audioBlob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
          fileRef.current = file;
          setAudioUrl(url);
          onAudioChange(file);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error: any) {
      console.error('无法访问麦克风:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setError('🔒 麦克风权限被拒绝，请在浏览器设置中允许访问麦克风');
        setShowPermissionHelp(true);
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setError('🎤 未检测到麦克风设备，请检查您的麦克风是否连接');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setError('⚠️ 麦克风被其他应用占用，请关闭其他使用麦克风的应用');
      } else if (error.name === 'SecurityError') {
        setError('🔐 安全限制：录音功能需要HTTPS环境才能使用');
        setShowPermissionHelp(true);
      } else {
        setError(`❌ 无法访问麦克风: ${error.message || '未知错误'}`);
        setShowPermissionHelp(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteAudio = () => {
    setAudioUrl(null);
    setIsPlaying(false);
    fileRef.current = null;
    onAudioChange(null);
  };

  return (
    <div className="space-y-3">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
      
      <div className="flex items-center gap-3">
        {!audioUrl ? (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all ${
              isRecording
                ? 'bg-red-500 text-white recording'
                : 'bg-blue-cute text-white hover:bg-blue-dark'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            {isRecording ? '停止录音' : '开始录音'}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-green-cute text-gray-700 font-medium hover:bg-green-500 transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? '暂停' : '播放'}
            </button>
            <button
              type="button"
              onClick={deleteAudio}
              className="p-3 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
        
        {isRecording && (
          <span className="text-red-500 font-medium animate-pulse">
            🔴 录音中...
          </span>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {showPermissionHelp && (
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-2 mb-2">
            <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 font-medium text-sm">解决方案：</p>
          </div>
          <ul className="text-blue-600 text-sm space-y-1 ml-6 list-disc">
            <li><strong>本地开发：</strong>请使用 localhost 访问（http://localhost:5173）</li>
            <li><strong>手机测试：</strong>使用 Cloudflare Tunnel 创建HTTPS隧道</li>
            <li><strong>浏览器设置：</strong>点击地址栏左侧 🔒 图标 → 网站设置 → 麦克风 → 允许</li>
          </ul>
        </div>
      )}
      
      <p className="text-sm text-gray-500">
        💡 点击开始录制语音介绍，让大家听到你的声音哦~
      </p>
    </div>
  );
}
