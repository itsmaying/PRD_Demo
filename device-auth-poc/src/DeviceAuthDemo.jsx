import React, { useEffect, useMemo, useState } from 'react'
import './AudioDeleteDemo.css'
import {
  SearchIcon,
  HeaderEarbudIcon,
  MessageIcon,
  MoreIcon,
  BackIcon,
  LeftEarStatusIcon,
  RightEarStatusIcon,
  CaseStatusIcon,
} from './icons.jsx'

const pages = {
  home: 'home',
  setup: 'setup',
  bluetooth: 'bluetooth',
  connected: 'connected',
  otaDetail: 'ota-detail',
  otaProgress: 'ota-progress',
  otaResult: 'ota-result',
}

const demoModes = {
  auth: 'auth',
  ota: 'ota',
}

const authOutcomes = {
  pass: 'pass',
  unauthorized: 'unauthorized',
  snMissing: 'sn-missing',
  servicePending: 'service-pending',
}

const otaStates = {
  upToDate: 'up-to-date',
  available: 'available',
  blocked: 'blocked',
  failed: 'failed',
  systemBlocked: 'system-blocked',
}

const otaBlockReasons = {
  inUse: 'in-use',
  connection: 'connection',
  lowBattery: 'low-battery',
  notReady: 'not-ready',
  network: 'network',
  system: 'system',
}

const otaProgressStages = {
  preparing: 'preparing',
  upgrading: 'upgrading',
}

const otaResults = {
  success: 'success',
  failed: 'failed',
}

const authScenarios = [
  { id: 'manual-pass', label: '鉴权-设备页通过', mode: demoModes.auth, path: 'device', outcome: authOutcomes.pass, tenantEnabled: true },
  { id: 'manual-unauthorized', label: '鉴权-设备页未授权', mode: demoModes.auth, path: 'device', outcome: authOutcomes.unauthorized, tenantEnabled: true },
  { id: 'manual-sn-missing', label: '鉴权-SN获取失败', mode: demoModes.auth, path: 'device', outcome: authOutcomes.snMissing, tenantEnabled: true },
  { id: 'manual-service-pending', label: '鉴权-服务端未完成', mode: demoModes.auth, path: 'device', outcome: authOutcomes.servicePending, tenantEnabled: true },
  { id: 'home-pass', label: '鉴权-首页已连通过', mode: demoModes.auth, path: 'home', outcome: authOutcomes.pass, tenantEnabled: true },
  { id: 'home-unauthorized', label: '鉴权-首页已连未授权', mode: demoModes.auth, path: 'home', outcome: authOutcomes.unauthorized, tenantEnabled: true },
  { id: 'tenant-off', label: '鉴权-租户未开启', mode: demoModes.auth, path: 'device', outcome: authOutcomes.pass, tenantEnabled: false },
  { id: 'cached-pass', label: '鉴权-本机缓存命中', mode: demoModes.auth, path: 'device', outcome: authOutcomes.pass, tenantEnabled: true, useCache: true },
]

const otaScenarios = [
  { id: 'ota-up-to-date', label: 'OTA-已是最新版本', mode: demoModes.ota, otaState: otaStates.upToDate },
  { id: 'ota-success', label: 'OTA-升级成功', mode: demoModes.ota, otaState: otaStates.available, otaResult: otaResults.success },
  { id: 'ota-in-use', label: 'OTA-耳机占用中', mode: demoModes.ota, otaState: otaStates.blocked, blockReason: otaBlockReasons.inUse },
  { id: 'ota-connection', label: 'OTA-连接异常', mode: demoModes.ota, otaState: otaStates.blocked, blockReason: otaBlockReasons.connection },
  { id: 'ota-not-ready', label: 'OTA-未放盒内或盒盖未开', mode: demoModes.ota, otaState: otaStates.blocked, blockReason: otaBlockReasons.notReady },
  { id: 'ota-network', label: 'OTA-网络异常', mode: demoModes.ota, otaState: otaStates.blocked, blockReason: otaBlockReasons.network },
  { id: 'ota-low-battery', label: 'OTA-电量不足', mode: demoModes.ota, otaState: otaStates.blocked, blockReason: otaBlockReasons.lowBattery },
  { id: 'ota-system-blocked', label: 'OTA-暂时无法升级', mode: demoModes.ota, otaState: otaStates.systemBlocked, blockReason: otaBlockReasons.system },
  { id: 'ota-failed', label: 'OTA-升级失败', mode: demoModes.ota, otaState: otaStates.failed, otaResult: otaResults.failed },
]

