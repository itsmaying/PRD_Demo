import React, { useState, useRef } from 'react';

export default function AudioCard({ item, activeTab, isBatchMode, isSelected, onToggleSelect, onSwipeToEdit, onClick }) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const didSwipeRef = useRef(false);

  const canSwipe = !isBatchMode;

  const handleStart = (clientX) => {
    if (!canSwipe) return;
    startXRef.current = clientX;
    didSwipeRef.current = false;
    setIsDragging(true);
  };

  const handleMove = (clientX) => {
    if (!isDragging || !canSwipe) return;
    const diff = clientX - startXRef.current;
    if (diff < -40) {
       didSwipeRef.current = true;
       setIsDragging(false);
       if (navigator.vibrate) navigator.vibrate(50);
       onSwipeToEdit(item.id);
    }
  };

  const handleEnd = () => {
    if (!canSwipe || !isDragging) return;
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleClick = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }
    if (isBatchMode) {
      onToggleSelect(item.id);
      return;
    }
    onClick();
  };

  return (
    <div className="audio-card-container">
      <div className="card-wrapper" style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
        <div 
          className={`audio-card ${isSelected ? 'selected' : ''} ${!isDragging ? 'animate-snap' : ''}`}
          style={{ transform: `translateX(${translateX}px)`, flex: 1, minWidth: 0, position: 'relative' }}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onClick={handleClick}
        >
          <h3 className="card-title">{item.title}</h3>
          <div className="card-status" style={{color: '#8A8CC4'}}>✨ {item.tag}</div>
          <div className="card-meta">
             <span style={{display: 'flex', alignItems: 'center', gap: 4}}>🎤 {item.date}</span>
             <span style={{color: '#e9eaef', margin: '0 8px'}}>|</span>
             <span>{item.duration}</span>
          </div>
          {isBatchMode && (
             <div 
               className={`batch-checkbox overlay-pos ${isSelected ? 'checked' : ''} ${item.status === 'assigned' ? 'disabled' : ''}`}
               onClick={(e) => {
                 e.stopPropagation();
                 onToggleSelect(item.id);
               }}
             >
               {isSelected && <div className="check-mark" />}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
