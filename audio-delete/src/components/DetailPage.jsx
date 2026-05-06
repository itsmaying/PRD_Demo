import React, { useState } from 'react';
import { TrashIcon } from './Icons';

export default function DetailPage({ item, onClose, onDelete, onRename, onBindCustomer }) {
  const [showMenu, setShowMenu] = useState(false);
  const isAssigned = item?.status === 'assigned';

  return (
    <div className={`detail-page ${item ? 'show' : ''}`}>
      <div className="detail-header">
        <button className="back-btn" onClick={onClose} style={{marginRight: 16}}>‹</button>
        
        <div 
           className={`header-pill ${isAssigned ? 'assigned' : 'unassigned'}`} 
           onClick={onBindCustomer}
        >
           <span className="pill-icon">{isAssigned ? '👤' : '➕'}</span>
           <span className="pill-text">{isAssigned ? item.assigneeName : '未关联客户'}</span>
           <span className="pill-arrow">▾</span>
        </div>

        {!isAssigned && <button className="more-btn" onClick={() => setShowMenu(true)}>···</button>}
      </div>

      {item && (
        <div style={{flex: 1, overflowY: 'auto'}}>
          <div className="player-area">
            ▶ <div className="progress-bar"><div className="progress-fill" /></div> 00:00:00 / {item.duration} <span style={{marginLeft: 12}}>1.0x</span>
          </div>
          <div className="detail-title-area">
            <h2>{item.title}</h2>
            <div className="detail-info">
               <span>📅 {item.date}</span>
               <span style={{marginLeft: 12}}>⏱ {item.duration}</span>
               <span style={{marginLeft: 12}}>🎤 现场录音</span>
            </div>
            <div className="detail-tabs">
               <div className="d-tab">智能总结</div>
               <div className="d-tab active">对话记录</div>
               <div className="d-tab">音频片段</div>
            </div>
            <div className="transcript-area">
               <p className="speaker" style={{color: '#5c62ee', marginBottom: 6}}>销售小王 <span style={{color: '#ccc', fontSize: 12}}>00:00:08</span></p>
               <p className="text">我们开始。要不直接拉上你吧，你哥你有空吗？</p>
               
               <p className="speaker" style={{color: '#5c62ee', marginBottom: 6, marginTop: 24}}>李总 <span style={{color: '#ccc', fontSize: 12}}>00:00:15</span></p>
               <p className="text">对呀，嗯。</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Menu Bottom Sheet */}
      <div className={`overlay ${showMenu ? 'show' : ''}`} onClick={() => setShowMenu(false)}>
        <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
           {!isAssigned && (
             <button className="sheet-action danger" onClick={() => { setShowMenu(false); onDelete(); }}>
               <span className="sheet-action-icon"><TrashIcon /></span>
               <span>删除录音</span>
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
