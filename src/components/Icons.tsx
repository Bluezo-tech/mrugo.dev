type IconProps = { className?: string }

/** Small line icons drawn for this site — inherit colour from the parent. */

export function PersonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.2c0-3.4 3.1-6.2 7-6.2s7 2.8 7 6.2" />
    </svg>
  )
}

export function CodeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M8.6 7.4L4 12l4.6 4.6" />
      <path d="M15.4 7.4L20 12l-4.6 4.6" />
    </svg>
  )
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="7.5" width="18" height="12" rx="2.6" />
      <path d="M9 7.5V6.2A2.2 2.2 0 0111.2 4h1.6A2.2 2.2 0 0115 6.2v1.3" />
      <path d="M3 12.6h18" />
    </svg>
  )
}

export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="5.5" width="18" height="13" rx="2.6" />
      <path d="M4.2 7.2L12 13l7.8-5.8" />
    </svg>
  )
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.6V12l3.1 2" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  )
}
