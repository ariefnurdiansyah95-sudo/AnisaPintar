'use client'
import { useEffect, useMemo } from 'react'
import { Volume2 } from 'lucide-react'
import { speak, stop, sfx } from '@/lib/speech'
import Mascot, { type Mood } from './Mascot'
import Emo from './Emo'

export function SpeakButton({ text, lang = 'id-ID', size = 'md', label = 'Dengarkan' }: { text: string; lang?: 'id-ID' | 'en-US'; size?: 'sm' | 'md'; label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => { sfx('klik'); stop(); speak(text, lang) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-sky text-white shadow-chunky active:translate-y-1 active:shadow-none ${size === 'sm' ? 'h-10 w-10' : 'h-14 w-14'}`}
    >
      <Volume2 size={size === 'sm' ? 20 : 28} />
    </button>
  )
}

/** Kak Bubu + gelembung ucapan. */
export function Guru({ mood = 'senang', children, size = 96 }: { mood?: Mood; children: React.ReactNode; size?: number }) {
  return (
    <div className="flex items-end gap-2">
      <Mascot mood={mood} size={size} />
      <div className="relative mb-4 flex-1 rounded-3xl rounded-bl-md border-4 border-accent/30 bg-white p-4 text-lg font-bold leading-snug shadow-chunky animate-pop">
        {children}
      </div>
    </div>
  )
}

export function ProgressBar({ pct, warna = 'bg-good', tinggi = 'h-4' }: { pct: number; warna?: string; tinggi?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full border-2 border-ink/10 bg-white ${tinggi}`}>
      <div className={`h-full rounded-full transition-all duration-500 ${warna}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  )
}

const KONFETI = ['#FF6B6B', '#FDCB6E', '#2ED573', '#54A0FF', '#A29BFE', '#FF78B5']
export function Confetti({ aktif = true }: { aktif?: boolean }) {
  const pcs = useMemo(
    () => Array.from({ length: 42 }, (_, i) => ({ i, left: (i * 37) % 100, delay: ((i * 13) % 20) / 10, c: KONFETI[i % KONFETI.length], w: 8 + (i % 4) * 3 })),
    [],
  )
  if (!aktif) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pcs.map((p) => (
        <span key={p.i} className="absolute top-0 animate-fall rounded-sm" style={{ left: `${p.left}%`, width: p.w, height: p.w * 1.6, background: p.c, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  )
}

export function Bintang({ n, besar = false }: { n: number; besar?: boolean }) {
  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`${besar ? 'text-6xl' : 'text-3xl'} ${i <= n ? 'animate-pop' : 'opacity-25 grayscale'}`} style={{ animationDelay: `${i * 0.2}s` }}><Emo>⭐</Emo></span>
      ))}
    </div>
  )
}

export function useBodyLock(on: boolean) {
  useEffect(() => {
    if (!on) return
    const p = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = p }
  }, [on])
}
