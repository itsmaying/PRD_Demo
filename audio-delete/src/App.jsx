import React, { useState } from 'react'
import AudioDeleteDemo from './AudioDeleteDemo.jsx'
import './App.css'

const demoItems = [
  {
    id: 'audio-delete',
    title: '录音删除管理',
    subtitle: '未关联录音清理 / 批量管理 / 详情删除',
    module: 'CRM 录音',
    status: '可体验',
    date: '05/15',
    accent: '#7B3FF2',
    summary: '左滑进入批量管理，支持删除、重命名与详情页确认弹窗。',
    metrics: ['列表', '批量', '详情'],
  },
]

function App() {
  const [activeDemo, setActiveDemo] = useState(null)
  const currentDemo = demoItems.find((item) => item.id === activeDemo)

  if (currentDemo?.id === 'audio-delete') {
    return (
      <div className="app-root preview-root">
        <div className="preview-shell">
          <div className="preview-topbar">
            <button className="back-button" onClick={() => setActiveDemo(null)}>‹</button>
            <div>
              <div className="preview-kicker">Demo Preview</div>
              <div className="preview-title">{currentDemo.title}</div>
            </div>
          </div>
          <div className="preview-content">
            <AudioDeleteDemo />
          </div>
        </div>
      </div>
    )
  }

  return <DemoHome items={demoItems} onOpen={setActiveDemo} />
}

function DemoHome({ items, onOpen }) {
  return (
    <main className="app-root">
      <section className="home-shell">
        <div className="home-hero">
          <div className="hero-copy">
            <div className="eyebrow">PRD Demo Hub</div>
            <h1>产品交互预览</h1>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <span>Demo List</span>
            <h2>选择要体验的页面</h2>
          </div>
          <em>持续扩展</em>
        </div>

        <div className="demo-list">
          {items.map((item) => (
            <button className="demo-card" key={item.id} onClick={() => onOpen(item.id)}>
              <div className="demo-card-top">
                <span className="status-pill">{item.status}</span>
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
      </section>
    </main>
  )
}

export default App
