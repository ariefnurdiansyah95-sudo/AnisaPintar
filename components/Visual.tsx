'use client'
import Emo from './Emo'

/** Menampilkan gambar soal/materi: emoji, bangun, jam, balok, bersusun, bar, hitung. */
export default function Visual({ v, size = 'lg' }: { v: string; size?: 'sm' | 'lg' }) {
  const big = size === 'lg'
  const s = v.split(':')
  const k = s[0]

  if (k === 'shape') return <Shape nama={s[1]} warna={Number(s[2] ?? 0)} px={big ? 130 : 56} />

  if (k === 'clock') return <Clock jam={Number(s[1])} px={big ? 170 : 70} />

  if (k === 'blok') {
    const n = Number(s[1])
    const p = Math.floor(n / 10)
    const sat = n % 10
    return (
      <div className="flex items-end justify-center gap-4 rounded-3xl bg-white p-3">
        <div className="flex gap-1">
          {Array.from({ length: p }, (_, i) => (
            <div key={i} className="flex flex-col gap-[2px] rounded bg-sky/20 p-[2px]">
              {Array.from({ length: 10 }, (_, j) => <div key={j} className={`${big ? 'h-3 w-5' : 'h-2 w-3'} rounded-sm bg-sky`} />)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: sat }, (_, i) => <div key={i} className={`${big ? 'h-5 w-5' : 'h-3 w-3'} rounded-sm bg-sun`} />)}
        </div>
      </div>
    )
  }

  if (k === 'susun') {
    const [, op, a, b] = s
    return (
      <div className={`mx-auto w-fit rounded-3xl border-4 border-ink/10 bg-white px-8 py-3 text-right font-extrabold tabular-nums ${big ? 'text-5xl' : 'text-2xl'}`}>
        <div>&nbsp;&nbsp;{a}</div>
        <div className="border-b-4 border-ink pb-1"><span className="mr-3 text-accent">{op}</span>{b}</div>
        <div className="text-accent">?</div>
      </div>
    )
  }

  if (k === 'bar') {
    const [x, y] = (s[1] ?? '').split(',').map(Number)
    const row = (n: number, c: string, l: string) => (
      <div className="flex items-center gap-2">
        <span className="w-6 text-xl font-extrabold">{l}</span>
        <div className="flex">{Array.from({ length: n }, (_, i) => <div key={i} className={`${big ? 'h-8 w-8' : 'h-5 w-5'} border-2 border-white ${c} ${i === 0 ? 'rounded-l-lg' : ''} ${i === n - 1 ? 'rounded-r-lg' : ''}`} />)}</div>
      </div>
    )
    return <div className="flex flex-col gap-2 rounded-3xl bg-white p-4">{row(x, 'bg-bubble', 'A')}{row(y, 'bg-sky', 'B')}</div>
  }

  if (k === 'hitung') {
    const n = Number(s[2])
    return <Emojis e={s[1]} n={n} big={big} />
  }
  if (k === 'tambah' || k === 'kurang') {
    const e = s[1]
    const a = Number(s[2])
    const c = Number(s[3])
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white p-3">
        <Emojis e={e} n={a} big={big} plain />
        <span className={`font-extrabold text-accent ${big ? 'text-5xl' : 'text-2xl'}`}>{k === 'tambah' ? '+' : '−'}</span>
        <Emojis e={e} n={c} big={big} plain coret={k === 'kurang'} />
      </div>
    )
  }

  // emoji / teks biasa
  return <div className={`text-center leading-tight ${big ? 'text-7xl' : 'text-4xl'}`}><Emo>{v}</Emo></div>
}

function Emojis({ e, n, big, plain, coret }: { e: string; n: number; big: boolean; plain?: boolean; coret?: boolean }) {
  return (
    <div className={`flex max-w-[280px] flex-wrap justify-center gap-1 ${plain ? '' : 'rounded-3xl bg-white p-3'}`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={`${big ? 'text-4xl' : 'text-2xl'} ${coret ? 'opacity-40 grayscale' : ''}`}><Emo>{e}</Emo></span>
      ))}
    </div>
  )
}

const WARNA_BANGUN = ['#FF7675', '#54A0FF', '#2ED573', '#FDCB6E', '#A29BFE', '#FF78B5']
export function Shape({ nama, warna = 0, px = 100 }: { nama: string; warna?: number; px?: number }) {
  const c = WARNA_BANGUN[warna % WARNA_BANGUN.length]
  const common = { fill: c, stroke: '#3B2F63', strokeWidth: 5, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 100 100" width={px} height={px} className="mx-auto" aria-label={nama}>
      {nama === 'lingkaran' && <circle cx="50" cy="50" r="42" {...common} />}
      {nama === 'segitiga' && <polygon points="50,10 92,88 8,88" {...common} />}
      {nama === 'persegi' && <rect x="14" y="14" width="72" height="72" rx="4" {...common} />}
      {nama === 'persegipanjang' && <rect x="6" y="26" width="88" height="48" rx="4" {...common} />}
    </svg>
  )
}

export function Clock({ jam, px = 150 }: { jam: number; px?: number }) {
  const h = jam % 12
  const ang = (h / 12) * 360
  return (
    <svg viewBox="0 0 120 120" width={px} height={px} className="mx-auto" aria-label={`jam ${jam}`}>
      <circle cx="60" cy="60" r="55" fill="#fff" stroke="#3B2F63" strokeWidth="5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i + 1) / 12) * Math.PI * 2
        return <text key={i} x={60 + Math.sin(a) * 42} y={60 - Math.cos(a) * 42 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#3B2F63">{i + 1}</text>
      })}
      {/* jarum menit di 12 */}
      <line x1="60" y1="60" x2="60" y2="16" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" />
      {/* jarum jam */}
      <line x1="60" y1="60" x2="60" y2="32" stroke="#3B2F63" strokeWidth="6" strokeLinecap="round" transform={`rotate(${ang} 60 60)`} />
      <circle cx="60" cy="60" r="5" fill="#3B2F63" />
    </svg>
  )
}
