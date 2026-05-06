import React, { useState } from 'react';
import './AudioDeleteDemo.css';
import { PencilIcon, TrashIcon } from './components/Icons';
import { mockData } from './components/MockData';
import AudioCard from './components/AudioCard';
import DetailPage from './components/DetailPage';
import UnifiedModal from './components/UnifiedModal';

const PAGE_SIZE = 10;

export default function AudioDeleteDemo() {
  const [recordings, setRecordings] = useState(mockData);
  const [activeTab, setActiveTab] = useState('unassigned');
  const [detailItem, setDetailItem] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  // Batch Mode States
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modal States
  const [confirmConfig, setConfirmConfig] = useState({ show: false, type: 'delete', title: '', desc: '', onConfirm: null, initialValue: '' });
  const [renameValue, setRenameValue] = useState('');
  
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const closeConfirm = () => setConfirmConfig({ ...confirmConfig, show: false });

  const filtered = recordings.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });
  const visibleRecordings = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const getSelectableRecordings = () => visibleRecordings.filter(r => r.status === 'unassigned');
  const selectableIds = getSelectableRecordings().map(r => r.id);
  const isAllSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));

  const triggerDelete = (itemIds) => {
    setConfirmConfig({
      show: true,
      type: 'delete',
      title: '确认删除录音？',
      desc: '删除后无法恢复，是否继续？',
      onConfirm: () => {
        setRecordings(prev => prev.filter(r => !itemIds.includes(r.id)));
        closeConfirm();
        if (detailItem && itemIds.includes(detailItem.id)) setDetailItem(null);
        setSelectedIds([]);
        setIsBatchMode(false);
        showToast('删除成功');
      }
    });
  };

  const triggerRename = (id, currentTitle) => {
    setRenameValue(currentTitle);
    setConfirmConfig({
      show: true,
      type: 'rename',
      title: '命名当前文件',
      desc: '请输入新名称',
      onConfirm: () => {
        setRecordings(prev => prev.map(r => r.id === id ? { ...r, title: renameValue } : r));
        closeConfirm();
        setSelectedIds([]);
        setIsBatchMode(false);
        showToast('重命名成功');
      }
    });
  };

  const triggerBatchDelete = () => {
    if (selectedIds.length === 0) return;
    triggerDelete(selectedIds);
  };

  const triggerBatchRename = () => {
    if (selectedIds.length !== 1) return;
    const item = recordings.find(r => r.id === selectedIds[0]);
    triggerRename(item.id, item.title);
  };

  return (
    <div className="audio-demo-wrapper">
      {/* ------------ LIST PAGE ------------ */}
      <div className="list-page">
        {isBatchMode ? (
          <header className="edit-header">
            <button className="icon-btn edit-header-btn" onClick={() => {
              setIsBatchMode(false);
              setSelectedIds([]);
            }}>✕</button>
            <div className="edit-title">已选中 {selectedIds.length} 个</div>
            <button className={`edit-header-btn main-color ${selectableIds.length === 0 ? 'disabled-text' : ''}`} onClick={() => {
              if (selectableIds.length === 0) return;
              if (isAllSelected) {
                setSelectedIds([]);
              } else {
                setSelectedIds(selectableIds);
              }
            }}>{isAllSelected ? '取消全选' : '全选'}</button>
          </header>
        ) : (
          <header className="top-header">
            <div className="search-bar">
              <span>&#128269;</span><input type="text" placeholder="输入标题/客户名" />
            </div>
            <div className="header-icons">
              <button className="icon-btn" style={{background:'#ffeeee', color:'#ff4d4f'}}>☊</button>
              <button className="icon-btn">💬</button>
              <button className="icon-btn">📄</button>
            </div>
          </header>
        )}

        {!isBatchMode && (
          <div className="tabs-view">
            <div className="tabs-group">
              {['all', 'assigned', 'unassigned'].map(t => {
                const label = t === 'all' ? '全部' : (t === 'assigned' ? '已关联' : '未关联');
                return (
                  <div 
                    key={t}
                    className={`tab ${activeTab === t ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(t);
                      setIsBatchMode(false);
                      setSelectedIds([]);
                      setVisibleCount(PAGE_SIZE);
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
            <button className="filter-icon">▼</button>
          </div>
        )}

        <div
          className="list-content"
          style={{ paddingBottom: isBatchMode ? 80 : 20, paddingTop: isBatchMode ? 16 : 0 }}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (hasMore && scrollHeight - scrollTop - clientHeight < 80) {
              setVisibleCount(count => Math.min(count + PAGE_SIZE, filtered.length));
            }
          }}
        >
          {!isBatchMode && <div className="date-header">04-08 星期一</div>}
          {filtered.length === 0 && <div className="empty-state">暂无相关录音</div>}
          
          {visibleRecordings.map(item => (
            <AudioCard 
              key={item.id} 
              item={item} 
              activeTab={activeTab}
              isBatchMode={isBatchMode}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={(id) => {
                if (item.status === 'assigned') {
                  showToast('录音已关联客户，不可操作');
                  return;
                }
                setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
              }}
              onSwipeToEdit={(id) => {
                if (activeTab === 'assigned') {
                  showToast('录音已关联客户，不可操作');
                  return;
                }
                setIsBatchMode(true);
                const item = recordings.find(r => r.id === id);
                setSelectedIds(item?.status === 'unassigned' ? [id] : []);
                if (item?.status === 'assigned') showToast('录音已关联客户，不可操作');
              }}
              onClick={() => {
                  if (isBatchMode) return;
                  setDetailItem(item);
              }}
            />
          ))}

          {hasMore && (
            <div className="load-more-tip">继续下滑加载更多 · 已显示 {visibleRecordings.length}/{filtered.length}</div>
          )}
        </div>

        <div className={`batch-bar ${isBatchMode ? 'show' : ''}`}>
          <div className="batch-actions">
            <button
              className={`action-btn ${selectedIds.length === 1 ? '' : 'disabled'}`}
              onClick={triggerBatchRename}
            >
              <span className="action-icon"><PencilIcon /></span>
              <span className="action-text">重命名</span>
            </button>
            <button
              className={`action-btn ${selectedIds.length > 0 ? 'danger' : 'disabled'}`}
              onClick={triggerBatchDelete}
            >
              <span className="action-icon"><TrashIcon /></span>
              <span className="action-text">删除</span>
            </button>
          </div>
        </div>
      </div>

      <DetailPage 
        item={detailItem} 
        onClose={() => setDetailItem(null)}
        onDelete={() => triggerDelete([detailItem.id])}
        onRename={() => triggerRename(detailItem.id, detailItem.title)}
        onBindCustomer={() => alert('点击名字：进入更换/绑定客户交互流程')}
      />

      <UnifiedModal 
        config={confirmConfig} 
        renameValue={renameValue} 
        setRenameValue={setRenameValue} 
        onClose={closeConfirm} 
      />

      {/* Global Toast */}
      {toast && <div className="demo-toast">{toast}</div>}
    </div>
  );
}
