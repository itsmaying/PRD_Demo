import React, { useState, useRef } from 'react'

const PAGE_SIZE = 10

const mockData = Array.from({ length: 50 }, (_, index) => {
  const itemNumber = index + 1
  const assigned = itemNumber % 4 === 0 || itemNumber % 7 === 0
  const month = itemNumber % 2 === 0 ? '04' : '03'
  const day = String((itemNumber % 24) + 1).padStart(2, '0')
  const minute = String((itemNumber * 7) % 60).padStart(2, '0')

  return {
    id: String(itemNumber),
    title: itemNumber === 1 ? '新录音' : `客户沟通录音 ${itemNumber}`,
    date: `${month}-${day} 10:${minute}:33`,
    duration: itemNumber % 5 === 0 ? `${itemNumber}m12s` : `${(itemNumber * 3) % 58 + 1}s`,
    status: assigned ? 'assigned' : 'unassigned',
    assigneeName: assigned ? ['小猴子', '李总', '王经理', '陈总'][itemNumber % 4] : undefined,
    tag: itemNumber % 6 === 0 ? 'ASR 转写中' : '处理完成',
  }
})

const styles = {
  wrapper: {
    width: '100%',
    maxWidth: '480px',
    height: '800px',
    maxHeight: '100vh',
    margin: '0 auto',
    background: '#F7F8FA',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1C1D2A',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    borderRadius: '12px',
  },
  listPage: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' },
  topHeader: {
    flexShrink: 0,
    padding: '12px 16px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  editHeader: {
    flexShrink: 0,
    padding: '12px 16px',
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
    borderBottom: '1px solid #f2f3f7',
  },
  searchBar: {
    flex: 1,
    border: '1px solid #EDEDF3',
    borderRadius: '20px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '12px',
    background: '#fff',
  },
  searchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
    marginLeft: '8px',
  },
  headerIcons: { display: 'flex', gap: '8px' },
  iconButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    fontSize: '18px',
    background: '#F7F8FA',
    border: 'none',
    cursor: 'pointer',
  },
  tabsView: {
    flexShrink: 0,
    display: 'flex',
    padding: '12px 16px',
    background: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f2f3f7',
  },
  tabsGroup: { display: 'flex', gap: '8px' },
  tab: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    background: '#fff',
    color: '#5B5D76',
    border: '1px solid #EDEDF3',
    cursor: 'pointer',
  },
  activeTab: {
    background: '#1C1D2A',
    color: '#fff',
    borderColor: '#1C1D2A',
  },
  filterIcon: { color: '#8A8CC4', fontSize: '12px', border: 'none', background: 'none' },
  listContent: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '16px',
  },
  dateHeader: { fontSize: '14px', color: '#8A8CC4', marginBottom: '12px', fontWeight: 500 },
  emptyState: { color: '#8A8CC4', fontSize: '14px', textAlign: 'center', padding: '48px 0' },
  cardContainer: {
    position: 'relative',
    marginBottom: '16px',
    borderRadius: '12px',
    background: '#F7F8FA',
    overflow: 'hidden',
  },
  cardWrapper: { display: 'flex', alignItems: 'center', position: 'relative' },
  audioCard: {
    position: 'relative',
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    zIndex: 2,
    border: '1px solid #f2f3f7',
    flex: 1,
    minWidth: 0,
  },
  selectedCard: { backgroundColor: '#F8F6FF', borderColor: '#E3D9FA' },
  cardTitle: { fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0', color: '#1C1D2A' },
  cardStatus: { fontSize: '13px', marginBottom: '8px', color: '#8A8CC4' },
  cardMeta: { fontSize: '12px', color: '#8A8CC4' },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '1.5px solid #dcdcdc',
    background: '#fff',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: '16px',
    top: '50%',
    marginTop: '-11px',
    zIndex: 5,
  },
  checkboxChecked: { background: '#1C1D2A', borderColor: '#1C1D2A' },
  checkboxDisabled: { background: '#eee', borderColor: '#eee', opacity: 0.5 },
  checkMark: {
    width: '6px',
    height: '10px',
    border: 'solid white',
    borderWidth: '0 2px 2px 0',
    transform: 'rotate(45deg)',
    marginBottom: '2px',
  },
  loadMoreTip: { textAlign: 'center', padding: '12px 0 18px', color: '#8A8CC4', fontSize: '12px' },
  batchBar: {
    position: 'absolute',
    bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
    left: '50%',
    width: 'calc(100% - 32px)',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    padding: '12px 0',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translateX(-50%)',
    border: '1px solid #e9eaef',
    boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
    zIndex: 180,
  },
  batchActions: { display: 'flex', justifyContent: 'space-around', width: '100%' },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    color: '#5B5D76',
    border: 'none',
    background: 'none',
  },
  actionDisabled: { opacity: 0.3, pointerEvents: 'none' },
  actionDanger: { color: '#F53F3F' },
  actionText: { fontSize: '12px' },
  detailPage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#fff',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
  },
  detailHeader: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e9eaef',
    alignItems: 'center',
  },
  backButton: { fontSize: '28px', padding: '0 12px 0 0', color: '#1C1D2A', border: 'none', background: 'none' },
  headerPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginRight: 'auto',
  },
  assignedPill: { background: '#eef2ff', color: '#5c62ee' },
  unassignedPill: { background: '#f2f3f7', color: '#1d1e2c' },
  moreButton: { fontSize: '20px', fontWeight: 'bold', color: '#1C1D2A', padding: '0 8px', border: 'none', background: 'none' },
  detailScroll: { flex: 1, overflowY: 'auto' },
  playerArea: { background: '#000', color: '#fff', padding: '24px 20px', display: 'flex', alignItems: 'center', fontSize: '13px' },
  progressBar: { flex: 1, height: '2px', background: 'rgba(255,255,255,0.2)', margin: '0 16px', position: 'relative' },
  progressFill: { position: 'absolute', left: 0, top: 0, height: '100%', width: '30%', background: '#fff' },
  detailTitleArea: { padding: '20px' },
  detailTitle: { margin: '0 0 12px 0', fontSize: '20px' },
  detailInfo: { display: 'flex', gap: '16px', fontSize: '12px', color: '#8A8CC4', marginBottom: '24px' },
  detailTabs: { display: 'flex', borderBottom: '1px solid #e9eaef', marginBottom: '20px' },
  detailTab: { flex: 1, textAlign: 'center', padding: '12px 0', fontSize: '15px', color: '#1d1e2c', position: 'relative' },
  detailTabActive: { color: '#7B3FF2', fontWeight: 600 },
  activeTabUnderline: { position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40px', height: '3px', background: '#7B3FF2', borderRadius: '3px 3px 0 0' },
  speaker: { fontSize: '13px', fontWeight: 500 },
  transcriptText: { fontSize: '15px', margin: 0, lineHeight: 1.5, color: '#1d1e2c' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    display: 'flex',
  },
  centerOverlay: { alignItems: 'center', justifyContent: 'center' },
  bottomOverlay: { alignItems: 'flex-end' },
  bottomSheet: {
    background: '#fff',
    width: 'calc(100% - 32px)',
    margin: '0 16px 18px',
    padding: '8px',
    borderRadius: '20px',
    boxShadow: '0 18px 48px rgba(0,0,0,0.18)',
  },
  sheetAction: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 600,
    background: '#fff',
    color: '#F53F3F',
    textAlign: 'center',
    border: 'none',
  },
  modalBox: { background: '#fff', width: '80%', padding: '24px', borderRadius: '16px' },
  modalTitle: { margin: '0 0 12px 0', fontSize: '18px', color: '#1C1D2A', fontWeight: 'bold', textAlign: 'left' },
  modalDesc: { fontSize: '14px', color: '#8A8CC4', margin: '0 0 24px 0', lineHeight: 1.4, textAlign: 'left' },
  renameInputContainer: { marginBottom: '24px', border: '1px solid #EDEDF3', borderRadius: '12px', padding: '8px 12px' },
  renameLabel: { fontSize: '12px', color: '#8A8CC4', marginBottom: '4px', textAlign: 'left' },
  renameInput: { width: '100%', border: 'none', outline: 'none', fontSize: '15px', color: '#1C1D2A' },
  modalActions: { display: 'flex', gap: '16px', justifyContent: 'space-between' },
  cancelButton: { flex: 1, padding: '12px', borderRadius: '24px', fontWeight: 500, fontSize: '15px', background: '#F7F8FA', color: '#8A8CC4', border: 'none' },
  confirmButton: { flex: 1, padding: '12px', borderRadius: '24px', fontWeight: 500, fontSize: '15px', background: '#7B3FF2', color: '#fff', border: 'none' },
  toast: {
    position: 'absolute',
    top: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '20px',
    fontSize: '14px',
    zIndex: 300,
  },
}

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  )
}

