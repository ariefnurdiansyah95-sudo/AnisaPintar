import { EMOJI_ADA } from '@/lib/emojiSet'

// Emoji bawaan perangkat tampil beda-beda (di Windows terlihat kaku). Komponen ini menggantinya
// dengan gambar Twemoji (CC-BY 4.0, Twitter/X) yang ceria dan sama di semua perangkat. Jika gambarnya tidak ada, dipakai emoji biasa.
const RX = /(\p{Regional_Indicator}{2}|\p{Extended_Pictographic}[️\u{1F3FB}-\u{1F3FF}]*(?:‍\p{Extended_Pictographic}[️]*)*)/u

const kunci = (e: string) => Array.from(e).filter((c) => c !== '️').map((c) => c.codePointAt(0)!.toString(16)).join('-')

export default function Emo({ children, className = '' }: { children: string; className?: string }) {
  const parts = String(children).split(RX)
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return p
        const k = kunci(p)
        if (!EMOJI_ADA.has(k)) return p
        return (
          <svg key={i} role="img" aria-label={p} viewBox="0 0 36 36" className={`inline-block h-[1.15em] w-[1.15em] align-[-0.2em] ${className}`}>
            <use href={`/emoji-sprite.svg#e-${k}`} />
          </svg>
        )
      })}
    </>
  )
}
