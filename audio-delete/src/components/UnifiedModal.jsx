import React from 'react';

export default function UnifiedModal({ config, renameValue, setRenameValue, onClose }) {
  if (!config.show) return null;

  return (
    <div className={`overlay center show`} onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
         {config.type === 'delete' && (
           <>
             <h3 className="modal-title">{config.title}</h3>
             <p className="modal-desc">{config.desc}</p>
           </>
         )}
         {config.type === 'rename' && (
           <>
             <h3 className="modal-title">{config.title}</h3>
             <div className="rename-input-container">
               <div className="rename-label">请输入新名称</div>
               <input 
                 type="text" 
                 className="rename-input" 
                 value={renameValue} 
                 onChange={(e) => setRenameValue(e.target.value)} 
                 autoFocus
               />
             </div>
           </>
         )}
         <div className="modal-actions">
           <button className="btn-cancel" onClick={onClose}>取消</button>
           <button className="btn-confirm" onClick={config.onConfirm}>确定</button>
         </div>
      </div>
    </div>
  );
}
