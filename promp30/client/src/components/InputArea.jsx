import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { uploadFile } from '../api.js';
import VoiceRecorder from './VoiceRecorder.jsx';

const STICKERS = ['😀', '😂', '🥰', '😎', '🤔', '😴', '🙄', '😭', '😡', '👍', '👎', '👏', '🙏', '💪', '❤️', '💔', '🔥', '⭐', '🎉', '🎂'];

function InputArea({ onSendMessage, onTyping, onImageSelect }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileDocInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage({
      type: 'text',
      content: text.trim()
    });
    setText('');
    setShowEmoji(false);
    setShowStickers(false);
    setShowExtra(false);
    onTyping(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    onTyping(!!e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    onTyping(true);
  };

  const handleStickerClick = (sticker) => {
    onSendMessage({
      type: 'sticker',
      content: sticker
    });
    setShowStickers(false);
  };

  const handleFileSelect = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const data = await uploadFile(file);
      if (data.success) {
        onSendMessage({
          type,
          content: data.url,
          metadata: {
            filename: data.filename,
            size: data.size,
            fileType: data.type
          }
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('上传失败');
    }
    
    e.target.value = '';
  };

  const handleVoiceSend = (voiceData) => {
    onSendMessage({
      type: 'voice',
      content: '',
      metadata: voiceData
    });
    setShowVoice(false);
  };

  const togglePanel = (panel) => {
    setShowEmoji(panel === 'showEmoji' ? !showEmoji : false);
    setShowStickers(panel === 'showStickers' ? !showStickers : false);
    setShowExtra(panel === 'showExtra' ? !showExtra : false);
    setShowVoice(panel === 'showVoice' ? !showVoice : false);
  };

  return (
    <>
      {showVoice && (
        <VoiceRecorder 
          onSend={handleVoiceSend} 
          onCancel={() => setShowVoice(false)} 
        />
      )}
      
      {showEmoji && (
        <div className="emoji-picker-container">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={240}
            previewConfig={{ showPreview: false }}
            searchDisabled
            skinTonesDisabled
          />
        </div>
      )}
      
      {showStickers && (
        <div className="sticker-picker">
          {STICKERS.map((sticker, index) => (
            <div
              key={index}
              className="sticker-item"
              onClick={() => handleStickerClick(sticker)}
            >
              {sticker}
            </div>
          ))}
        </div>
      )}
      
      {showExtra && (
        <div className="extra-menu">
          <div className="extra-menu-item" onClick={() => {
            setShowExtra(false);
            fileInputRef.current?.click();
          }}>
            <div className="extra-menu-icon">🖼️</div>
            <div className="extra-menu-label">图片</div>
          </div>
          <div className="extra-menu-item" onClick={() => {
            setShowExtra(false);
            videoInputRef.current?.click();
          }}>
            <div className="extra-menu-icon">🎬</div>
            <div className="extra-menu-label">视频</div>
          </div>
          <div className="extra-menu-item" onClick={() => {
            setShowExtra(false);
            fileDocInputRef.current?.click();
          }}>
            <div className="extra-menu-icon">📄</div>
            <div className="extra-menu-label">文件</div>
          </div>
          <div className="extra-menu-item" onClick={() => {
            setShowExtra(false);
            setShowStickers(true);
          }}>
            <div className="extra-menu-icon">😆</div>
            <div className="extra-menu-label">表情包</div>
          </div>
        </div>
      )}
      
      <div className="input-area">
        <button 
          className="input-btn" 
          onClick={() => {
            setShowEmoji(false);
            setShowStickers(false);
            setShowExtra(false);
            setShowVoice(!showVoice);
          }}
        >
          🎤
        </button>
        
        <button 
          className="input-btn" 
          onClick={() => {
            setShowVoice(false);
            setShowStickers(false);
            setShowExtra(false);
            setShowEmoji(!showEmoji);
          }}
        >
          😊
        </button>
        
        <textarea
          ref={textareaRef}
          className="input-textarea"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          rows={1}
        />
        
        <button 
          className="input-btn"
          onClick={() => {
            setShowVoice(false);
            setShowEmoji(false);
            setShowStickers(false);
            setShowExtra(!showExtra);
          }}
        >
          +
        </button>
        
        {text.trim() && (
          <button className="send-btn" onClick={handleSend}>
            发送
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImageSelect(file);
          }
          e.target.value = '';
        }}
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'video')}
      />
      
      <input
        ref={fileDocInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'file')}
      />
    </>
  );
}

export default InputArea;