const modalContent = {
  [authOutcomes.unauthorized]: '当前设备未授权，请联系管理员',
  [authOutcomes.snMissing]: '当前无法识别设备，请重新连接后重试',
  [authOutcomes.servicePending]: '当前无法完成设备验证，请稍后重试',
}

const otaBlockContent = {
  [otaBlockReasons.inUse]: {
    title: '当前耳机正在使用中',
    message: '请结束当前使用后再试',
  },
  [otaBlockReasons.connection]: {
    title: '当前耳机连接状态异常',
    message: '请确认耳机已连接 App 后再试',
  },
  [otaBlockReasons.lowBattery]: {
    title: '当前设备电量不足',
    message: '请确保耳机及充电盒电量不低于 20% 后再试',
  },
  [otaBlockReasons.notReady]: {
    title: '请将双耳放入盒内，并保持盒盖开启',
    message: '确认耳机已放稳后重新开始升级',
  },
  [otaBlockReasons.network]: {
    title: '当前网络状态异常',
    message: '请检查网络后再试',
  },
  [otaBlockReasons.system]: {
    title: '当前暂时无法升级',
    message: '请稍后再试',
  },
}

const otaNotes = [
  '请将耳机放入盒内，并保持盒盖开启',
  '请将耳机靠近手机，避免蓝牙中断',
  '升级期间请勿使用耳机相关能力',
  '请勿退出 App 或离开当前页面',
]

function ScenarioBar({ scenarios, activeScenarioId, onChange, showModeSwitch, demoMode, onDemoModeChange }) {
  return (
    <div className="scenario-bar">
      <div className="scenario-bar-label">演示场景</div>
      <div className="scenario-control-row">
        {showModeSwitch ? (
          <div className="scenario-mode-row">
            <button
              className={`scenario-mode-chip${demoMode === demoModes.auth ? ' active' : ''}`}
              onClick={() => onDemoModeChange(demoModes.auth)}
            >
              鉴权
            </button>
            <button
              className={`scenario-mode-chip${demoMode === demoModes.ota ? ' active' : ''}`}
              onClick={() => onDemoModeChange(demoModes.ota)}
            >
              OTA
            </button>
          </div>
        ) : null}
        <div className="scenario-chip-row">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              className={`scenario-chip${scenario.id === activeScenarioId ? ' active' : ''}`}
              onClick={() => onChange(scenario.id)}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FailureModal({ title = '连接失败', message, confirmLabel = '我知道了', onClose }) {
  if (!message) return null

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card" role="dialog" aria-modal="true">
        <div className="auth-modal-title">{title}</div>
        <div className="auth-modal-message">{message}</div>
        <button className="auth-modal-button" onClick={onClose}>{confirmLabel}</button>
      </div>
    </div>
  )
}

function BottomSheet({ title, message, confirmLabel = '我知道了', onClose }) {
  if (!title && !message) return null

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        {title ? <div className="sheet-title">{title}</div> : null}
        {message ? <div className="sheet-message">{message}</div> : null}
        <button className="sheet-button" onClick={onClose}>{confirmLabel}</button>
      </div>
    </div>
  )
}

