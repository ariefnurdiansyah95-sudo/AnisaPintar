'use client'
import Link from 'next/link'
import { Flame, Settings, Sparkles } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { SUBJECTS, hexOf } from '@/lib/subjects'
import { gelar, levelInfo, soalSalahIds, streakHari, todayKey } from '@/lib/progress'
import { ALL_LESSONS } from '@/lib/lessons'
import { speak } from '@/lib/speech'
import Mascot from '@/components/Mascot'
import { ProgressBar } from '@/components/ui'
import Emo from '@/components/Emo'

export default function Home() {
  const { state, ready } = useProgress()
  const lv = levelInfo(state.xp)
  const streak = ready ? streakHari(state) : 0
  const salah = ready ? soalSalahIds(state).length : 0
  const harianSkor = state.harianDone[todayKey()]
  const jam = new Date().getHours()
  const sapa = jam < 11 ? 'Selamat pagi' : jam < 15 ? 'Selamat siang' : jam < 18 ? 'Selamat sore' : 'Selamat malam'
  const selesai = (m: string) => ALL_LESSONS.filter((l) => l.mapel === m && state.lessons[`${l.mapel}/${l.id}`]).length
  const total = (m: string) => ALL_LESSONS.filter((l) => l.mapel === m).length

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wider text-accent">Anisa Pintar</p>
          <h1 className="text-3xl font-extrabold leading-tight">{sapa}, {state.nama}! <Emo>{state.avatar}</Emo></h1>
        </div>
        <Link href="/orangtua" aria-label="Orang tua" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink/50 shadow-chunky"><Settings size={22} /></Link>
      </header>

      <section className="card flex items-center gap-3 bg-gradient-to-br from-[#EFEBFF] to-white">
        <button onClick={() => speak(`${sapa} ${state.nama}! Aku Kak Bubu. Ayo kita belajar sambil bermain.`)} aria-label="Sapa Kak Bubu" className="shrink-0 tap-pop">
          <Mascot mood="hore" size={110} />
        </button>
        <div className="flex-1">
          <p className="text-lg font-bold leading-snug">Halo! Aku Kak Bubu. Ayo kita belajar sambil bermain!</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-extrabold">
            <span className="chip border-accent/30 text-accent-dark">Level {lv.level} · {gelar(lv.level)}</span>
            {streak > 0 && <span className="chip border-sun/40 text-sun-dark"><Flame size={14} /> {streak} hari</span>}
          </div>
          <div className="mt-2"><ProgressBar pct={lv.pct} warna="bg-accent" /></div>
          <p className="mt-1 text-xs font-bold text-ink/50">{lv.sisa} XP lagi menuju Level {lv.level + 1}</p>
        </div>
      </section>

      <Link href="/kuis?mode=harian" className="relative flex items-center gap-4 overflow-hidden rounded-[28px] border-4 border-sun-dark/30 bg-sun p-5 text-white shadow-chunkyLg active:translate-y-1 active:shadow-none">
        <span className="text-6xl animate-bob"><Emo>🎒</Emo></span>
        <div className="flex-1">
          <p className="text-2xl font-extrabold">Latihan Hari Ini</p>
          <p className="font-bold text-white/90">{harianSkor !== undefined ? `Sudah selesai · nilai ${harianSkor}. Main lagi yuk!` : '12 soal campur, ada pengulangan soal yang salah'}</p>
        </div>
        <Sparkles size={34} />
      </Link>

      <section>
        <h2 className="mb-3 text-2xl font-extrabold">Pilih pelajaran</h2>
        <div className="grid grid-cols-2 gap-4">
          {SUBJECTS.map((s) => {
            const sel = selesai(s.id)
            const tot = total(s.id)
            return (
              <Link key={s.id} href={`/mapel/${s.id}`} className={`wiggle relative flex min-h-[150px] flex-col items-center justify-between rounded-[28px] border-4 border-white/60 p-4 text-center text-white shadow-chunkyLg active:translate-y-1 active:shadow-none`} style={{ background: hexOf(s.warna) }}>
                <span className="text-6xl drop-shadow"><Emo>{s.emoji}</Emo></span>
                <div>
                  <p className="text-lg font-extrabold leading-tight">{s.nama}</p>
                  <p className="mt-1 rounded-full bg-white/30 px-2 text-xs font-extrabold">{sel}/{tot} materi</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Link href="/kuis?mode=ulang" className={`card flex flex-col items-center gap-1 text-center ${salah ? '' : 'opacity-60'}`}>
          <span className="text-4xl"><Emo>🔁</Emo></span>
          <span className="font-extrabold">Ulangi yang Salah</span>
          <span className="text-sm font-bold text-ink/60">{salah ? `${salah} soal menunggu` : 'Belum ada'}</span>
        </Link>
        <Link href="/ulangan" className="card flex flex-col items-center gap-1 text-center">
          <span className="text-4xl"><Emo>🏆</Emo></span>
          <span className="font-extrabold">Ulangan Harian</span>
          <span className="text-sm font-bold text-ink/60">Tes tanpa bantuan</span>
        </Link>
      </section>
    </div>
  )
}
