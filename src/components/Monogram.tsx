type MonogramProps = {
  /** 'gold' on the cream page, 'white' disc for the dark footer bar. */
  variant?: 'gold' | 'white' | 'light'
  size?: number
  /** Unique suffix so gradients never share an id. */
  idSuffix?: string
}

/**
 * Ugochukwu's own "U" monogram — a cream disc with a gold U, drawn from
 * scratch for this portfolio. Not Bluezo's "B", not the reference site's mark.
 */
function Monogram({ variant = 'gold', size = 34, idSuffix = 'a' }: MonogramProps) {
  const gradientId = `monogram-gold-${idSuffix}`

  const discFill =
    variant === 'gold'
      ? '#f3eee3'
      : variant === 'white'
        ? '#ffffff'
        : 'rgba(255, 255, 255, 0.10)'

  const ringStroke =
    variant === 'light'
      ? 'rgba(228, 178, 72, 0.45)'
      : 'rgba(200, 139, 17, 0.35)'

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
          <stop offset="0%" stopColor="#c99022" />
          <stop offset="50%" stopColor="#e4b248" />
          <stop offset="100%" stopColor="#c98917" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="30" fill={discFill} stroke={ringStroke} strokeWidth="2" />
      <path
        d="M21 17v18.6c0 8.1 4.9 12.9 11 12.9s11-4.8 11-12.9V17"
        fill="none"
        stroke={variant === 'light' ? '#e4b248' : `url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Monogram
