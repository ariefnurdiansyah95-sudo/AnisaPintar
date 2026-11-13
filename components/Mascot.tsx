'use client'

export type Mood = 'senang' | 'mikir' | 'hore' | 'sedih'

/** Kak Bubu — guru virtual burung hantu (gambar SVG orisinal). */
export default function Mascot({ mood = 'senang', size = 120, bicara = false, className = '' }: { mood?: Mood; size?: number; bicara?: boolean; className?: string }) {
  const hore = mood === 'hore'
  const sedih = mood === 'sedih'
  const mikir = mood === 'mikir'
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={`${hore || bicara ? 'animate-bob' : ''} ${className}`} role="img" aria-label="Kak Bubu, guru burung hantu">
      {/* sayap belakang */}
      <ellipse cx="38" cy="124" rx="20" ry="36" fill="#8E7CF0" transform={hore ? 'rotate(35 38 124)' : 'rotate(-12 38 124)'} />
      <ellipse cx="162" cy="124" rx="20" ry="36" fill="#8E7CF0" transform={hore ? 'rotate(-35 162 124)' : 'rotate(12 162 124)'} />
      {/* badan */}
      <ellipse cx="100" cy="118" rx="64" ry="68" fill="#A29BFE" />
      <ellipse cx="100" cy="136" rx="40" ry="44" fill="#E9E6FF" />
      {/* telinga */}
      <path d="M44 62 L56 22 L82 50 Z" fill="#6C5CE7" />
      <path d="M156 62 L144 22 L118 50 Z" fill="#6C5CE7" />
      {/* topi wisuda */}
      <polygon points="100,16 150,36 100,52 50,36" fill="#3B2F63" />
      <rect x="82" y="44" width="36" height="12" rx="3" fill="#3B2F63" />
      <line x1="146" y1="38" x2="150" y2="62" stroke="#FF9F43" strokeWidth="4" strokeLinecap="round" />
      <circle cx="150" cy="64" r="5" fill="#FF9F43" />
      {/* mata */}
      <circle cx="72" cy="92" r="27" fill="#fff" stroke="#3B2F63" strokeWidth="4" />
      <circle cx="128" cy="92" r="27" fill="#fff" stroke="#3B2F63" strokeWidth="4" />
      <g className={sedih ? '' : 'owl-blink'}>
        <circle cx={mikir ? 80 : 72} cy={mikir ? 86 : sedih ? 98 : 93} r="12" fill="#3B2F63" />
        <circle cx={mikir ? 136 : 128} cy={mikir ? 86 : sedih ? 98 : 93} r="12" fill="#3B2F63" />
        <circle cx={mikir ? 84 : 76} cy={mikir ? 82 : sedih ? 94 : 89} r="4" fill="#fff" />
        <circle cx={mikir ? 140 : 132} cy={mikir ? 82 : sedih ? 94 : 89} r="4" fill="#fff" />
      </g>
      {/* alis */}
      {sedih && (<><path d="M48 66 Q64 60 90 72" stroke="#3B2F63" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M152 66 Q136 60 110 72" stroke="#3B2F63" strokeWidth="5" fill="none" strokeLinecap="round" /></>)}
      {mikir && <path d="M110 66 Q128 56 150 68" stroke="#3B2F63" strokeWidth="5" fill="none" strokeLinecap="round" />}
      {/* paruh */}
      <path d="M90 112 L110 112 L100 130 Z" fill="#FF9F43" stroke="#E8710A" strokeWidth="3" strokeLinejoin="round" />
      {/* pipi */}
      <circle cx="54" cy="116" r="8" fill="#FF78B5" opacity="0.55" />
      <circle cx="146" cy="116" r="8" fill="#FF78B5" opacity="0.55" />
      {/* mulut tambahan saat hore */}
      {hore && <path d="M88 134 Q100 148 112 134 Z" fill="#FF6B6B" />}
      {sedih && <path d="M90 140 Q100 132 110 140" stroke="#3B2F63" strokeWidth="4" fill="none" strokeLinecap="round" />}
      {/* kaki */}
      <path d="M78 184 l-8 10 M78 184 l0 12 M78 184 l8 10" stroke="#FF9F43" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M122 184 l-8 10 M122 184 l0 12 M122 184 l8 10" stroke="#FF9F43" strokeWidth="5" strokeLinecap="round" fill="none" />
      {mikir && <text x="158" y="40" fontSize="30" fontWeight="800" fill="#FF9F43">?</text>}
      {hore && (<><text x="14" y="40" fontSize="26">✨</text><text x="160" y="40" fontSize="26">⭐</text></>)}
    </svg>
  )
}