function AudioCard({ item, isBatchMode, isSelected, onToggleSelect, onSwipeToEdit, onClick }) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const didSwipeRef = useRef(false)

  const canSwipe = !isBatchMode

  const handleStart = (clientX) => {
    if (!canSwipe) return
    startXRef.current = clientX
    didSwipeRef.current = false
    setIsDragging(true)
  }

  const handleMove = (clientX) => {
    if (!isDragging || !canSwipe) return
    const diff = clientX - startXRef.current
    if (diff < -40) {
      didSwipeRef.current = true
      setIsDragging(false)
      if (navigator.vibrate) navigator.vibrate(50)
      onSwipeToEdit(item.id)
    }
  }

  const handleEnd = () => {
    if (!canSwipe || !isDragging) return
    setIsDragging(false)
    setTranslateX(0)
  }

  const handleClick = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false
      return
    }
    if (isBatchMode) {
      onToggleSelect(item.id)
      return
    }
    onClick()
  }

  return (
    <div style={styles.cardContainer}>
      <div style={styles.cardWrapper}>
        <div
          style={{
            ...styles.audioCard,
            ...(isSelected ? styles.selectedCard : null),
            transform: `translateX(${translateX}px)`,
          }}
          onTouchStart={(event) => handleStart(event.touches[0].clientX)}
          onTouchMove={(event) => handleMove(event.touches[0].clientX)}
          onTouchEnd={handleEnd}
          onMouseDown={(event) => handleStart(event.clientX)}
          onMouseMove={(event) => handleMove(event.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onClick={handleClick}
        >
          <h3 style={styles.cardTitle}>{item.title}</h3>
          <div style={styles.cardStatus}>✨ {item.tag}</div>
          <div style={styles.cardMeta}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>🎤 {item.date}</span>
            <span style={{ color: '#e9eaef', margin: '0 8px' }}>|</span>
            <span>{item.duration}</span>
          </div>
          {isBatchMode ? (
            <div
              style={{
                ...styles.checkbox,
                ...(isSelected ? styles.checkboxChecked : null),
                ...(item.status === 'assigned' ? styles.checkboxDisabled : null),
              }}
              onClick={(event) => {
                event.stopPropagation()
                onToggleSelect(item.id)
              }}
            >
              {isSelected ? <div style={styles.checkMark} /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function DetailPage({ item, onClose, onDelete, onBindCustomer }) {
  const [showMenu, setShowMenu] = useState(false)
  const isAssigned = item?.status === 'assigned'

  return (
    <div style={styles.detailPage}>
      <div style={styles.detailHeader}>
        <button style={{ ...styles.backButton, marginRight: 16 }} onClick={onClose}>‹</button>

        <div
          style={{
            ...styles.headerPill,
            ...(isAssigned ? styles.assignedPill : styles.unassignedPill),
          }}
          onClick={onBindCustomer}
        >
          <span>{isAssigned ? '👤' : '➕'}</span>
          <span style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isAssigned ? item.assigneeName : '未关联客户'}
          </span>
          <span style={{ fontSize: '12px', opacity: 0.6 }}>▾</span>
        </div>

        {!isAssigned ? <button style={styles.moreButton} onClick={() => setShowMenu(true)}>···</button> : null}
      </div>

      {item ? (
        <div style={styles.detailScroll}>
          <div style={styles.playerArea}>
            ▶ <div style={styles.progressBar}><div style={styles.progressFill} /></div> 00:00:00 / {item.duration} <span style={{ marginLeft: 12 }}>1.0x</span>
          </div>
          <div style={styles.detailTitleArea}>
            <h2 style={styles.detailTitle}>{item.title}</h2>
            <div style={styles.detailInfo}>
              <span>📅 {item.date}</span>
              <span style={{ marginLeft: 12 }}>⏱ {item.duration}</span>
              <span style={{ marginLeft: 12 }}>🎤 现场录音</span>
            </div>
            <div style={styles.detailTabs}>
              <div style={styles.detailTab}>智能总结</div>
              <div style={{ ...styles.detailTab, ...styles.detailTabActive }}>
                对话记录
                <div style={styles.activeTabUnderline} />
              </div>
              <div style={styles.detailTab}>音频片段</div>
            </div>
            <div>
              <p style={{ ...styles.speaker, color: '#5c62ee', marginBottom: 6 }}>销售小王 <span style={{ color: '#ccc', fontSize: 12 }}>00:00:08</span></p>
              <p style={styles.transcriptText}>我们开始。要不直接拉上你吧，你哥你有空吗？</p>

              <p style={{ ...styles.speaker, color: '#5c62ee', marginBottom: 6, marginTop: 24 }}>李总 <span style={{ color: '#ccc', fontSize: 12 }}>00:00:15</span></p>
              <p style={styles.transcriptText}>对呀，嗯。</p>
            </div>
          </div>
        </div>
      ) : null}

      {showMenu ? (
        <div style={{ ...styles.overlay, ...styles.bottomOverlay }} onClick={() => setShowMenu(false)}>
          <div style={styles.bottomSheet} onClick={(event) => event.stopPropagation()}>
            {!isAssigned ? (
              <button style={styles.sheetAction} onClick={() => { setShowMenu(false); onDelete() }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F53F3F' }}><TrashIcon /></span>
                <span>删除录音</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function UnifiedModal({ config, renameValue, setRenameValue, onClose }) {
  if (!config.show) return null

  return (
    <div style={{ ...styles.overlay, ...styles.centerOverlay }} onClick={onClose}>
      <div style={styles.modalBox} onClick={(event) => event.stopPropagation()}>
        {config.type === 'delete' ? (
          <>
            <h3 style={styles.modalTitle}>{config.title}</h3>
            <p style={styles.modalDesc}>{config.desc}</p>
          </>
        ) : null}
        {config.type === 'rename' ? (
          <>
            <h3 style={styles.modalTitle}>{config.title}</h3>
            <div style={styles.renameInputContainer}>
              <div style={styles.renameLabel}>请输入新名称</div>
              <input
                type="text"
                style={styles.renameInput}
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                autoFocus
              />
            </div>
          </>
        ) : null}
        <div style={styles.modalActions}>
          <button style={styles.cancelButton} onClick={onClose}>取消</button>
          <button style={styles.confirmButton} onClick={config.onConfirm}>确定</button>
        </div>
      </div>
    </div>
  )
}

export default function AudioDeleteHandoff() {
  const [recordings, setRecordings] = useState(mockData)
  const [activeTab, setActiveTab] = useState('unassigned')
  const [detailItem, setDetailItem] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isBatchMode, setIsBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [confirmConfig, setConfirmConfig] = useState({ show: false, type: 'delete', title: '', desc: '', onConfirm: null, initialValue: '' })
  const [renameValue, setRenameValue] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const closeConfirm = () => setConfirmConfig({ ...confirmConfig, show: false })

  const filtered = recordings.filter((recording) => {
    if (activeTab === 'all') return true
    return recording.status === activeTab
  })
  const visibleRecordings = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const selectableIds = visibleRecordings.filter((recording) => recording.status === 'unassigned').map((recording) => recording.id)
  const isAllSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id))

  const triggerDelete = (itemIds) => {
    setConfirmConfig({
      show: true,
      type: 'delete',
      title: '确认删除录音？',
      desc: '删除后无法恢复，是否继续？',
      onConfirm: () => {
        setRecordings((prev) => prev.filter((recording) => !itemIds.includes(recording.id)))
        closeConfirm()
        if (detailItem && itemIds.includes(detailItem.id)) setDetailItem(null)
        setSelectedIds([])
        setIsBatchMode(false)
        showToast('删除成功')
      },
    })
  }

  const triggerRename = (id, currentTitle) => {
    setRenameValue(currentTitle)
    setConfirmConfig({
      show: true,
      type: 'rename',
      title: '命名当前文件',
      desc: '请输入新名称',
      onConfirm: () => {
        setRecordings((prev) => prev.map((recording) => (recording.id === id ? { ...recording, title: renameValue } : recording)))
        closeConfirm()
        setSelectedIds([])
        setIsBatchMode(false)
        showToast('重命名成功')
      },
    })
  }

  const triggerBatchDelete = () => {
    if (selectedIds.length === 0) return
    triggerDelete(selectedIds)
  }

  const triggerBatchRename = () => {
    if (selectedIds.length !== 1) return
    const item = recordings.find((recording) => recording.id === selectedIds[0])
    triggerRename(item.id, item.title)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.listPage}>
        {isBatchMode ? (
          <header style={styles.editHeader}>
            <button style={{ ...styles.iconButton, fontSize: 16, fontWeight: 500, color: '#1C1D2A' }} onClick={() => { setIsBatchMode(false); setSelectedIds([]) }}>✕</button>
            <div style={{ fontSize: 16, fontWeight: 600 }}>已选中 {selectedIds.length} 个</div>
            <button
              style={{
                border: 'none',
                background: 'none',
                fontSize: 16,
                fontWeight: 500,
                color: selectableIds.length === 0 ? '#C8CAD8' : '#7B3FF2',
              }}
              onClick={() => {
                if (selectableIds.length === 0) return
                if (isAllSelected) {
                  setSelectedIds([])
                } else {
                  setSelectedIds(selectableIds)
                }
              }}
            >
              {isAllSelected ? '取消全选' : '全选'}
            </button>
          </header>
        ) : (
          <header style={styles.topHeader}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input style={styles.searchInput} type="text" placeholder="输入标题/客户名" />
            </div>
            <div style={styles.headerIcons}>
              <button style={{ ...styles.iconButton, background: '#ffeeee', color: '#ff4d4f' }}>☊</button>
              <button style={styles.iconButton}>💬</button>
              <button style={styles.iconButton}>📄</button>
            </div>
          </header>
        )}

        {!isBatchMode ? (
          <div style={styles.tabsView}>
            <div style={styles.tabsGroup}>
              {['all', 'assigned', 'unassigned'].map((tab) => {
                const label = tab === 'all' ? '全部' : tab === 'assigned' ? '已关联' : '未关联'
                return (
                  <div
                    key={tab}
                    style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : null) }}
                    onClick={() => {
                      setActiveTab(tab)
                      setIsBatchMode(false)
                      setSelectedIds([])
                      setVisibleCount(PAGE_SIZE)
                    }}
                  >
                    {label}
                  </div>
                )
              })}
            </div>
            <button style={styles.filterIcon}>▼</button>
          </div>
        ) : null}

        <div
          style={{
            ...styles.listContent,
            paddingBottom: isBatchMode ? 80 : 20,
            paddingTop: isBatchMode ? 16 : 16,
          }}
          onScroll={(event) => {
            const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
            if (hasMore && scrollHeight - scrollTop - clientHeight < 80) {
              setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))
            }
          }}
        >
          {!isBatchMode ? <div style={styles.dateHeader}>04-08 星期一</div> : null}
          {filtered.length === 0 ? <div style={styles.emptyState}>暂无相关录音</div> : null}

          {visibleRecordings.map((item) => (
            <AudioCard
              key={item.id}
              item={item}
              isBatchMode={isBatchMode}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={(id) => {
                if (item.status === 'assigned') {
                  showToast('录音已关联客户，不可操作')
                  return
                }
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
              }}
              onSwipeToEdit={(id) => {
                if (activeTab === 'assigned') {
                  showToast('录音已关联客户，不可操作')
                  return
                }
                setIsBatchMode(true)
                const current = recordings.find((recording) => recording.id === id)
                setSelectedIds(current?.status === 'unassigned' ? [id] : [])
                if (current?.status === 'assigned') showToast('录音已关联客户，不可操作')
              }}
              onClick={() => {
                if (isBatchMode) return
                setDetailItem(item)
              }}
            />
          ))}

          {hasMore ? <div style={styles.loadMoreTip}>继续下滑加载更多 · 已显示 {visibleRecordings.length}/{filtered.length}</div> : null}
        </div>

        {isBatchMode ? (
          <div style={styles.batchBar}>
            <div style={styles.batchActions}>
              <button
                style={{ ...styles.actionButton, ...(selectedIds.length === 1 ? null : styles.actionDisabled) }}
                onClick={triggerBatchRename}
              >
                <span style={{ display: 'flex', fontSize: 20 }}><PencilIcon /></span>
                <span style={styles.actionText}>重命名</span>
              </button>
              <button
                style={{ ...styles.actionButton, ...(selectedIds.length > 0 ? styles.actionDanger : styles.actionDisabled) }}
                onClick={triggerBatchDelete}
              >
                <span style={{ display: 'flex', fontSize: 20 }}><TrashIcon /></span>
                <span style={styles.actionText}>删除</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {detailItem ? (
        <DetailPage
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onDelete={() => triggerDelete([detailItem.id])}
          onBindCustomer={() => alert('点击名字：进入更换/绑定客户交互流程')}
        />
      ) : null}

      <UnifiedModal config={confirmConfig} renameValue={renameValue} setRenameValue={setRenameValue} onClose={closeConfirm} />

      {toast ? <div style={styles.toast}>{toast}</div> : null}
    </div>
  )
}
