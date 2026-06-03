import React, { useState, useRef, useEffect } from 'react';

function VoiceRecorder({ onSend, onCancel }) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setRecordedChunks([]);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('无法访问麦克风，请检查权限设置');
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleSend = () => {
    if (duration < 1) {
      alert('录音时间太短');
      return;
    }

    const transcriptions = [
      '你好，收到我的语音消息了吗？',
      '今天天气真好，我们出去走走吧！',
      '我现在有点忙，等会儿再跟你聊~',
      '刚才说的那件事你考虑得怎么样了？',
      '收到请回复，谢谢！'
    ];
    
    const voiceData = {
      duration,
      url: `/uploads/voice_${Date.now()}.mp3`,
      transcription: transcriptions[Math.floor(Math.random() * transcriptions.length)],
      showTranscription: false
    };

    onSend(voiceData);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder">
      {!isRecording && duration === 0 && (
        <button 
          className="record-btn"
          onClick={startRecording}
        >
          🎤
        </button>
      )}
      
      {isRecording && (
        <>
          <button 
            className="record-btn recording"
            onClick={handleStop}
          >
            ⏹
          </button>
          <div className="record-time">{formatDuration(duration)}</div>
          <div className="record-actions">
            <button 
              className="record-action-btn cancel"
              onClick={() => {
                stopRecording();
                onCancel();
              }}
            >
              取消
            </button>
          </div>
        </>
      )}
      
      {!isRecording && duration > 0 && (
        <>
          <button 
            className="record-btn"
            onClick={startRecording}
          >
            🔄
          </button>
          <div className="record-time">{formatDuration(duration)}</div>
          <div className="record-actions">
            <button 
              className="record-action-btn cancel"
              onClick={onCancel}
            >
              取消
            </button>
            <button 
              className="record-action-btn send"
              onClick={handleSend}
            >
              发送
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default VoiceRecorder;
