import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

async function readBuildVersion() {
  const response = await fetch(`/version.json?ts=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'cache-control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch version metadata')
  }

  const data = await response.json()
  return data.version
}

function createUpdateWatcher() {
  let activeVersion = null
  let dismissedVersion = null
  let started = false

  const notify = (nextVersion) => {
    if (!nextVersion || nextVersion === activeVersion || nextVersion === dismissedVersion) return

    window.dispatchEvent(new CustomEvent('app-update-available', {
      detail: { version: nextVersion },
    }))
  }

  const checkForUpdate = async () => {
    try {
      const nextVersion = await readBuildVersion()

      if (!activeVersion) {
        activeVersion = nextVersion
        window.__APP_BUILD_VERSION__ = nextVersion
        window.dispatchEvent(new CustomEvent('app-build-version-ready', {
          detail: { version: nextVersion },
        }))
        return
      }

      notify(nextVersion)
    } catch {
      return
    }
  }

  const dismissUpdate = (version) => {
    dismissedVersion = version
  }

  const start = () => {
    if (started) return
    started = true

    checkForUpdate()
    window.setTimeout(checkForUpdate, 4000)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate()
      }
    })

    window.addEventListener('focus', checkForUpdate)
    window.addEventListener('app-update-dismissed', (event) => {
      dismissUpdate(event.detail?.version ?? null)
    })
  }

  return {
    start,
  }
}

createUpdateWatcher().start()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
