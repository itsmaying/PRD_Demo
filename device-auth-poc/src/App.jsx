import { useEffect, useMemo, useState } from 'react'
import DeviceAuthDemo from './DeviceAuthDemo.jsx'
import AudioDeleteDemo from './audioDelete/AudioDeleteDemo.jsx'
import SalesVoiceprintDemo from './SalesVoiceprintDemo.jsx'
import './App.css'

const demoItems = [
  {
    id: 'audio-delete',
    title: '录音删除管理',
    subtitle: '未关联录音清理 / 批量管理 / 详情删除',
    status: '可体验',
    date: '04/24',
    version: '5.15',
    accent: '#7B3FF2',
    summary: '覆盖录音列表、批量选择、重命名、删除确认与详情页删除。',
    metrics: ['列表', '批量', '详情'],
  },
  {
    id: 'device-auth',
    title: '设备鉴权',
    subtitle: '合法设备校验 / 失败提示 / 缓存命中',
    status: '可体验',
    date: '04/29',
    version: '5.15',
    accent: '#2F6BFF',
    summary: '覆盖首页已连、设备连接、未授权拦截、SN 获取失败与服务端未完成。',
    metrics: ['首页', '连接', '失败'],
  },
  {
    id: 'device-ota',
    title: 'OTA 手动升级',
    subtitle: '新版本发现 / 升级拦截 / 结果承接',
    status: '可体验',
    date: '04/30',
    version: '5.15',
    accent: '#16A085',
    summary: '覆盖升级说明、开始升级前校验、升级中进度与成功失败结果页。',
    metrics: ['说明', '进度', '结果'],
  },
  {
    id: 'sales-voiceprint',
    title: '销售声纹录入',
    subtitle: '我的声音 / 录制引导 / 删除回退',
    status: '可体验',
    date: '07/06',
    version: '7.21',
    accent: '#F56A3A',
    summary: '覆盖未录入、耳机未连接拦截、录制失败、录制成功、已录入态与删除回退。',
    metrics: ['未录入', '录制', '删除'],
  },
]

function UpdateNotice({ updateVersion, onRefresh, onDismiss }) {
  if (!updateVersion) return null

  return (
    <div className="update-notice-shell">
      <div className="update-notice-card">
        <div className="update-notice-copy">
          <div className="update-notice-kicker">发现新版本</div>
          <div className="update-notice-title">当前预览已更新，点击立即刷新</div>
        </div>
        <div className="update-notice-actions">
          <button className="update-notice-btn secondary" onClick={onDismiss}>稍后</button>
          <button className="update-notice-btn primary" onClick={onRefresh}>立即更新</button>
        </div>
      </div>
    </div>
  )
}

function DemoPreviewShell({ title, onBack, children, updateNotice }) {
  return (
    <div className="app-root preview-root">
      <div className="preview-shell unified-preview-shell">
        {updateNotice}
        <div className="preview-topbar">
          <button className="back-button" onClick={onBack}>‹</button>
          <div>
            <div className="preview-kicker">PRD Demo Hub</div>
            <div className="preview-title">{title}</div>
          </div>
        </div>
        <div className="preview-content unified-preview-content">
          {children}
        </div>
      </div>
    </div>
  )
}

