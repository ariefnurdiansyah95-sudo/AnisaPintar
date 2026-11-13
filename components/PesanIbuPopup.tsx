'use client'
import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@/context/ProgressContext'
import { PESAN_IBU_DEFAULT } from '@/lib/progress'
import { speak, stop } from '@/lib/speech'

/** Pesan penyemangat dari Ibu (foto + suara) saat anak sedang kesulitan. */
export default function PesanIbuPopup({ onTutup, otomatis = false }: { onTutup: () => void; otomatis?: boolean }) {
  const { state } = useProgress()
  const m = { ...PESAN_IBU_DEFAULT, ...(state.pesanIbu ?? {}) }
  const [buka, setBuka] = useState(true)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!m?.aktif) return
    stop()
    const t = setTimeout(() => {
      if (m.suara) { const a = new Audio(m.suara); audio.current = a; a.play().catch(() => speak(m.teks)) } else speak(m.teks)
    }, 400)
    return () => { clearTimeout(t); audio.current?.pause(); stop() }
  }, [m.aktif, m.suara, m.teks])

  if (!m?.aktif || !buka) return null
  const tutup = () => { audio.current?.pause(); stop(); setBuka(false); onTutup() }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-5" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm animate-pop rounded-[32px] border-4 border-white bg-[#FFF3F8] p-6 text-center shadow-chunkyLg">
        {m.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.foto} alt="Ibu" className="mx-auto h-40 w-40 rounded-full border-8 border-bubble object-cover shadow-chunky" />
        ) : <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-bubble/30 text-7xl">👩</div>}
        <p className="mt-3 text-sm font-extrabold uppercase tracking-wide text-bubble">Pesan dari Ibu 💌</p>
        <p className="mt-1 text-xl font-extrabold leading-snug">{m.teks}</p>
        <button onClick={tutup} className="btn btn-accent mt-5 w-full">{otomatis ? 'Oke, aku mau belajar lagi!' : 'Oke, aku coba lagi!'}</button>
      </div>
    </div>
  )
}
