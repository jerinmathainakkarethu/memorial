export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#1e293b" />
      <path d="M20 38Q24 26 32 20Q40 26 44 38Q40 34 32 30Q24 34 20 38Z" fill="#d4af37" />
      <path d="M32 20Q36 14 42 12Q38 16 34 20Z" fill="#f0d680" />
      <line x1="32" y1="30" x2="32" y2="44" stroke="#d4af37" strokeWidth="1.5" />
      <path d="M28 42Q32 46 36 42" stroke="#d4af37" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