function HomePage({ connected, onOpenEarbud }) {
  const earbudAlt = connected ? '已连接耳机入口' : '未连接耳机入口'

  return (
    <div className="screen home-screen header-focus-screen">
      <div className="header-stage">
        <div className="header-strip">
          <div className="header-search-wrap">
            <div className="header-search-pill">
              <div className="header-search-icon">
                <SearchIcon />
              </div>
              <div className="header-search-text">请输入姓名或手机号</div>
            </div>

            <button className={`header-earbud-block${connected ? ' connected' : ''}`} aria-label={earbudAlt} onClick={onOpenEarbud}>
              <HeaderEarbudIcon connected={connected} />
            </button>
          </div>

          <button className="header-message-block" aria-label="消息入口">
            <MessageIcon />
            <span className="header-message-dot" />
          </button>

          <button className="header-more-block" aria-label="更多入口">
            <MoreIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function SetupPage({ onBack, onGoSettings }) {
  return (
    <div className="device-page">
      <div className="device-page-topbar">
        <button className="device-page-icon-button" aria-label="返回" onClick={onBack}>
          <BackIcon />
        </button>
        <div className="device-page-spacer" />
      </div>

      <div className="setup-page-body">
        <div className="setup-illustration-card" aria-hidden="true">
          <div className="setup-illustration-lid" />
          <div className="setup-illustration-base">
            <div className="setup-earbud setup-earbud-left" />
            <div className="setup-earbud setup-earbud-right" />
            <div className="setup-case-indicator" />
          </div>
        </div>

        <ol className="setup-instruction-list">
          <li>将耳机放回充电盒，保持盒盖开启，长按充电盒上的按钮 3 秒至闪灯；</li>
          <li>打开系统「设置」—「蓝牙」，在其他设备选择 iFLYBUDS，完成配对。</li>
        </ol>
      </div>

      <div className="setup-footer">
        <button className="setup-primary-button" onClick={onGoSettings}>去设置</button>
      </div>
    </div>
  )
}

function BluetoothPage() {
  return (
    <div className="device-page bluetooth-page">
      <div className="device-page-topbar bluetooth-topbar">
        <div className="device-page-spacer" />
        <div className="device-page-title">蓝牙</div>
        <div className="device-page-spacer" />
      </div>

      <div className="bluetooth-page-body">
        <div className="bluetooth-card">
          <div className="bluetooth-card-header">
            <span>其他设备</span>
          </div>
          <div className="bluetooth-device-row connecting">
            <span>iFLYBUDS</span>
            <span className="bluetooth-device-status">连接中...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConnectedIllustration() {
  return (
    <div className="connected-illustration" aria-hidden="true">
      <div className="connected-lid" />
      <div className="connected-base">
        <div className="connected-earbud-shell connected-earbud-shell-left">
          <div className="connected-earbud-core connected-earbud-core-left" />
          <div className="connected-earbud-stem connected-earbud-stem-left" />
        </div>
        <div className="connected-earbud-shell connected-earbud-shell-right">
          <div className="connected-earbud-core connected-earbud-core-right" />
          <div className="connected-earbud-stem connected-earbud-stem-right" />
        </div>
        <div className="connected-case-notch" />
      </div>
    </div>
  )
}

function DeviceMetaRow({ label, value, highlight = false, dot = false, onClick }) {
  return (
    <button className={`device-meta-row${highlight ? ' highlight' : ''}`} onClick={onClick}>
      <span className="device-meta-label">{label}</span>
      <span className="device-meta-value-wrap">
        {dot && <span className="device-meta-dot" />}
        <span className={`device-meta-value${highlight ? ' highlight' : ''}`}>{value}</span>
        <span className="device-meta-arrow">›</span>
      </span>
    </button>
  )
}

function ConnectedPage({ onBack, firmwareVersion, firmwareStatusLabel, onOpenFirmware }) {
  const firmwareValue = firmwareStatusLabel === '可升级' || firmwareStatusLabel === '发现新版本'
    ? '发现新版本'
    : firmwareStatusLabel === '升级中'
      ? '升级中'
      : firmwareVersion
  const hasUpgrade = firmwareValue === '发现新版本'
  const isProgress = firmwareValue === '升级中'

  return (
    <div className="device-page device-overview-page">
      <div className="device-page-topbar device-overview-topbar">
        <button className="device-page-icon-button" aria-label="返回" onClick={onBack}>
          <BackIcon />
        </button>
        <div className="device-page-title device-overview-title">连接耳机</div>
        <div className="device-page-spacer" />
      </div>

      <div className="device-overview-body compact">
        <section className="device-hero-section compact">
          <ConnectedIllustration />
        </section>

        <section className="device-battery-inline-section">
          <div className="device-status-row device-status-inline-row">
            <div className="device-status-item compact">
              <LeftEarStatusIcon />
              <span>100%</span>
            </div>
            <div className="device-status-item compact">
              <RightEarStatusIcon />
              <span>100%</span>
            </div>
            <div className="device-status-item compact">
              <CaseStatusIcon />
              <span>100%</span>
            </div>
          </div>
        </section>

        <section className="device-single-entry-card">
          <DeviceMetaRow
            label="固件版本"
            value={firmwareValue}
            highlight={hasUpgrade || isProgress}
            dot={hasUpgrade}
            onClick={onOpenFirmware}
          />
        </section>
      </div>
    </div>
  )
}

function OtaHeader({ onBack, title = '', hideBack = false }) {
  return (
    <div className={`device-page-topbar ota-light-topbar${hideBack ? ' no-back' : ''}${title ? '' : ' title-hidden'}`}>
      {hideBack ? (
        <div className="device-page-spacer" />
      ) : (
        <button className="device-page-icon-button" aria-label="返回" onClick={onBack}>
          <BackIcon />
        </button>
      )}
      {title ? <div className="device-page-title ota-light-title">{title}</div> : <div className="device-page-spacer" />}
      <div className="device-page-spacer" />
    </div>
  )
}

function OtaDeviceHero() {
  return (
    <div className="ota-device-hero">
      <ConnectedIllustration />
    </div>
  )
}

function OtaStatusIcon({ success = true, progress = false }) {
  return (
    <div className={`ota-status-icon${progress ? ' progress' : ''}`} aria-hidden="true">
      <div className="ota-status-icon-chip" />
      <div className={`ota-status-icon-badge${success ? ' success' : ''}${progress ? ' progress' : ''}`}>
        {progress ? '•' : success ? '✓' : '!'}
      </div>
    </div>
  )
}

function OtaDetailPage({ scenario, onBack, onStartUpgrade, sheetVisible }) {
  const hasUpdate = scenario.otaState !== otaStates.upToDate

  if (!hasUpdate) {
    return (
      <div className="device-page ota-light-page ota-status-page">
        <OtaHeader onBack={onBack} />

        <div className="ota-detail-scroll ota-up-to-date-scroll plain-state-scroll">
          <div className="ota-plain-state">
            <div className="ota-result-icon light success">✓</div>
            <div className="ota-result-title light">当前已是最新版本</div>
            <div className="ota-up-to-date-version">当前版本：V1.0.0</div>
          </div>
        </div>

        <div className="ota-footer">
          <button className="setup-primary-button secondary" onClick={onBack}>返回</button>
        </div>
      </div>
    )
  }

  return (
    <div className="device-page ota-light-page ota-detail-page">
      <OtaHeader onBack={onBack} />

      <div className={`ota-detail-scroll ota-page-flow compact-ota-flow refined-ota-detail-scroll${sheetVisible ? ' sheet-open' : ''}`}>
        <section className="ota-page-hero compact-hero refined-ota-hero">
          <div className="ota-detail-headline compact refined">发现新版本</div>
          <div className="ota-version-inline-row compact refined">
            <span className="ota-version-inline-strong">V1.0.0</span>
            <span className="ota-version-arrow">→</span>
            <span className="ota-version-inline-strong">V1.0.1</span>
          </div>
        </section>

        <section className="ota-page-section first compact-section refined-section">
          <div className="ota-page-section-title">更新日志</div>
          <div className="ota-brief-list refined-copy">
            <div>优化连接稳定性</div>
            <div>修复若干已知问题</div>
          </div>
        </section>

        <section className="ota-page-section compact-section refined-section">
          <div className="ota-page-section-title">升级前请确认</div>
          <div className="ota-brief-list refined-copy">
            <div>耳机连接 App，放入盒内并保持盒盖开启</div>
            <div>升级时请让耳机靠近手机，期间不要退出升级页面或 App</div>
            <div>请确保耳机及充电盒电量不低于 20%</div>
          </div>
        </section>

        <div className="ota-footnote-copy refined-footnote">
          若升级失败，当前稳定版本仍可继续使用。
        </div>
      </div>

      <div className="ota-footer">
        <button className="setup-primary-button ota-action-button" onClick={onStartUpgrade}>开始升级</button>
      </div>
    </div>
  )
}

function OtaProgressPage({ progress, stage, onBack }) {
  const headline = stage === otaProgressStages.preparing ? '正在准备升级' : '升级中'
  const stageMessage = stage === otaProgressStages.preparing
    ? '准备完成后将继续升级。'
    : '请保持耳机与手机稳定连接。'
  const progressToneClass = stage === otaProgressStages.preparing ? ' preparing' : ' upgrading'

  return (
    <div className="device-page ota-light-page ota-progress-page">
      <OtaHeader onBack={onBack} title="固件升级" hideBack />

      <div className="ota-detail-scroll ota-progress-page-flow refined-progress-scroll">
        <section className="ota-page-hero progress-hero refined-progress-hero">
          <div className="ota-detail-headline progress-headline refined-progress-title">{headline}</div>
          <div className={`ota-progress-inline-row${progressToneClass}`}>
            <div className="ota-progress-track refined large plain-track inline-progress-track">
              <div className={`ota-progress-fill${progressToneClass}`} style={{ width: `${progress}%` }} />
            </div>
            <div className={`ota-progress-percent prominent inline-percent${progressToneClass}`}>{progress}%</div>
          </div>
          <div className={`ota-progress-stage refined-progress-copy${progressToneClass}`}>{stageMessage}</div>
        </section>

        <section className="ota-page-section subtle progress-notes-section refined-progress-notes">
          <div className="ota-page-section-title">升级期间请注意</div>
          <div className="ota-minimal-note-block plain-note-block refined-note-block">
            <div>请将双耳放入盒内，并保持盒盖开启</div>
            <div>升级时请让耳机靠近手机，期间不要退出升级页面或 App</div>
            <div>若升级失败，当前稳定版本仍可继续使用</div>
          </div>
        </section>
      </div>
    </div>
  )
}

function OtaResultPage({ result, onDone }) {
  const success = result === otaResults.success

  return (
    <div className="device-page ota-light-page ota-status-page">
      <OtaHeader hideBack />

      <div className="ota-detail-scroll ota-result-scroll refined-result-scroll plain-state-scroll refined-state-scroll">
        <div className="ota-plain-state refined-result-state">
          <div className={`ota-result-icon light ${success ? 'success' : 'failed'}`}>{success ? '✓' : '!'}</div>
          <div className="ota-result-title light refined-result-title">{success ? '固件升级完成' : '升级失败，请稍后重试'}</div>
          <div className="ota-result-subtitle light refined-result-subtitle">
            {success ? '设备已更新到最新版本。' : '当前稳定版本仍可继续使用。'}
          </div>
        </div>
      </div>

      <div className="ota-footer">
        <button className="setup-primary-button ota-action-button unified-primary-button" onClick={onDone}>我知道了</button>
      </div>
    </div>
  )
}

export default function DeviceAuthDemo({ demoMode = demoModes.ota, onDemoModeChange = () => {}, showModeSwitch = true } = {}) {
  const scenarios = demoMode === demoModes.auth ? authScenarios : otaScenarios
  const [scenarioId, setScenarioId] = useState(() => scenarios[0].id)
  const [page, setPage] = useState(pages.home)
  const [connected, setConnected] = useState(false)
  const [modalKey, setModalKey] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('连接失败')
  const [sheetTitle, setSheetTitle] = useState('当前无法升级')
  const [sheetMessage, setSheetMessage] = useState('')
  const [firmwareVersion, setFirmwareVersion] = useState('V1.0.0')
  const [firmwareStatusLabel, setFirmwareStatusLabel] = useState('已是最新')
  const [otaProgress, setOtaProgress] = useState(0)
  const [otaProgressStage, setOtaProgressStage] = useState(otaProgressStages.preparing)
  const [otaResult, setOtaResult] = useState(otaResults.success)

  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0], [scenarioId, scenarios])

  const presentOutcome = (currentPage) => {
    if (!scenario.tenantEnabled) {
      setConnected(true)
      setPage(currentPage === pages.home ? pages.home : pages.connected)
      return
    }

    if (scenario.useCache || scenario.outcome === authOutcomes.pass) {
      setConnected(true)
      setPage(currentPage === pages.home ? pages.home : pages.connected)
      return
    }

    const outcomeKey = `${scenario.id}-${currentPage}`
    if (modalKey === outcomeKey) {
      setPage(currentPage)
      return
    }

    setConnected(false)
    setPage(currentPage)
    setModalKey(outcomeKey)
    setModalTitle('连接失败')
    setModalMessage(modalContent[scenario.outcome])
  }

  const startOtaUpgrade = () => {
    if (scenario.otaState === otaStates.blocked || scenario.otaState === otaStates.systemBlocked) {
      const blockContent = otaBlockContent[scenario.blockReason]
      setSheetTitle(blockContent.title)
      setSheetMessage(blockContent.message)
      return
    }

    setModalTitle('连接失败')
    setModalMessage('')
    setSheetTitle('')
    setSheetMessage('')
    setOtaProgress(0)
    setOtaProgressStage(otaProgressStages.preparing)
    setFirmwareStatusLabel('升级中')
    setPage(pages.otaProgress)
  }

  const handleProgressBack = () => {
    setModalTitle('确认离开')
    setModalMessage('离开将导致本次升级中断，请确认是否仍要离开当前页面。')
  }

  useEffect(() => {
    setModalMessage('')
    setModalKey('')
    setModalTitle('连接失败')
    setSheetTitle('')
    setSheetMessage('')
    setOtaProgress(0)
    setOtaProgressStage(otaProgressStages.preparing)
    setOtaResult(scenario.otaResult ?? otaResults.success)

    if (scenario.mode === demoModes.ota) {
      setConnected(true)
      setPage(pages.connected)
      setFirmwareVersion('V1.0.0')

      if (scenario.otaState === otaStates.upToDate) {
        setFirmwareStatusLabel('已是最新')
      } else {
        setFirmwareStatusLabel('发现新版本')
      }

      return
    }

    setFirmwareVersion('7.0.0.93')
    setFirmwareStatusLabel('已是最新')

    if (scenario.path === 'home') {
      if (!scenario.tenantEnabled || scenario.useCache || scenario.outcome === authOutcomes.pass) {
        setConnected(true)
      } else {
        setConnected(false)
      }
      setPage(pages.home)
      return
    }

    setConnected(false)
    setPage(pages.home)
  }, [scenario])

  useEffect(() => {
    if (scenario.mode !== demoModes.auth || page !== pages.bluetooth) return undefined

    const timeoutId = window.setTimeout(() => {
      presentOutcome(pages.connected)
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [page, scenario, modalKey])

  useEffect(() => {
    if (scenario.mode !== demoModes.ota || page !== pages.otaProgress) return undefined

    if (scenario.otaState === otaStates.failed) {
      const failedFlow = [
        window.setTimeout(() => {
          setOtaProgressStage(otaProgressStages.preparing)
          setOtaProgress(24)
        }, 320),
        window.setTimeout(() => setOtaProgress(78), 980),
        window.setTimeout(() => setOtaProgressStage(otaProgressStages.upgrading), 1260),
        window.setTimeout(() => {
          setOtaProgress(32)
          setOtaResult(otaResults.failed)
          setFirmwareStatusLabel('发现新版本')
          setPage(pages.otaResult)
        }, 1880),
      ]

      return () => failedFlow.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }

    const successFlow = [
      window.setTimeout(() => {
        setOtaProgressStage(otaProgressStages.preparing)
        setOtaProgress(26)
      }, 320),
      window.setTimeout(() => setOtaProgress(100), 980),
      window.setTimeout(() => {
        setOtaProgressStage(otaProgressStages.upgrading)
        setOtaProgress(18)
      }, 1280),
      window.setTimeout(() => setOtaProgress(56), 1880),
      window.setTimeout(() => setOtaProgress(100), 2520),
      window.setTimeout(() => {
        setPage(pages.otaResult)
        setOtaResult(scenario.otaResult ?? otaResults.success)
      }, 2860),
    ]

    return () => successFlow.forEach((timeoutId) => window.clearTimeout(timeoutId))
  }, [page, scenario])

  const handleOtaDone = () => {
    if (otaResult === otaResults.success) {
      setFirmwareVersion('V1.0.1')
      setFirmwareStatusLabel('已是最新')
    } else {
      setFirmwareVersion('V1.0.0')
      setFirmwareStatusLabel('有新的固件')
    }
    setPage(pages.connected)
  }

  const handleOpenFirmware = () => {
    if (scenario.mode !== demoModes.ota) {
      setPage(pages.connected)
      return
    }

    setPage(pages.otaDetail)
  }

  const handleOpenEarbud = () => {
    if (scenario.mode === demoModes.auth) {
      if (scenario.path === 'home') {
        presentOutcome(pages.home)
        return
      }

      if (!connected) {
        setPage(pages.setup)
        return
      }

      presentOutcome(pages.connected)
      return
    }

    setPage(connected ? pages.connected : pages.setup)
  }

  return (
    <div className="audio-demo-wrapper app-shell header-focus-shell">
      <ScenarioBar
        scenarios={scenarios}
        activeScenarioId={scenario.id}
        onChange={setScenarioId}
        showModeSwitch={showModeSwitch}
        demoMode={demoMode}
        onDemoModeChange={onDemoModeChange}
      />

      {page === pages.home && (
        <HomePage
          connected={connected}
          onOpenEarbud={handleOpenEarbud}
        />
      )}
      {page === pages.setup && <SetupPage onBack={() => setPage(pages.home)} onGoSettings={() => setPage(pages.bluetooth)} />}
      {page === pages.bluetooth && <BluetoothPage />}
      {page === pages.connected && (
        <ConnectedPage
          onBack={() => setPage(pages.home)}
          firmwareVersion={firmwareVersion}
          firmwareStatusLabel={firmwareStatusLabel}
          onOpenFirmware={handleOpenFirmware}
        />
      )}
      {page === pages.otaDetail && (
        <OtaDetailPage
          scenario={scenario}
          onBack={() => setPage(pages.connected)}
          onStartUpgrade={startOtaUpgrade}
          sheetVisible={Boolean(sheetTitle || sheetMessage)}
        />
      )}
      {page === pages.otaProgress && <OtaProgressPage progress={otaProgress} stage={otaProgressStage} onBack={handleProgressBack} />}
      {page === pages.otaResult && <OtaResultPage result={otaResult} onDone={handleOtaDone} />}

      <FailureModal
        title={modalTitle}
        message={modalMessage}
        onClose={() => {
          setModalMessage('')
        }}
      />
      <BottomSheet
        title={sheetTitle}
        message={sheetMessage}
        onClose={() => {
          setSheetTitle('')
          setSheetMessage('')
        }}
      />
    </div>
  )
}
