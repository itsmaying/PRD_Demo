import React from 'react'

export function SearchIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M22.5 22.5L29 29" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function HeaderEarbudIcon({ connected = false }) {
  const stroke = connected ? '#232b36' : '#ff5a36'

  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <g fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 9.5c-3.8 0-6.8 3-6.8 6.8v6.3c0 2.5 2 4.5 4.5 4.5h1.3v3.5c0 2.3 1.9 4.2 4.2 4.2s4.2-1.9 4.2-4.2V16.3c0-3.8-3-6.8-6.8-6.8Z" />
        <path d="M28.5 9.5c3.8 0 6.8 3 6.8 6.8v6.3c0 2.5-2 4.5-4.5 4.5h-1.3v3.5c0 2.3-1.9 4.2-4.2 4.2s-4.2-1.9-4.2-4.2V16.3c0-3.8 3-6.8 6.8-6.8Z" />
        <path d="M13.8 17c1-1.2 2.3-1.9 3.9-1.9" />
        <path d="M30.2 17c-1-1.2-2.3-1.9-3.9-1.9" />
        <circle cx="15.7" cy="20.3" r="1.1" fill={stroke} stroke="none" />
        <circle cx="28.3" cy="20.3" r="1.1" fill={stroke} stroke="none" />
      </g>
    </svg>
  )
}

export function EarbudGlyph({ connected = false }) {
  const color = connected ? '#1f2733' : '#ff5a36'

  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10c-3.9 0-7 3.1-7 7v6.8c0 2.6 2.1 4.7 4.7 4.7h1.5v3.8c0 2.6 2.1 4.7 4.7 4.7 2.6 0 4.7-2.1 4.7-4.7V17c0-3.9-3.1-7-7-7Z" />
        <path d="M29 10c3.9 0 7 3.1 7 7v6.8c0 2.6-2.1 4.7-4.7 4.7h-1.5v3.8c0 2.6-2.1 4.7-4.7 4.7-2.6 0-4.7-2.1-4.7-4.7V17c0-3.9 3.1-7 7-7Z" />
        <path d="M13 17.7c1.1-1.4 2.7-2.2 4.5-2.2" />
        <path d="M31 17.7c-1.1-1.4-2.7-2.2-4.5-2.2" />
        <circle cx="15.2" cy="21.2" r="1.2" fill={color} stroke="none" />
        <circle cx="28.8" cy="21.2" r="1.2" fill={color} stroke="none" />
      </g>
    </svg>
  )
}

export function MessageIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8h16c5.5 0 10 4.5 10 10v5.2c0 5.5-4.5 10-10 10h-7.8L12 38v-4.8c-5.6-.2-10-4.6-10-10.2V18c0-5.5 4.5-10 10-10Z" />
        <path d="M14.5 20h0.01" />
        <path d="M20 20h0.01" />
        <path d="M25.5 20h0.01" />
      </g>
    </svg>
  )
}

export function MoreIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="9" cy="20" r="2.2" />
        <circle cx="20" cy="20" r="2.2" />
        <circle cx="31" cy="20" r="2.2" />
      </g>
    </svg>
  )
}

export function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 5 8 11.5 14.5 18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function LeftEarStatusIcon() {
  return (
    <svg viewBox="0 0 42 28" aria-hidden="true">
      <g fill="none" stroke="#15181f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4c-4 0-7 3-7 7v4c0 3 2.5 5.5 5.5 5.5H13V24c0 2 1.6 3.5 3.5 3.5S20 26 20 24V11c0-4-3-7-7-7Z" />
        <path d="M11.3 10c1-.9 2.1-1.4 3.4-1.4" />
      </g>
      <rect x="25" y="12" width="12" height="6" rx="3" fill="#84dd98" />
      <rect x="37" y="13.5" width="2.5" height="3" rx="1.2" fill="#84dd98" />
    </svg>
  )
}

export function RightEarStatusIcon() {
  return (
    <svg viewBox="0 0 42 28" aria-hidden="true">
      <g fill="none" stroke="#15181f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4c4 0 7 3 7 7v4c0 3-2.5 5.5-5.5 5.5H14V24c0 2-1.6 3.5-3.5 3.5S7 26 7 24V11c0-4 3-7 7-7Z" />
        <path d="M15.7 10c-1-.9-2.1-1.4-3.4-1.4" />
      </g>
      <rect x="25" y="12" width="12" height="6" rx="3" fill="#84dd98" />
      <rect x="37" y="13.5" width="2.5" height="3" rx="1.2" fill="#84dd98" />
    </svg>
  )
}

export function CaseStatusIcon() {
  return (
    <svg viewBox="0 0 42 28" aria-hidden="true">
      <rect x="4" y="7" width="20" height="14" rx="4" fill="#15181f" />
      <rect x="26" y="12" width="12" height="6" rx="3" fill="#84dd98" />
      <rect x="38" y="13.5" width="2.5" height="3" rx="1.2" fill="#84dd98" />
    </svg>
  )
}
