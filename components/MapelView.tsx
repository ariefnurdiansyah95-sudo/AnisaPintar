'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronLeft } from 'lucide-react'
import type { Level, MapelId } from '@/lib/types'
import { SUBJECT_MAP, LEVEL_EMOJI, LEVEL_NAMA, hexOf } from '@/lib/subjects'
import { LESSONS_BY_MAPEL } from '@/lib/lessons'
import { BY_MAPEL } from '@/lib/bank'
import { useProgress } from '@/context/ProgressContext'
import { bagusAkurasi } from '@/lib/progress'
import { sfx } from '@/lib/speech'
import Emo from '@/components/Emo'

export default function MapelView({ id }: { id: MapelId }) {
  const s = SUBJECT_MAP[id]
  const { state } = useProgress()
  const [tab, setTab] = useState<'materi' | 'latihan'>('materi')
  const [topik, setTopik] = useState<string>('')
  const [level, setLevel] = useState<Level | 0>(0)
  const lessons = LESSONS_BY_MAPEL[id]
  const st = state.mapelStat[id]
  const jumlah = (t: string, l: Level | 0) => BY_MAPEL[id].filter((q) => (!t || q.topik === t) && (!l || q.level === l)).length
  const href = `/kuis?mode=bank&mapel=${id}${topik ? `&topik=${topik}` : ''}${level ? `&level=${level}` : ''}`

  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-1 font-extrabold text-accent"><ChevronLeft /> Beranda</Link>
      <div className={`rounded-[28px] border-4 border-white/60 p-5 text-white shadow-chunkyLg`} style={{ background: hexOf(s.warna) }}>
        <div className="flex items-center gap-4">
          <span className="text-7xl"><Emo>{s.emoji}</Emo></span>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">{s.nama}</h1>
            <p className="font-bold text-white/90">{s.deskripsi}</p>
            {st && <p className="mt-1 inline-block rounded-full bg-white/30 px-3 text-sm font-extrabold">Akurasi {bagusAkurasi(st.n, st.b)}% · {st.n} soal dijawab</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-3xl bg-white p-1.5 shadow-chunky">
        {(['materi', 'latihan'] as const).map((t) => (
          <button key={t} onClick={() => { sfx('klik'); setTab(t) }} className={`rounded-2xl py-3 text-lg font-extrabold ${tab === t ? 'bg-accent text-white' : 'text-ink/60'}`}><Emo>{t === 'materi' ? '📘 Belajar Materi' : '✏️ Bank Soal'}</Emo></button>
        ))}
      </div>

      {tab === 'materi' ? (
        <ul className="space-y-3">
          {lessons.map((l, k) => {
            const done = !!state.lessons[`${id}/${l.id}`]
            return (
              <li key={l.id}>
                <Link href={`/belajar/${id}/${l.id}`} className="card flex items-center gap-4 !p-4 active:translate-y-1">
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cream text-4xl"><Emo>{l.emoji}</Emo>
                    {done && <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-good text-white"><Check size={18} strokeWidth={4} /></span>}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-extrabold text-ink/40">Materi {k + 1}</p>
                    <p className="text-xl font-extrabold leading-tight">{l.judul}</p>
                    <p className="text-sm font-semibold text-ink/60">{l.ringkas}</p>
                  </div>
                  <span className="rounded-full bg-sun px-3 py-1 text-sm font-extrabold text-white">{done ? 'Ulang' : 'Mulai'}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="space-y-4">
          <div className="card">
            <p className="mb-2 text-lg font-extrabold">1. Pilih topik</p>
            <div className="flex flex-wrap gap-2">
              <Pill on={topik === ''} onClick={() => setTopik('')}><Emo>🌈 Semua topik</Emo></Pill>
              {s.topik.map((t) => <Pill key={t.id} on={topik === t.id} onClick={() => setTopik(t.id)}><Emo>{t.emoji}</Emo> {t.nama}</Pill>)}
            </div>
            <p className="mb-2 mt-5 text-lg font-extrabold">2. Pilih tingkat</p>
            <div className="grid grid-cols-2 gap-2">
              <Pill on={level === 0} onClick={() => setLevel(0)}><Emo>🎲 Campur</Emo></Pill>
              {([1, 2, 3] as Level[]).map((l) => <Pill key={l} on={level === l} onClick={() => setLevel(l)}><Emo>{LEVEL_EMOJI[l]}</Emo> {LEVEL_NAMA[l]}</Pill>)}
            </div>
            <p className="mt-3 text-center text-sm font-bold text-ink/50">{jumlah(topik, level)} soal tersedia</p>
          </div>
          <Link href={href} className="btn btn-accent w-full text-2xl">Mulai latihan <Emo>🚀</Emo></Link>
          <Link href={`/kuis?mode=evaluasi&mapel=${id}`} className="btn btn-sky w-full"><Emo>📊 Cek kemampuanku</Emo></Link>
        </div>
      )}
    </div>
  )
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={() => { sfx('klik'); onClick() }} className={`rounded-2xl border-4 px-3 py-2 text-base font-extrabold ${on ? 'border-accent bg-accent text-white' : 'border-ink/10 bg-white'}`}>{children}</button>
}
