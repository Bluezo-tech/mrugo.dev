type MonogramProps = {
  /** Existing variant names are retained for callers; colors follow the site palette. */
  variant?: 'gold' | 'white' | 'light'
  size?: number
  /** Unique suffix so gradients never share an id. */
  idSuffix?: string
}

/**
 * Ugochukwu's own "U" monogram, drawn from
 * scratch for this portfolio. Not Bluezo's "B", not the reference site's mark.
 */
function Monogram({ variant = 'gold', size = 34, idSuffix = 'a' }: MonogramProps) {
  const gradientId = `monogram-gold-${idSuffix}`

  const discFill =
    variant === 'gold'
      ? '#f5ecee'
      : variant === 'white'
        ? '#ffffff'
        : 'rgba(255, 255, 255, 0.10)'

  const ringStroke =
    variant === 'light'
      ? 'rgba(101, 165, 141, 0.45)'
      : 'rgba(36, 109, 90, 0.35)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Mr Ugo monogram"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7b1720" />
          <stop offset="50%" stopColor="#aa4550" />
          <stop offset="100%" stopColor="#7b1720" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill={discFill} stroke={ringStroke} strokeWidth="2" />
      <path
        d="M21 17v18.6c0 8.1 4.9 12.9 11 12.9s11-4.8 11-12.9V17"
        fill="none"
        stroke={variant === 'light' ? '#e2b2b6' : `url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Monogram
