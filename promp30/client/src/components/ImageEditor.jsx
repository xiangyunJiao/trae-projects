import React, { useState, useRef, useEffect, useCallback } from 'react';

function ImageEditor({ imageSrc, onComplete, onCancel }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('crop');
  const [rotation, setRotation] = useState(0);
  const [image, setImage] = useState(null);
  const [mosaicSize, setMosaicSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(24);
  const [scale, setScale] = useState(1);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 200;
      
      let w = img.width;
      let h = img.height;
      
      if (w > maxWidth) {
        h = (maxWidth / w) * h;
        w = maxWidth;
      }
      if (h > maxHeight) {
        w = (maxHeight / h) * w;
        h = maxHeight;
      }
      
      setScale(w / img.width);
      setCanvasSize({ width: w, height: h });
      
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          saveState();
        }
      }, 0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setUndoStack(prev => [...prev, canvas.toDataURL()]);
    }
  }, []);

  const undo = () => {
    if (undoStack.length > 1) {
      const newStack = [...undoStack];
      newStack.pop();
      const prevState = newStack[newStack.length - 1];
      setUndoStack(newStack);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = prevState;
    }
  };

  const rotate = (degrees) => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    const newWidth = degrees % 180 === 0 ? canvas.width : canvas.height;
    const newHeight = degrees % 180 === 0 ? canvas.height : canvas.width;
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    ctx.clearRect(0, 0, newWidth, newHeight);
    ctx.save();
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
    ctx.restore();
    
    setRotation(prev => prev + degrees);
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setLastPos(pos);
    
    if (tool === 'crop') {
      setCropStart(pos);
      setCropEnd(pos);
    }
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasCoords(e);
    
    if (tool === 'mosaic') {
      const size = mosaicSize;
      const x = Math.floor(pos.x / size) * size;
      const y = Math.floor(pos.y / size) * size;
      
      ctx.fillStyle = 'rgba(150, 150, 150, 0.8)';
      ctx.fillRect(x, y, size, size);
      
      for (let i = 0; i < size; i += 4) {
        for (let j = 0; j < size; j += 4) {
          const gray = Math.floor(Math.random() * 100) + 100;
          ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
          ctx.fillRect(x + i, y + j, 4, 4);
        }
      }
    } else if (tool === 'brush') {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      setLastPos(pos);
    } else if (tool === 'crop') {
      setCropEnd(pos);
    }
  };

  const handleEnd = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (tool === 'crop' && cropStart && cropEnd) {
      doCrop();
    } else if (tool !== 'crop') {
      saveState();
    }
    
    setCropStart(null);
    setCropEnd(null);
  };

  const doCrop = () => {
    if (!cropStart || !cropEnd) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const w = Math.abs(cropEnd.x - cropStart.x);
    const h = Math.abs(cropEnd.y - cropStart.y);
    
    if (w < 10 || h < 10) return;
    
    saveState();
    
    const imageData = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(imageData, 0, 0);
    setCanvasSize({ width: w, height: h });
  };

  const addText = () => {
    if (!textInput.trim()) return;
    
    saveState();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.font = `bold ${textSize}px sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(textInput, x, y);
    ctx.shadowBlur = 0;
    
    setTextInput('');
    setShowTextInput(false);
  };

  const addEmoji = (emoji) => {
    saveState();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
  };

  const handleComplete = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onComplete(dataUrl);
  };

  return (
    <div className="image-editor-overlay">
      <div className="image-editor-header">
        <button className="editor-btn" onClick={onCancel}>取消</button>
        <span style={{ fontSize: '16px', fontWeight: '500' }}>编辑图片</span>
        <button className="editor-btn primary" onClick={handleComplete}>完成</button>
      </div>
      
      <div className="image-editor-canvas-container">
        <canvas
          ref={canvasRef}
          className="editor-canvas"
          style={canvasSize}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        
        {tool === 'crop' && cropStart && cropEnd && (
          <div 
            style={{
              position: 'absolute',
              left: Math.min(cropStart.x, cropEnd.x),
              top: Math.min(cropStart.y, cropEnd.y),
              width: Math.abs(cropEnd.x - cropStart.x),
              height: Math.abs(cropEnd.y - cropStart.y),
              border: '2px dashed #07c160',
              pointerEvents: 'none',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
            }}
          />
        )}
      </div>
      
      {tool === 'mosaic' && (
        <div className="mosaic-brush-size">
          <span>马赛克大小:</span>
          <input 
            type="range" 
            min="5" 
            max="30" 
            value={mosaicSize}
            onChange={(e) => setMosaicSize(Number(e.target.value))}
          />
          <span>{mosaicSize}px</span>
        </div>
      )}
      
      <div className="image-editor-tools">
        <button 
          className={`tool-btn ${tool === 'crop' ? 'active' : ''}`}
          onClick={() => setTool('crop')}
        >
          <span className="tool-icon">✂️</span>
          <span>裁剪</span>
        </button>
        
        <button 
          className="tool-btn"
          onClick={() => rotate(90)}
        >
          <span className="tool-icon">↻</span>
          <span>旋转</span>
        </button>
        
        <button 
          className={`tool-btn ${tool === 'mosaic' ? 'active' : ''}`}
          onClick={() => setTool('mosaic')}
        >
          <span className="tool-icon">⬛</span>
          <span>马赛克</span>
        </button>
        
        <button 
          className={`tool-btn ${tool === 'brush' ? 'active' : ''}`}
          onClick={() => setTool('brush')}
        >
          <span className="tool-icon">🖌️</span>
          <span>画笔</span>
        </button>
        
        <button 
          className="tool-btn"
          onClick={() => setShowTextInput(true)}
        >
          <span className="tool-icon">T</span>
          <span>文字</span>
        </button>
        
        <button 
          className="tool-btn"
          onClick={() => addEmoji('😀')}
        >
          <span className="tool-icon">😊</span>
          <span>表情</span>
        </button>
        
        <button 
          className="tool-btn"
          onClick={undo}
          disabled={undoStack.length <= 1}
          style={{ opacity: undoStack.length <= 1 ? 0.4 : 1 }}
        >
          <span className="tool-icon">↩</span>
          <span>撤销</span>
        </button>
      </div>
      
      {showTextInput && (
        <div className="text-input-modal" onClick={(e) => e.stopPropagation()}>
          <div className="text-input-content">
            <h3>添加文字</h3>
            <input
              type="text"
              placeholder="请输入文字"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              autoFocus
            />
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>字体大小: {textSize}px</label>
              <input 
                type="range" 
                min="12" 
                max="72" 
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '14px', color: '#666', marginBottom: '8px', display: 'block' }}>颜色</label>
              <div className="color-picker">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${textColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="text-input-actions">
              <button className="cancel" onClick={() => setShowTextInput(false)}>取消</button>
              <button className="confirm" onClick={addText}>添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageEditor;
