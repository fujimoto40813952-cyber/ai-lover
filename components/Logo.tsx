type LogoProps = {
  size?: number
  className?: string
  glow?: boolean
}

/**
 * AI Lover ブランドロゴ（絵文字💝の置き換え）。
 * ハートにきらめき（spark）を重ねた、ピンク→パープルのグラデーションマーク。
 */
export default function Logo({ size = 64, className = '', glow = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AI Lover"
      className={className}
    >
      <defs>
        <linearGradient id="loverHeart" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="loverSpark" x1="40" y1="8" x2="56" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" />
          <stop offset="1" stopColor="#f9a8d4" />
        </linearGradient>
        {glow && (
          <filter id="loverGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={glow ? 'url(#loverGlow)' : undefined}>
        {/* Heart */}
        <path
          d="M32 54.5C32 54.5 7.5 40.2 7.5 23.2C7.5 15.1 13.9 9 21.4 9C26.2 9 30.1 11.6 32 15.6C33.9 11.6 37.8 9 42.6 9C50.1 9 56.5 15.1 56.5 23.2C56.5 40.2 32 54.5 32 54.5Z"
          fill="url(#loverHeart)"
        />
        {/* Soft highlight */}
        <path
          d="M21.4 14.5C16.9 14.5 13.2 18.1 13.2 23.2C13.2 24.8 13.6 26.4 14.3 28C14.3 28 14 20 21.4 18.5C24.2 17.9 25.6 16.2 24.8 15.2C24.1 14.4 22.7 14.5 21.4 14.5Z"
          fill="#ffffff"
          fillOpacity="0.35"
        />
        {/* Spark */}
        <path
          d="M47 9.5L48.9 14.6L54 16.5L48.9 18.4L47 23.5L45.1 18.4L40 16.5L45.1 14.6L47 9.5Z"
          fill="url(#loverSpark)"
        />
      </g>
    </svg>
  )
}
