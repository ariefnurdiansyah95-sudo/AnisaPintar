'use client'
import Link from 'next/link'
import { useProgress } from '@/context/ProgressContext'
import { SUBJECTS, hexOf } from '@/lib/subjects'
import { bintang } from '@/lib/progress'
import { Bintang, Guru } from '@/components/ui'
import Emo from '@/components/Emo'

export default function Ulangan() {
  const { state } = useProgress()
  const riwayat = [...state.ulangan].reverse().slice(0, 8)
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold"><Emo>🏆</Emo> Ulangan Harian</h1>
      <Guru mood="mikir">Ini simulasi ulangan. Kak Bubu tidak memberi tahu benar atau salah dulu. Nanti di akhir kita lihat bersama-sama ya!</Guru>
      <Link href="/kuis?mode=ulangan&n=10" className="btn btn-accent w-full text-2xl"><Emo>🎲</Emo> Ulangan campuran (10 soal)</Link>
      <div>
        <h2 className="mb-2 text-xl font-extrabold">Atau pilih pelajaran</h2>
        <div className="grid grid-cols-2 gap-3">
          {SUBJECTS.map((s) => (
            <Link key={s.id} href={`/kuis?mode=ulangan&mapel=${s.id}&n=10`} className={`flex items-center gap-2 rounded-3xl border-4 border-white/60 p-3 text-white shadow-chunky active:translate-y-1`} style={{ background: hexOf(s.warna) }}>
              <span className="text-4xl"><Emo>{s.emoji}</Emo></span><span className="font-extrabold leading-tight">{s.nama}</span>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-extrabold">Nilai terakhir</h2>
        {riwayat.length === 0 ? <p className="card text-center font-bold text-ink/50">Belum ada ulangan.</p> : (
          <ul className="space-y-2">
            {riwayat.map((u) => (
              <li key={u.ts} className="card flex items-center gap-3 !p-3">
                <span className="text-3xl">{u.mapel ? SUBJECTS.find((s) => s.id === u.mapel)?.emoji : '🎲'}</span>
                <div className="flex-1"><p className="font-extrabold">{new Date(u.ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p><p className="text-sm font-bold text-ink/50">{u.benar}/{u.total} benar</p></div>
                <Bintang n={bintang(u.skor)} />
                <span className="w-12 text-right text-2xl font-extrabold text-accent">{u.skor}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
