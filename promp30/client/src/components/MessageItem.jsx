import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store.js';

function MessageItem({ message, isSelf, avatar, onSendMessage }) {
  const [playing, setPlaying] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const audioRef = useRef(null);
  const { updateMessage } = useStore();

  useEffect(() => {
    if (message.metadata?.showTranscription) {
      setShowTranscription(true);
    }
  }, [message.metadata?.showTranscription]);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileExt = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts[parts.length - 1].toUpperCase().slice(0, 4);
  };

  const handleVoicePlay = () => {
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
    } else {
      const transcription = message.metadata?.transcription;
      const duration = (message.metadata?.duration || 3) * 1000;
      
      if ('speechSynthesis' in window && transcription) {
        const utterance = new SpeechSynthesisUtterance(transcription);
        utterance.lang = 'zh-CN';
        utterance.rate = 1;
        utterance.onend = () => setPlaying(false);
        utterance.onerror = () => setPlaying(false);
        window.speechSynthesis.speak(utterance);
        setPlaying(true);
      } else {
        setPlaying(true);
        setTimeout(() => {
          setPlaying(false);
        }, duration);
      }
    }
  };

  const handleTranscribe = () => {
    setShowTranscription(!showTranscription);
    updateMessage(message.id, {
      metadata: { showTranscription: !showTranscription }
    });
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="message-bubble">
            {message.content}
          </div>
        );
      
      case 'emoji':
        return (
          <div className="message-bubble" style={{ background: 'transparent', padding: '4px' }}>
            <span className="emoji-message">{message.content}</span>
          </div>
        );
      
      case 'sticker':
        return (
          <div className="message-bubble" style={{ background: 'transparent', padding: '4px' }}>
            <span className="emoji-message">{message.content}</span>
          </div>
        );
      
      case 'image':
        return (
          <img 
            src={message.content} 
            alt="图片" 
            className="message-image"
            onClick={() => window.open(message.content, '_blank')}
          />
        );
      
      case 'video':
        return (
          <video 
            src={message.content} 
            controls 
            className="message-video"
            onClick={(e) => e.stopPropagation()}
          />
        );
      
      case 'file':
        return (
          <div className="message-file">
            <div className="file-icon">{getFileExt(message.metadata?.filename)}</div>
            <div className="file-info">
              <div className="file-name">{message.metadata?.filename || '文件'}</div>
              <div className="file-size">{formatFileSize(message.metadata?.size)}</div>
            </div>
          </div>
        );
      
      case 'voice':
        return (
          <div>
            <div className="voice-bubble" onClick={handleVoicePlay}>
              <span className="voice-icon">{playing ? '🔊' : '🔈'}</span>
              <div className={`voice-wave ${playing ? 'playing' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="voice-duration">{message.metadata?.duration || 0}"</span>
            </div>
            {message.metadata?.transcription && (
              <>
                <button className="transcription-btn" onClick={handleTranscribe}>
                  {showTranscription ? '收起文案' : '转文案'}
                </button>
                {showTranscription && (
                  <div className="transcription">
                    {message.metadata.transcription}
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      default:
        return (
          <div className="message-bubble">
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className={`message ${isSelf ? 'self' : ''}`}>
      <div className="message-avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <div className="message-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default MessageItem;
