'use client'
import { useProgress } from '@/context/ProgressContext'
import { GELAR, gelar, hitungLencana, levelInfo, streakHari } from '@/lib/progress'
import { ProgressBar } from '@/components/ui'
import Mascot from '@/components/Mascot'
import { sfx } from '@/lib/speech'
import Emo from '@/components/Emo'

const AVATAR = ['🦊', '🐼', '🐯', '🐰', '🐸', '🦁', '🐵', '🐙', '🦄', '🐶', '🐱', '🐻']

export default function Hadiah() {
  const { state, update } = useProgress()
  const lv = levelInfo(state.xp)
  const lencana = hitungLencana(state)
  const dapat = lencana.filter((b) => b.ok).length
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold"><Emo>🎁</Emo> Hadiahku</h1>
      <div className="card flex items-center gap-4 bg-gradient-to-br from-[#FFF3D6] to-white">
        <Mascot mood="hore" size={100} />
        <div className="flex-1">
          <p className="text-sm font-extrabold uppercase text-sun-dark">Level {lv.level}</p>
          <p className="text-2xl font-extrabold leading-tight">{gelar(lv.level)}</p>
          <div className="my-2"><ProgressBar pct={lv.pct} warna="bg-sun" tinggi="h-5" /></div>
          <p className="text-sm font-bold text-ink/60">{state.xp} XP · {lv.sisa} XP lagi ke level berikutnya</p>
          <p className="text-sm font-bold text-ink/60">🔥 Belajar berturut-turut: {streakHari(state)} hari</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-xl font-extrabold">Lencanaku ({dapat}/{lencana.length})</h2>
        <div className="grid grid-cols-2 gap-3">
          {lencana.map((b) => (
            <div key={b.id} className={`card !p-3 text-center ${b.ok ? 'border-sun bg-[#FFF9E6]' : 'opacity-60'}`}>
              <div className={`text-5xl ${b.ok ? '' : 'grayscale'}`}><Emo>{b.ok ? b.emoji : '🔒'}</Emo></div>
              <p className="mt-1 font-extrabold leading-tight">{b.nama}</p>
              <p className="text-xs font-bold text-ink/60">{b.desk}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-extrabold">Pilih temanku</h2>
        <div className="grid grid-cols-6 gap-2">
          {AVATAR.map((a) => (
            <button key={a} onClick={() => { sfx('klik'); update((s) => ({ ...s, avatar: a })) }} className={`tap-pop rounded-2xl p-2 text-3xl ${state.avatar === a ? 'bg-accent/20 ring-4 ring-accent' : 'bg-cream'}`}><Emo>{a}</Emo></button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-extrabold">Gelar yang bisa diraih</h2>
        <ol className="space-y-1 font-bold">
          {GELAR.map((g, i) => <li key={g} className={lv.level === i + 1 ? 'text-accent' : i + 1 < lv.level ? 'text-good' : 'text-ink/40'}>{i + 1 < lv.level ? '✅' : lv.level === i + 1 ? '👉' : '⬜'} Level {i + 1}: {g}</li>)}
        </ol>
      </section>
    </div>
  )
}
