import { useEffect, useRef, useState } from 'react'
import './SalesVoiceprintDemo.css'

const pageKeys = {
  empty: 'empty',
  recording: 'recording',
  success: 'success',
  recorded: 'recorded',
}

const recordingStatus = {
  ready: 'ready',
  active: 'active',
  failed_duration: 'failed_duration',
  failed_silent: 'failed_silent',
}

const MIN_RECORDING_SECONDS = 10
const MAX_RECORDING_SECONDS = 60
const COUNTDOWN_START_SECONDS = 10
const SILENT_THRESHOLD = 0.01

const voiceprintStatus = {
  processing: 'processing',
  valid: 'valid',
  invalid: 'invalid',
}

const previewStates = [
  { id: 'empty', label: '未录入' },
  { id: 'ready', label: '录制前' },
  { id: 'active', label: '录制中' },
  { id: 'failed_duration', label: '录制失败(时长)' },
  { id: 'failed_silent', label: '录制失败(空音频)' },
  { id: 'success', label: '录制成功' },
  { id: 'recorded', label: '已录入' },
]

const fixedScriptSegments = [
  '我正在使用 FindAI 闪电销售助手配套的智能销售耳机。',
  '它能帮我实现客户的全场景数据采集和深度分析，通话中实时提供销售赋能小抄帮助我把握关键机会，线下接待也能获得场景化的赋能支持。',
  '通过精准识别销售人员的声音特征，让每次客户互动都能被准确追踪和分析，帮助我持续提升服务质量和增长效果。'
]
const fixedScript = fixedScriptSegments.join('\n')

function Toast({ message }) {
  if (!message) return null

  return <div className="svp-toast">{message}</div>
}

function DeleteModal({ open, onCancel, onConfirm }) {
  if (!open) return null

  return (
    <div className="svp-modal-overlay" onClick={onCancel}>
      <div className="svp-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="svp-modal-title">删除当前样本？</div>
        <div className="svp-modal-desc">删除后，后续新录音将恢复系统默认识别方式。</div>
        <div className="svp-modal-actions">
          <button className="svp-secondary-btn" onClick={onCancel}>取消</button>
          <button className="svp-danger-btn" onClick={onConfirm}>确认删除</button>
        </div>
      </div>
    </div>
  )
}

function ControlPanel({ earphonesConnected, onToggleEarphones, activePreviewState, onSelectPreviewState, showCountdown, onToggleCountdown, sampleStatus, onChangeSampleStatus }) {
  return (
    <div className="svp-control-panel">
      <div className="svp-control-label">演示场景</div>
      <div className="svp-control-chip-row">
        {previewStates.map((state) => (
          <button
            key={state.id}
            className={`svp-control-chip${activePreviewState === state.id ? ' active' : ''}`}
            onClick={() => onSelectPreviewState(state.id)}
          >
            {state.label}
          </button>
        ))}
      </div>
      <div className="svp-control-card">
        <div className="svp-control-card-row">
          <label className="svp-control-checkbox">
            <input type="checkbox" checked={showCountdown} onChange={onToggleCountdown} />
            <span>倒计时</span>
          </label>
        </div>
        <div className="svp-control-card-row">
          <span className="svp-control-card-label">声纹状态</span>
          <div className="svp-control-status-buttons">
            {['processing', 'valid', 'invalid'].map((status) => (
              <button
                key={status}
                className={`svp-control-status-btn${sampleStatus === status ? ' active' : ''}`}
                onClick={() => onChangeSampleStatus(status)}
              >
                {status === 'processing' ? '处理中' : status === 'valid' ? '可用' : '建议重录'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="svp-control-footer">
        <button
          className={`svp-control-toggle${earphonesConnected ? ' connected' : ''}`}
          onClick={onToggleEarphones}
        >
          {earphonesConnected ? '工作耳机已连接' : '工作耳机未连接'}
        </button>
      </div>
    </div>
  )
}

function PageShell({ children }) {
  return (
    <section className="svp-page">
      <div className="svp-page-nav">
        <button className="svp-page-back" aria-label="返回">‹</button>
        <div className="svp-page-nav-title">我的声音</div>
        <div className="svp-page-nav-spacer" />
      </div>
      {children}
    </section>
  )
}

function RecordingStepBar({ status }) {
  const currentStep = status === recordingStatus.failed ? 2 : status === recordingStatus.active ? 2 : 1

  return (
    <div className="svp-step-bar" aria-hidden="true">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`svp-step-segment${step <= currentStep ? ' active' : ''}`}
        />
      ))}
    </div>
  )
}

