import Link from 'next/link'
import { GAMES } from '@/components/games/list'
import { hexOf } from '@/lib/subjects'
import Emo from '@/components/Emo'

export const metadata = { title: 'Kreasi & Permainan' }
export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold"><Emo>🎨</Emo> Kreasi & Permainan</h1>
      <p className="font-bold text-ink/70">Belajar tidak harus serius. Ayo menggambar, mewarnai, dan bermain!</p>
      <div className="grid grid-cols-2 gap-4">
        {GAMES.map((g) => (
          <Link key={g.id} href={`/kreasi/${g.id}`} className={`wiggle flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-[28px] border-4 border-white/60 p-4 text-center text-white shadow-chunkyLg active:translate-y-1`} style={{ background: hexOf(g.warna) }}>
            <span className="text-6xl"><Emo>{g.emoji}</Emo></span>
            <span className="text-xl font-extrabold leading-tight">{g.nama}</span>
            <span className="text-xs font-bold text-white/90">{g.desk}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
