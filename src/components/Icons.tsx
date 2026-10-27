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

/**
 * A simple "in" mark drawn for the LinkedIn card. Simple Icons no longer
 * serves a LinkedIn glyph (the CDN returns 404), so this replaces it.
 * Drawn as plain shapes — no font or image dependency.
 */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <circle cx="6.1" cy="6.1" r="2" />
      <rect x="4.2" y="9.4" width="3.8" height="10.3" rx="0.5" />
      <path d="M10.5 19.7V9.4h3.6v1.4c.8-1 2-1.6 3.4-1.6 2.4 0 3.9 1.6 3.9 4.4v6.1h-3.7v-5.6c0-1.3-.6-2-1.6-2s-1.9.8-1.9 2.2v5.4z" />
    </svg>
  )
}