function RecordingWave({ active }) {
  return (
    <div className={`svp-recording-wave${active ? ' active' : ''}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((bar) => <span key={bar} />)}
    </div>
  )
}

function RecordingCountdown({ seconds }) {
  if (!seconds) return null
  const progress = ((MAX_RECORDING_SECONDS - seconds) / MAX_RECORDING_SECONDS) * 100
  return (
    <div className="svp-countdown-bar">
      <div className="svp-countdown-progress">
        <div className="svp-countdown-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="svp-countdown-text">{seconds}s 后自动提交</span>
    </div>
  )
}

function RecordingPage({ status, onStart, onComplete, onRetry, isSubmitting, countdownSeconds, showCountdown }) {
  const failed = status === recordingStatus.failed_duration || status === recordingStatus.failed_silent
  const active = status === recordingStatus.active
  const isSilentFail = status === recordingStatus.failed_silent

  const titleText = !failed
    ? '开始录制声音样本'
    : isSilentFail
      ? '未检测到声音'
      : '录音时长过短'

  const leadText = !failed
    ? (active ? '请朗读下方内容' : '请佩戴工作耳机完成录制')
    : isSilentFail
      ? '请确保正确佩戴耳机'
      : '请完整朗读一遍内容'

  const actionHint = failed
    ? '请重新开始并完整朗读上方文字'
    : active
      ? '朗读完成后，点击完成'
      : '准备好后，点击开始并朗读上方文字'

  return (
    <PageShell>
      <RecordingStepBar status={status} />
      <h2 className={failed ? 'svp-error-title' : ''}>{titleText}</h2>
      <p className={`svp-lead-copy${failed ? ' svp-error-text' : ''}`}>{leadText}</p>
      <div className="svp-script-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <RecordingWave active={active && !failed} />
        </div>
        <div>{fixedScript}</div>
      </div>
      {showCountdown && active && <RecordingCountdown seconds={countdownSeconds} />}
      <div className="svp-action-hint">{actionHint}</div>
      <div className="svp-recording-actions">
        {failed ? (
          <button className="svp-primary-btn" onClick={onRetry}>重试</button>
        ) : active ? (
          <button className="svp-primary-btn" onClick={onComplete} disabled={isSubmitting}>{isSubmitting ? '提交中...' : '完成'}</button>
        ) : (
          <button className="svp-primary-btn" onClick={onStart}>开始录制</button>
        )}
      </div>
    </PageShell>
  )
}

function SuccessPage({ onAcknowledge }) {
  return (
    <PageShell>
      <div className="svp-success-page">
        <div className="svp-success-mark">✓</div>
        <h2>录入完成</h2>
        <div className="svp-copy-list centered">
          <p>录制完成后立即生效，仅对后续新录音生效</p>
        </div>
      </div>
      <button className="svp-primary-btn" onClick={onAcknowledge}>知道了</button>
    </PageShell>
  )
}

function RecordedPage({ onRerecord, status }) {
  const statusText = status === voiceprintStatus.processing
    ? '智能提取中'
    : status === voiceprintStatus.valid
      ? '✓ 可用'
      : '⚠ 建议重新录制'

  const statusIcon = status === voiceprintStatus.processing
    ? '⏳'
    : status === voiceprintStatus.valid
      ? '✓'
      : '⚠'

  const statusClass = status === voiceprintStatus.valid
    ? 'svp-status-valid'
    : status === voiceprintStatus.invalid
      ? 'svp-status-invalid'
      : 'svp-status-processing'

  return (
    <PageShell>
      <div className="svp-recorded-header">
        <p>已录入你的声音样本</p>
        <div className={`svp-status-inline ${statusClass}`}>
          <span className="svp-status-icon">{statusIcon}</span>
          {status === voiceprintStatus.processing ? (
            <>
              <span className="svp-status-text">智能提取中</span>
              <span className="svp-status-dots"></span>
            </>
          ) : (
            <span className="svp-status-text">{statusText.replace('✓', '').replace('⚠', '').trim()}</span>
          )}
        </div>
      </div>
      {status === voiceprintStatus.invalid && (
        <p className="svp-status-hint">样本未通过验证，建议重新录制以获得更好的识别效果</p>
      )}
      <div className="svp-recorded-actions">
        <button className="svp-primary-btn" onClick={onRerecord}>重新录制</button>
      </div>
    </PageShell>
  )
}

export default function SalesVoiceprintDemo() {
  const [page, setPage] = useState(pageKeys.empty)
  const [toast, setToast] = useState('')
  const [earphonesConnected, setEarphonesConnected] = useState(false)
  const [recordingState, setRecordingState] = useState(recordingStatus.ready)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [recordingStartTime, setRecordingStartTime] = useState(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [countdownSeconds, setCountdownSeconds] = useState(null)
  const [sampleStatus, setSampleStatus] = useState(voiceprintStatus.processing)
  const [showCountdown, setShowCountdown] = useState(true)
  const [demoCountdown, setDemoCountdown] = useState(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const micStreamRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const toastTimerRef = useRef(null)
  const demoCountdownIntervalRef = useRef(null)

  useEffect(() => () => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current)
    }
    if (demoCountdownIntervalRef.current) {
      window.clearInterval(demoCountdownIntervalRef.current)
    }
  }, [])

  const showToast = (message) => {
    setToast(message)
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2200)
  }

  const resetRecordingFlow = () => {
    setRecordingState(recordingStatus.ready)
    setAttemptCount(0)
    setIsSubmitting(false)
    setRecordingStartTime(null)
    setAudioLevel(0)
  }

  const handleAddSample = () => {
    if (!earphonesConnected) {
      showToast('请先连接工作耳机后再开始录制')
      return
    }

    resetRecordingFlow()
    setPage(pageKeys.recording)
  }

  const handleStartRecording = async () => {
    const now = Date.now()
    setRecordingStartTime(now)
    setRecordingState(recordingStatus.active)
    setAudioLevel(0)
    setCountdownSeconds(null)

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      if (!micStreamRef.current) {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
        const source = audioContextRef.current.createMediaStreamSource(micStreamRef.current)
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 2048
        source.connect(analyserRef.current)
      }

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255
          setAudioLevel(average)
        }

        const elapsedSeconds = (Date.now() - now) / 1000

        if (elapsedSeconds >= MAX_RECORDING_SECONDS) {
          setCountdownSeconds(null)
          return
        }

        if (elapsedSeconds > MAX_RECORDING_SECONDS - COUNTDOWN_START_SECONDS) {
          setCountdownSeconds(Math.ceil(MAX_RECORDING_SECONDS - elapsedSeconds))
        } else {
          setCountdownSeconds(null)
        }

        if (recordingState === recordingStatus.active) {
          requestAnimationFrame(updateAudioLevel)
        }
      }

      updateAudioLevel()
    } catch (e) {
      console.error('Failed to access microphone:', e)
    }
  }

  const handleCompleteRecording = () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    window.setTimeout(() => {
      const elapsedSeconds = recordingStartTime
        ? (Date.now() - recordingStartTime) / 1000
        : 0

      if (elapsedSeconds < MIN_RECORDING_SECONDS) {
        setRecordingState(recordingStatus.failed_duration)
        setAttemptCount(attemptCount + 1)
        setIsSubmitting(false)
        setRecordingStartTime(null)
        return
      }

      if (audioLevel < SILENT_THRESHOLD) {
        setRecordingState(recordingStatus.failed_silent)
        setAttemptCount(attemptCount + 1)
        setIsSubmitting(false)
        setRecordingStartTime(null)
        return
      }

      setPage(pageKeys.success)
      setIsSubmitting(false)
      setRecordingStartTime(null)
      setSampleStatus(voiceprintStatus.processing)
    }, 500)
  }

  const handleRetryRecording = () => {
    setRecordingState(recordingStatus.ready)
    setRecordingStartTime(null)
    setAudioLevel(0)
  }

  const handleAcknowledgeSuccess = () => {
    setPage(pageKeys.recorded)
  }


  const handleConfirmDelete = () => {
    setDeleteOpen(false)
    resetRecordingFlow()
    setPage(pageKeys.empty)
  }

  const handleRerecord = () => {
    resetRecordingFlow()
    setPage(pageKeys.recording)
  }

  const activePreviewState = page === pageKeys.recording
    ? recordingState === recordingStatus.failed_duration
      ? 'failed_duration'
      : recordingState === recordingStatus.failed_silent
        ? 'failed_silent'
        : recordingState === recordingStatus.active
          ? 'active'
          : 'ready'
    : page

  const handleSelectPreviewState = (stateId) => {
    setDeleteOpen(false)
    setToast('')
    setIsSubmitting(false)
    if (demoCountdownIntervalRef.current) {
      window.clearInterval(demoCountdownIntervalRef.current)
      setDemoCountdown(null)
    }

    if (stateId === 'failed_duration') {
      setPage(pageKeys.recording)
      setRecordingState(recordingStatus.failed_duration)
      setAttemptCount(1)
      setAudioLevel(0.05)
      return
    }

    if (stateId === 'failed_silent') {
      setPage(pageKeys.recording)
      setRecordingState(recordingStatus.failed_silent)
      setAttemptCount(1)
      setAudioLevel(0)
      return
    }

    if (stateId === 'ready' || stateId === 'active') {
      setPage(pageKeys.recording)
      setRecordingState(stateId === 'active' ? recordingStatus.active : recordingStatus.ready)
      setAttemptCount(stateId === 'active' ? 0 : 0)
      setAudioLevel(stateId === 'active' ? 0.3 : 0)

      // Start demo countdown if active and showing countdown
      if (stateId === 'active' && showCountdown) {
        let remaining = COUNTDOWN_START_SECONDS
        setDemoCountdown(remaining)
        if (demoCountdownIntervalRef.current) {
          window.clearInterval(demoCountdownIntervalRef.current)
        }
        demoCountdownIntervalRef.current = window.setInterval(() => {
          remaining -= 1
          if (remaining <= 0) {
            setDemoCountdown(null)
            window.clearInterval(demoCountdownIntervalRef.current)
          } else {
            setDemoCountdown(remaining)
          }
        }, 1000)
      }
      return
    }

    setRecordingState(recordingStatus.ready)
    setPage(stateId)
    setAttemptCount(1)
    setAudioLevel(0)
  }

  return (
    <div className="svp-demo-shell">
      <ControlPanel
        earphonesConnected={earphonesConnected}
        onToggleEarphones={() => setEarphonesConnected((value) => !value)}
        activePreviewState={activePreviewState}
        onSelectPreviewState={handleSelectPreviewState}
        showCountdown={showCountdown}
        onToggleCountdown={() => setShowCountdown((value) => !value)}
        sampleStatus={sampleStatus}
        onChangeSampleStatus={setSampleStatus}
      />
      <div className="svp-page-stage">
        <Toast message={toast} />
        <DeleteModal open={deleteOpen} onCancel={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} />

        {page === pageKeys.empty ? (
          <PageShell>
            <div className="svp-copy-list">
              <p>帮助系统更准确识别你的声音</p>
              <p>请佩戴工作耳机完成录制</p>
              <p>录制完成后立即生效，仅对后续新录音生效</p>
            </div>
            <button className="svp-primary-btn" onClick={handleAddSample}>添加声音样本</button>
          </PageShell>
        ) : null}

        {page === pageKeys.recording ? (
          <RecordingPage
            status={recordingState}
            onStart={handleStartRecording}
            onComplete={handleCompleteRecording}
            onRetry={handleRetryRecording}
            isSubmitting={isSubmitting}
            countdownSeconds={demoCountdown !== null ? demoCountdown : countdownSeconds}
            showCountdown={showCountdown}
          />
        ) : null}
      {page === pageKeys.success ? <SuccessPage onAcknowledge={handleAcknowledgeSuccess} /> : null}
      {page === pageKeys.recorded ? <RecordedPage onRerecord={handleRerecord} status={sampleStatus} /> : null}
      </div>
    </div>
  )
}