function VersionSelector({ activeVersion, options, counts, onSelect, open, onToggle, onClose }) {
  return (
    <>
      <button className={`version-selector-trigger${open ? ' open' : ''}`} onClick={onToggle}>
        <div className="selector-trigger-main">
          <div className="selector-label">当前版本</div>
          <div className="selector-value-row">
            <span className="selector-value">{activeVersion}</span>
            <span className="selector-caret">▾</span>
          </div>
        </div>
        <div className="selector-trigger-side">
          <div className="selector-count-pill">{counts[activeVersion] ?? 0} 个 Demo</div>
          <div className="selector-trigger-hint">点击切换</div>
        </div>
      </button>

      {open ? (
        <div className="selector-sheet-overlay" onClick={onClose}>
          <div className="selector-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="selector-sheet-handle" />
            <div className="selector-sheet-title">切换版本</div>
            <div className="selector-sheet-subtitle">选择后立即切换当前展示的模块范围</div>
            <div className="selector-option-list">
              {options.map((option) => {
                const selected = option === activeVersion
                return (
                  <button
                    key={option}
                    className={`selector-option${selected ? ' active' : ''}`}
                    onClick={() => {
                      onSelect(option)
                      onClose()
                    }}
                  >
                    <div className="selector-option-main">
                      <span className="selector-option-title">{option}</span>
                      <span className="selector-option-desc">
                        {option === '全部' ? '查看所有版本的交互模块' : `查看 ${option} 版本下的交互模块`}
                      </span>
                    </div>
                    <div className="selector-option-side">
                      <span className="selector-option-count">{counts[option] ?? 0}</span>
                      {selected ? <span className="selector-option-check">✓</span> : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function DemoHome({ items, onOpen, updateNotice, buildVersion }) {
  const [activeVersion, setActiveVersion] = useState('全部')
  const [selectorOpen, setSelectorOpen] = useState(false)

  const versionOptions = useMemo(() => ['全部', ...new Set(items.map((item) => item.version))], [items])

  const versionCounts = useMemo(() => {
    const counts = {
      全部: items.length,
    }

    items.forEach((item) => {
      counts[item.version] = (counts[item.version] ?? 0) + 1
    })

    return counts
  }, [items])

  const visibleItems = useMemo(() => (
    activeVersion === '全部'
      ? items
      : items.filter((item) => item.version === activeVersion)
  ), [activeVersion, items])

  const shortBuildVersion = buildVersion ? buildVersion.slice(-6) : '--'

  return (
    <main className="app-root">
      <section className="home-shell fixed-home-shell">
        <div className="home-fixed-header">
          {updateNotice}
          <div className="home-hero simple-hero elevated-hero refined-hero fixed-home-hero">
            <div className="hero-copy centered-hero-copy">
              <div className="hero-caption">PRD DEMO HUB</div>
              <h1>交互设计预览中心</h1>
              <p>按版本筛选查看各模块交互方案</p>
            </div>
            <div className="hero-build-chip">Build {shortBuildVersion}</div>
          </div>

          <section className="filter-panel refined-filter-panel fixed-filter-panel">
            <div className="filter-panel-header refined-filter-header compact-filter-header">
              <div>
                <div className="filter-kicker">版本筛选</div>
                <div className="filter-title">选择要查看的版本</div>
              </div>
            </div>

            <VersionSelector
              activeVersion={activeVersion}
              options={versionOptions}
              counts={versionCounts}
              open={selectorOpen}
              onToggle={() => setSelectorOpen((value) => !value)}
              onClose={() => setSelectorOpen(false)}
              onSelect={setActiveVersion}
            />
          </section>
        </div>

        <div className="home-scroll-content">
          <div className="demo-list compact-demo-list">
            {visibleItems.map((item) => (
              <button className="demo-card" key={item.id} onClick={() => onOpen(item.id)}>
                <div className="demo-card-top">
                  <div className="demo-card-badges">
                    <span className="status-pill">{item.status}</span>
                    <span className="version-pill">{item.version}</span>
                  </div>
                </div>
                <div className="demo-main-row">
                  <div className="demo-icon" style={{ background: `linear-gradient(135deg, ${item.accent}, #1C1D2A)` }}>
                    {item.date}
                  </div>
                  <div className="demo-copy">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <span className="card-arrow">›</span>
                </div>
                <div className="demo-summary">{item.summary}</div>
                <div className="metric-row">
                  {item.metrics.map((metric) => <span key={metric}>{metric}</span>)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [activeDemo, setActiveDemo] = useState(null)
  const [updateVersion, setUpdateVersion] = useState(null)
  const [buildVersion, setBuildVersion] = useState(window.__APP_BUILD_VERSION__ ?? null)

  useEffect(() => {
    const handleUpdate = (event) => {
      const nextVersion = event.detail?.version
      if (nextVersion) {
        setUpdateVersion(nextVersion)
      }
    }

    const handleVersionReady = (event) => {
      const nextVersion = event.detail?.version
      if (nextVersion) {
        setBuildVersion(nextVersion)
      }
    }

    window.addEventListener('app-update-available', handleUpdate)
    window.addEventListener('app-build-version-ready', handleVersionReady)

    return () => {
      window.removeEventListener('app-update-available', handleUpdate)
      window.removeEventListener('app-build-version-ready', handleVersionReady)
    }
  }, [])

  const dismissUpdate = () => {
    window.dispatchEvent(new CustomEvent('app-update-dismissed', {
      detail: { version: updateVersion },
    }))
    setUpdateVersion(null)
  }

  const refreshToLatest = () => {
    window.location.reload()
  }

  const updateNotice = (
    <UpdateNotice
      updateVersion={updateVersion}
      onRefresh={refreshToLatest}
      onDismiss={dismissUpdate}
    />
  )

  if (activeDemo === 'audio-delete') {
    return (
      <DemoPreviewShell title="录音删除管理" onBack={() => setActiveDemo(null)} updateNotice={updateNotice}>
        <AudioDeleteDemo />
      </DemoPreviewShell>
    )
  }

  if (activeDemo === 'device-auth') {
    return (
      <DemoPreviewShell title="设备鉴权" onBack={() => setActiveDemo(null)} updateNotice={updateNotice}>
        <DeviceAuthDemo demoMode="auth" showModeSwitch={false} onDemoModeChange={() => {}} />
      </DemoPreviewShell>
    )
  }

  if (activeDemo === 'device-ota') {
    return (
      <DemoPreviewShell title="OTA 手动升级" onBack={() => setActiveDemo(null)} updateNotice={updateNotice}>
        <DeviceAuthDemo demoMode="ota" showModeSwitch={false} onDemoModeChange={() => {}} />
      </DemoPreviewShell>
    )
  }

  if (activeDemo === 'sales-voiceprint') {
    return (
      <DemoPreviewShell title="销售声纹录入" onBack={() => setActiveDemo(null)} updateNotice={updateNotice}>
        <SalesVoiceprintDemo />
      </DemoPreviewShell>
    )
  }

  return <DemoHome items={demoItems} onOpen={setActiveDemo} updateNotice={updateNotice} buildVersion={buildVersion} />
}

export default App
