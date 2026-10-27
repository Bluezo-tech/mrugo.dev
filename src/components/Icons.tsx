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

/* ---- icons added for the full nav ---- */

export function LayersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 3.6l8 4.2-8 4.2-8-4.2 8-4.2z" />
      <path d="M4 13.2l8 4.2 8-4.2" />
    </svg>
  )
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
      <path d="M7 9.6l2.6 2.4L7 14.4" />
      <path d="M12.4 14.8h4.2" />
    </svg>
  )
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 6.4C10.6 5.2 8.8 4.6 6.6 4.6H4v13.2h2.6c2.2 0 4 .6 5.4 1.8 1.4-1.2 3.2-1.8 5.4-1.8H20V4.6h-2.6c-2.2 0-4 .6-5.4 1.8z" />
      <path d="M12 6.4v13.2" />
    </svg>
  )
}

export function GraduationIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 4.2l9 4.1-9 4.1-9-4.1 9-4.1z" />
      <path d="M6.5 10.3v4.4c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.4" />
      <path d="M20.4 9v6.2" />
    </svg>
  )
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 20s-7.2-4.4-7.2-9.2A3.9 3.9 0 0112 8.4a3.9 3.9 0 017.2 2.4C19.2 15.6 12 20 12 20z" />
    </svg>
  )
}

export function UserCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="10" cy="8" r="3.4" />
      <path d="M3.6 20.2c0-3.2 2.9-5.8 6.4-5.8 1.2 0 2.3.3 3.3.8" />
      <path d="M14.6 17.6l1.9 1.9 3.6-3.9" />
    </svg>
  )
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="17.6" cy="5.6" r="2.6" />
      <circle cx="6.4" cy="12" r="2.6" />
      <circle cx="17.6" cy="18.4" r="2.6" />
      <path d="M8.7 10.8l6.6-3.7" />
      <path d="M8.7 13.2l6.6 3.7" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" />
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
