type MonogramProps = {
  /** 'gold' sits on the cream page, 'light' sits on the dark footer. */
  variant?: 'gold' | 'light'
  size?: number
  /** Unique suffix so the two gradients never share an id. */
  idSuffix?: string
}

/**
 * Ugochukwu's own "U" monogram — a cream disc with a gold U, drawn from
 * scratch for this portfolio. Not Bluezo's "B", not the reference site's mark.
 */
function Monogram({ variant = 'gold', size = 34, idSuffix = 'a' }: MonogramProps) {
  const gradientId = `monogram-gold-${idSuffix}`
  const isGold = variant === 'gold'

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

      <circle
        cx="32"
        cy="32"
        r="30"
        fill={isGold ? '#f3eee3' : 'rgba(255, 255, 255, 0.10)'}
        stroke={isGold ? 'rgba(200, 139, 17, 0.35)' : 'rgba(228, 178, 72, 0.45)'}
        strokeWidth="2"
      />
      <path
        d="M21 17v18.6c0 8.1 4.9 12.9 11 12.9s11-4.8 11-12.9V17"
        fill="none"
        stroke={isGold ? `url(#${gradientId})` : '#e4b248'}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Monogram
